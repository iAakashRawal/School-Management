import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// Schema for book creation validation
const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  category: z.string().min(1, 'Category is required'),
  totalCopies: z.number().int().positive(),
  availableCopies: z.number().int().min(0),
});

// GET endpoint to fetch all books with pagination, filtering, and search
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
    const category = searchParams.get('category');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category && category !== 'All Categories') {
      where.category = category;
    }
    
    // Execute query with pagination
    const [books, totalCount] = await Promise.all([
      prisma.libraryBook.findMany({
        where,
        take: limit,
        skip,
        orderBy: { title: 'asc' },
        include: {
          _count: {
            select: { assignments: true }
          }
        }
      }),
      prisma.libraryBook.count({ where }),
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      status: 'success',
      data: {
        books,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new book
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
    
    // Only admins can create books
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to create books' },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createBookSchema.safeParse(body);
    
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
    
    const { title, author, isbn, category, totalCopies, availableCopies } = validationResult.data;
    
    // Check if book with ISBN already exists
    const existingBook = await prisma.libraryBook.findUnique({
      where: { isbn },
    });
    
    if (existingBook) {
      return NextResponse.json(
        { status: 'error', error: 'A book with this ISBN already exists' },
        { status: 400 }
      );
    }
    
    // Create the book
    const newBook = await prisma.libraryBook.create({
      data: {
        title,
        author,
        isbn,
        category,
        totalCopies,
        availableCopies,
      },
    });
    
    return NextResponse.json({
      status: 'success',
      data: newBook,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to create book' },
      { status: 500 }
    );
  }
} 