import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET: List all students with pagination
export async function GET(request: NextRequest) {
  try {
    // Authenticate request - only admin and teachers can view students
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
    const classId = searchParams.get('class') || undefined;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { admissionNo: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (classId) {
      where.classId = classId;
    }

    // Get students with pagination
    const [students, total] = await Promise.all([
      prisma.student.findMany({
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
          class: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);

    // Return paginated students
    return NextResponse.json({
      success: true,
      message: 'Students retrieved successfully',
      data: {
        students,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new student
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin can create students
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
      admissionNo,
      classId,
      rollNo,
      dateOfBirth,
      gender,
      parentName,
      parentPhone,
      parentEmail,
      address,
    } = await request.json();

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !admissionNo ||
      !classId ||
      !rollNo ||
      !dateOfBirth ||
      !gender ||
      !parentName ||
      !parentPhone ||
      !address
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

    // Check if admission number already exists
    const existingAdmission = await prisma.student.findUnique({
      where: { admissionNo },
    });

    if (existingAdmission) {
      return NextResponse.json(
        { success: false, message: 'Admission number already in use' },
        { status: 409 }
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and student in a transaction
    const student = await prisma.$transaction(async (tx) => {
      // Create user with STUDENT role
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'STUDENT',
          profile: {
            create: {
              phone: parentPhone,
              address,
            },
          },
        },
      });

      // Create student record
      return tx.student.create({
        data: {
          userId: user.id,
          admissionNo,
          classId,
          rollNo,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          parentName,
          parentPhone,
          parentEmail,
          address,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          class: {
            select: {
              id: true,
              name: true,
              section: true,
            },
          },
        },
      });
    });

    // Return created student
    return NextResponse.json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 