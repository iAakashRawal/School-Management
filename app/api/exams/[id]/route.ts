import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: Retrieve a single exam by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin and teachers can view exams
    const auth = await authenticateRequest(request, ['ADMIN', 'TEACHER']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Find exam by ID
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            section: true,
            academicYear: true,
          },
        },
        results: {
          include: {
            student: {
              select: {
                id: true,
                rollNo: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    // Return exam
    return NextResponse.json({
      success: true,
      message: 'Exam retrieved successfully',
      data: exam,
    });
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update an exam
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin and teachers can update exams
    const auth = await authenticateRequest(request, ['ADMIN', 'TEACHER']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;
    const { name, type, startDate, endDate, classId } = await request.json();

    // Check if exam exists
    const examExists = await prisma.exam.findUnique({
      where: { id },
    });

    if (!examExists) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    // If class is being changed, check if new class exists
    if (classId && classId !== examExists.classId) {
      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      });

      if (!classExists) {
        return NextResponse.json(
          { success: false, message: 'Class not found' },
          { status: 404 }
        );
      }
    }

    // Check if exam with same name already exists for the class (excluding this exam)
    if (name && classId) {
      const existingExam = await prisma.exam.findFirst({
        where: {
          name,
          classId,
          id: { not: id },
        },
      });

      if (existingExam) {
        return NextResponse.json(
          { success: false, message: 'Exam with this name already exists for the selected class' },
          { status: 409 }
        );
      }
    }

    // Update exam
    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        name: name || undefined,
        type: type || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        classId: classId || undefined,
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

    // Return updated exam
    return NextResponse.json({
      success: true,
      message: 'Exam updated successfully',
      data: updatedExam,
    });
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can delete exams
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Check if exam exists
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        _count: {
          select: { results: true },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    // Check if exam has results (don't allow deletion if it does)
    if (exam._count.results > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete exam with results. Remove results first.' },
        { status: 400 }
      );
    }

    // Delete exam
    await prisma.exam.delete({
      where: { id },
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Exam deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 