import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: List all fees with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Authenticate request - only admin can view all fees
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
    const studentId = searchParams.get('studentId') || undefined;
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;
    const classId = searchParams.get('classId') || undefined;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (studentId) {
      where.studentId = studentId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (classId) {
      where.student = {
        classId,
      };
    }

    // Get fees with pagination
    const [fees, total] = await Promise.all([
      prisma.fee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueDate: 'desc' },
        include: {
          student: {
            select: {
              id: true,
              admissionNo: true,
              rollNo: true,
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
          },
        },
      }),
      prisma.fee.count({ where }),
    ]);

    // Return paginated fees
    return NextResponse.json({
      success: true,
      message: 'Fees retrieved successfully',
      data: {
        fees,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching fees:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new fee
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin can create fees
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const { studentId, amount, type, dueDate, status = 'PENDING' } = await request.json();

    // Validate required fields
    if (!studentId || !amount || !type || !dueDate) {
      return NextResponse.json(
        { success: false, message: 'Student ID, amount, type, and due date are required' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    // Create fee
    const fee = await prisma.fee.create({
      data: {
        studentId,
        amount: parseFloat(amount.toString()),
        type,
        status,
        dueDate: new Date(dueDate),
        paidDate: status === 'PAID' ? new Date() : null,
      },
      include: {
        student: {
          select: {
            id: true,
            admissionNo: true,
            rollNo: true,
            user: {
              select: {
                id: true,
                name: true,
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
        },
      },
    });

    // Return created fee
    return NextResponse.json({
      success: true,
      message: 'Fee created successfully',
      data: fee,
    });
  } catch (error) {
    console.error('Error creating fee:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Create fees in bulk for a class
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate request - only admin can create bulk fees
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const { classId, amount, type, dueDate, description } = await request.json();

    // Validate required fields
    if (!classId || !amount || !type || !dueDate) {
      return NextResponse.json(
        { success: false, message: 'Class ID, amount, type, and due date are required' },
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

    // Get all students in the class
    const students = await prisma.student.findMany({
      where: { classId },
      select: { id: true },
    });

    if (students.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No students found in the selected class' },
        { status: 400 }
      );
    }

    // Create fees for all students in the class
    const createdFees = await prisma.$transaction(async (tx) => {
      const fees = [];

      for (const student of students) {
        const fee = await tx.fee.create({
          data: {
            studentId: student.id,
            amount: parseFloat(amount.toString()),
            type,
            status: 'PENDING',
            dueDate: new Date(dueDate),
            remarks: description,
          },
        });
        fees.push(fee);
      }

      return fees;
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: `${createdFees.length} fees created successfully`,
      data: {
        count: createdFees.length,
      },
    });
  } catch (error) {
    console.error('Error creating bulk fees:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 