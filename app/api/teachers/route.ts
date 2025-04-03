import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: List all teachers with pagination
export async function GET(request: NextRequest) {
  try {
    // Authenticate request - only admin can view all teachers
    const auth = await authenticateRequest(request, ['ADMIN']);
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
    const specialization = searchParams.get('specialization') || undefined;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (specialization) {
      where.specialization = specialization;
    }

    // Get teachers with pagination
    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              classAssignments: true,
            },
          },
        },
      }),
      prisma.teacher.count({ where }),
    ]);

    // Return paginated teachers
    return NextResponse.json({
      success: true,
      message: 'Teachers retrieved successfully',
      data: {
        teachers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new teacher
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin can create teachers
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const {
      name,
      email,
      password,
      employeeId,
      qualification,
      specialization,
      joiningDate,
      phone,
      address
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !employeeId ||
      !qualification ||
      !joiningDate
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 409 }
      );
    }

    // Check if employee ID already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { employeeId },
    });

    if (existingTeacher) {
      return NextResponse.json(
        { success: false, message: 'Employee ID already in use' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and teacher in a transaction
    const teacher = await prisma.$transaction(async (tx) => {
      // Create user with TEACHER role
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'TEACHER',
          profile: {
            create: {
              phone: phone || null,
              address: address || null,
            },
          },
        },
      });

      // Create teacher record
      return tx.teacher.create({
        data: {
          userId: user.id,
          employeeId,
          qualification,
          specialization: specialization || null,
          joiningDate: new Date(joiningDate),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    // Return created teacher
    return NextResponse.json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher,
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}