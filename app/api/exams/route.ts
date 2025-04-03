import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: List all exams with pagination
export async function GET(request: NextRequest) {
  try {
    // Authenticate request - only admin and teachers can view exams
    const auth = await authenticateRequest(request, ['ADMIN', 'TEACHER']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const classId = searchParams.get('classId') || undefined;
    const type = searchParams.get('type') || undefined;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (classId) {
      where.classId = classId;
    }
    if (type) {
      where.type = type;
    }

    // Get exams with pagination
    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          class: {
            select: {
              id: true,
              name: true,
              section: true,
              academicYear: true,
            },
          },
          _count: {
            select: {
              results: true,
            },
          },
        },
      }),
      prisma.exam.count({ where }),
    ]);

    // Return paginated exams
    return NextResponse.json({
      success: true,
      message: 'Exams retrieved successfully',
      data: {
        exams,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new exam
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin and teachers can create exams
    const auth = await authenticateRequest(request, ['ADMIN', 'TEACHER']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const { name, type, startDate, endDate, classId } = await request.json();

    // Validate required fields
    if (!name || !type || !startDate || !endDate || !classId) {
      return NextResponse.json(
        { success: false, message: 'Name, type, start date, end date, and class ID are required' },
        { status: 400 }
      );
    }

    // Check if class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      return NextResponse.json(
        { success: false, message: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if exam with same name already exists for the class
    const existingExam = await prisma.exam.findFirst({
      where: {
        name,
        classId,
      },
    });

    if (existingExam) {
      return NextResponse.json(
        { success: false, message: 'Exam with this name already exists for the selected class' },
        { status: 409 }
      );
    }

    // Create exam
    const exam = await prisma.exam.create({
      data: {
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        classId,
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
            academicYear: true,
          },
        },
      },
    });

    // Return created exam
    return NextResponse.json({
      success: true,
      message: 'Exam created successfully',
      data: exam,
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 