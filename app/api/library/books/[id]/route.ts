import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// Schema for book update validation
const updateBookSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  author: z.string().min(1, 'Author is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  totalCopies: z.number().int().positive().optional(),
  availableCopies: z.number().int().min(0).optional(),
});

// GET endpoint to fetch a single book by ID
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

    // Fetch the book with assignments
    const book = await prisma.libraryBook.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { status: 'error', error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: book,
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a book
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

    // Only admins can update books
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to update books' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if book exists
    const existingBook = await prisma.libraryBook.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return NextResponse.json(
        { status: 'error', error: 'Book not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateBookSchema.safeParse(body);

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

    // Update the book
    const updatedBook = await prisma.libraryBook.update({
      where: { id },
      data: validationResult.data,
    });

    return NextResponse.json({
      status: 'success',
      data: updatedBook,
    });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a book
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

    // Only admins can delete books
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to delete books' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if book exists
    const existingBook = await prisma.libraryBook.findUnique({
      where: { id },
      include: { assignments: true },
    });

    if (!existingBook) {
      return NextResponse.json(
        { status: 'error', error: 'Book not found' },
        { status: 404 }
      );
    }

    // Check if book has active assignments
    const activeAssignments = existingBook.assignments.filter(
      (assignment) => assignment.status === 'ISSUED' || assignment.status === 'OVERDUE'
    );

    if (activeAssignments.length > 0) {
      return NextResponse.json(
        { 
          status: 'error', 
          error: 'Cannot delete book with active assignments',
          activeAssignments: activeAssignments.length
        },
        { status: 400 }
      );
    }

    // Delete all assignments related to the book
    await prisma.libraryAssignment.deleteMany({
      where: { bookId: id },
    });

    // Delete the book
    await prisma.libraryBook.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Book deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to delete book' },
      { status: 500 }
    );
  }
} 