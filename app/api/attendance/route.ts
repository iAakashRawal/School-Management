import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: List attendance records with filters and pagination
export async function GET(request: NextRequest) {
  try {
    // Authenticate request - only admin and teachers can view attendance
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
    const date = searchParams.get('date');
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');
    const status = searchParams.get('status');

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }
    
    if (studentId) {
      where.studentId = studentId;
    }
    
    if (classId) {
      where.student = {
        classId,
      };
    }
    
    if (status) {
      where.status = status;
    }

    // Get attendance records with pagination
    const [attendanceRecords, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
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
      prisma.attendance.count({ where }),
    ]);

    // Return paginated attendance records
    return NextResponse.json({
      success: true,
      message: 'Attendance records retrieved successfully',
      data: {
        attendanceRecords,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new attendance record
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin and teachers can create attendance records
    const auth = await authenticateRequest(request, ['ADMIN', 'TEACHER']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const { studentId, date, status } = await request.json();

    // Validate required fields
    if (!studentId || !date || !status) {
      return NextResponse.json(
        { success: false, message: 'Student ID, date, and status are required' },
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

    // Check if attendance record already exists for the student on the given date
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: {
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
        },
      },
    });

    if (existingRecord) {
      // Update existing record
      const updatedRecord = await prisma.attendance.update({
        where: { id: existingRecord.id },
        data: { status },
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

      return NextResponse.json({
        success: true,
        message: 'Attendance record updated successfully',
        data: updatedRecord,
      });
    }

    // Create new attendance record
    const attendanceRecord = await prisma.attendance.create({
      data: {
        studentId,
        date: new Date(date),
        status,
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

    // Return created attendance record
    return NextResponse.json({
      success: true,
      message: 'Attendance record created successfully',
      data: attendanceRecord,
    });
  } catch (error) {
    console.error('Error creating attendance record:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create multiple attendance records (bulk creation)
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate request - only admin and teachers can create attendance records
    const auth = await authenticateRequest(request, ['ADMIN', 'TEACHER']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const { date, records } = await request.json();

    // Validate required fields
    if (!date || !records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Date and attendance records are required' },
        { status: 400 }
      );
    }

    // Prepare the date for database comparison
    const attendanceDate = new Date(date);
    const startOfDay = new Date(attendanceDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(attendanceDate.setHours(23, 59, 59, 999));

    // Process records in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatedRecords = [];

      for (const record of records) {
        const { studentId, status } = record;

        if (!studentId || !status) {
          continue; // Skip invalid records
        }

        // Check if student exists
        const student = await tx.student.findUnique({
          where: { id: studentId },
        });

        if (!student) {
          continue; // Skip if student doesn't exist
        }

        // Check if attendance record already exists for the student on the given date
        const existingRecord = await tx.attendance.findFirst({
          where: {
            studentId,
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

        if (existingRecord) {
          // Update existing record
          const updated = await tx.attendance.update({
            where: { id: existingRecord.id },
            data: { status },
          });
          updatedRecords.push(updated);
        } else {
          // Create new attendance record
          const created = await tx.attendance.create({
            data: {
              studentId,
              date: new Date(date),
              status,
            },
          });
          updatedRecords.push(created);
        }
      }

      return updatedRecords;
    });

    // Return result
    return NextResponse.json({
      success: true,
      message: 'Attendance records processed successfully',
      data: {
        count: result.length,
      },
    });
  } catch (error) {
    console.error('Error processing attendance records:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 