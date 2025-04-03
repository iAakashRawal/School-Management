import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: List all classes with pagination
export async function GET(request: NextRequest) {
  try {
    // Authenticate request - only admin and teachers can view classes
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
    const academicYear = searchParams.get('academicYear') || undefined;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { section: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (academicYear) {
      where.academicYear = academicYear;
    }

    // Get classes with pagination
    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              students: true,
              assignments: true,
            },
          },
        },
      }),
      prisma.class.count({ where }),
    ]);

    // Return paginated classes
    return NextResponse.json({
      success: true,
      message: 'Classes retrieved successfully',
      data: {
        classes,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new class
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin can create classes
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const { name, section, academicYear } = await request.json();

    // Validate required fields
    if (!name || !section || !academicYear) {
      return NextResponse.json(
        { success: false, message: 'Name, section, and academic year are required' },
        { status: 400 }
      );
    }

    // Check if class with same name, section, and academic year already exists
    const existingClass = await prisma.class.findFirst({
      where: {
        name,
        section,
        academicYear,
      },
    });

    if (existingClass) {
      return NextResponse.json(
        { success: false, message: 'Class with this name, section, and academic year already exists' },
        { status: 409 }
      );
    }

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name,
        section,
        academicYear,
      },
    });

    // Return created class
    return NextResponse.json({
      success: true,
      message: 'Class created successfully',
      data: newClass,
    });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}