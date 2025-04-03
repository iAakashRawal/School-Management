import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, BookStatus } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// Schema for assignment update validation
const updateAssignmentSchema = z.object({
  status: z.enum(['ISSUED', 'RETURNED', 'OVERDUE', 'LOST']).optional(),
  returnDate: z.string().transform(val => new Date(val)).optional(),
  remarks: z.string().optional(),
});

// GET endpoint to fetch a single assignment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }

    const id = params.id;

    // Fetch the assignment with related data
    const assignment = await prisma.libraryAssignment.findUnique({
      where: { id },
      include: {
        book: true,
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            class: true,
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { status: 'error', error: 'Assignment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: assignment,
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch assignment' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update an assignment (return a book, mark as lost, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }

    // Only admins and librarians can update book assignments
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'You do not have permission to update book assignments' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if assignment exists
    const existingAssignment = await prisma.libraryAssignment.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { status: 'error', error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateAssignmentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const oldStatus = existingAssignment.status;
    const newStatus = data.status || oldStatus;

    // Handle updates in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the assignment
      const updatedAssignment = await tx.libraryAssignment.update({
        where: { id },
        data,
      });

      // If returning the book and status is changing from ISSUED/OVERDUE to RETURNED
      if (
        newStatus === 'RETURNED' &&
        (oldStatus === 'ISSUED' || oldStatus === 'OVERDUE')
      ) {
        // Increment available copies
        await tx.libraryBook.update({
          where: { id: existingAssignment.bookId },
          data: {
            availableCopies: {
              increment: 1,
            },
          },
        });
      }

      // If marking as returned after being marked as lost
      if (newStatus === 'RETURNED' && oldStatus === 'LOST') {
        // Increment available copies and total copies
        await tx.libraryBook.update({
          where: { id: existingAssignment.bookId },
          data: {
            availableCopies: {
              increment: 1,
            },
          },
        });
      }

      // If marking as lost
      if (newStatus === 'LOST' && oldStatus !== 'LOST') {
        // No need to decrement available copies if already checked out
        // We only need to decrement if changing from RETURNED to LOST
        if (oldStatus === 'RETURNED') {
          await tx.libraryBook.update({
            where: { id: existingAssignment.bookId },
            data: {
              availableCopies: {
                decrement: 1,
              },
            },
          });
        }
      }

      return updatedAssignment;
    });

    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to update assignment' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete an assignment record
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }

    // Only admins can delete assignment records
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to delete assignment records' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if assignment exists
    const existingAssignment = await prisma.libraryAssignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { status: 'error', error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Check if book is still out (not returned)
    if (
      existingAssignment.status === 'ISSUED' ||
      existingAssignment.status === 'OVERDUE'
    ) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Cannot delete an active assignment. Book must be returned first.',
        },
        { status: 400 }
      );
    }

    // Delete the assignment
    await prisma.libraryAssignment.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Assignment record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to delete assignment record' },
      { status: 500 }
    );
  }
} 