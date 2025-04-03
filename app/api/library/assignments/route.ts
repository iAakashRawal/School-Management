import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// Schema for assignment creation validation
const createAssignmentSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  issueDate: z.string().transform(val => new Date(val)),
  dueDate: z.string().transform(val => new Date(val)),
});

// GET endpoint to fetch all assignments with filters
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where: any = {};
    
    if (search) {
      where.OR = [
        { 
          book: { 
            title: { contains: search, mode: 'insensitive' },
          },
        },
        { 
          student: { 
            user: { 
              name: { contains: search, mode: 'insensitive' },
            },
          },
        },
      ];
    }
    
    if (status && status !== 'All Statuses') {
      where.status = status;
    }
    
    if (studentId) {
      where.studentId = studentId;
    }
    
    // Execute query with pagination
    const [assignments, totalCount] = await Promise.all([
      prisma.libraryAssignment.findMany({
        where,
        take: limit,
        skip,
        orderBy: { issueDate: 'desc' },
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
      }),
      prisma.libraryAssignment.count({ where }),
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      status: 'success',
      data: {
        assignments,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new book assignment (issue a book)
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }
    
    // Only admins and librarians can issue books
    if (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'You do not have permission to issue books' },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createAssignmentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Validation failed', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    const { bookId, studentId, issueDate, dueDate } = validationResult.data;
    
    // Check if book exists and has available copies
    const book = await prisma.libraryBook.findUnique({
      where: { id: bookId },
    });
    
    if (!book) {
      return NextResponse.json(
        { status: 'error', error: 'Book not found' },
        { status: 404 }
      );
    }
    
    if (book.availableCopies <= 0) {
      return NextResponse.json(
        { status: 'error', error: 'No available copies of this book' },
        { status: 400 }
      );
    }
    
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    
    if (!student) {
      return NextResponse.json(
        { status: 'error', error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Check if student already has this book
    const existingAssignment = await prisma.libraryAssignment.findFirst({
      where: {
        bookId,
        studentId,
        status: {
          in: ['ISSUED', 'OVERDUE']
        }
      },
    });
    
    if (existingAssignment) {
      return NextResponse.json(
        { status: 'error', error: 'Student already has this book issued' },
        { status: 400 }
      );
    }
    
    // Create the assignment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the assignment
      const assignment = await tx.libraryAssignment.create({
        data: {
          bookId,
          studentId,
          issueDate,
          dueDate,
          status: 'ISSUED',
        },
      });
      
      // Update available copies
      await tx.libraryBook.update({
        where: { id: bookId },
        data: {
          availableCopies: {
            decrement: 1
          }
        },
      });
      
      return assignment;
    });
    
    return NextResponse.json({
      status: 'success',
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to issue book' },
      { status: 500 }
    );
  }
} 