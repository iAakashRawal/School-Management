import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: Retrieve a single student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin and teachers can view students
    const auth = await authenticateRequest(request, ['ADMIN', 'TEACHER']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Find student by ID
    const student = await prisma.student.findUnique({
      where: { id },
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
            academicYear: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    // Return student
    return NextResponse.json({
      success: true,
      message: 'Student retrieved successfully',
      data: student,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update a student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can update students
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;
    const {
      name,
      email,
      password,
      classId,
      rollNo,
      dateOfBirth,
      gender,
      parentName,
      parentPhone,
      parentEmail,
      address,
    } = await request.json();

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if email is changed and already exists
    if (email !== student.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== student.user.id) {
        return NextResponse.json(
          { success: false, message: 'Email already in use' },
          { status: 409 }
        );
      }
    }

    // Check if class exists
    if (classId) {
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

    // Update user and student in a transaction
    const updatedStudent = await prisma.$transaction(async (tx) => {
      // Update user
      const userUpdateData: any = {
        name: name ?? undefined,
        email: email ?? undefined,
      };

      // Only update password if provided
      if (password) {
        userUpdateData.password = await bcrypt.hash(password, 10);
      }

      await tx.user.update({
        where: { id: student.userId },
        data: userUpdateData,
      });

      // Update profile
      await tx.profile.update({
        where: { userId: student.userId },
        data: {
          phone: parentPhone ?? undefined,
          address: address ?? undefined,
        },
      });

      // Update student
      return tx.student.update({
        where: { id },
        data: {
          classId: classId ?? undefined,
          rollNo: rollNo ?? undefined,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender: gender ?? undefined,
          parentName: parentName ?? undefined,
          parentPhone: parentPhone ?? undefined,
          parentEmail: parentEmail ?? undefined,
          address: address ?? undefined,
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
              academicYear: true,
            },
          },
        },
      });
    });

    // Return updated student
    return NextResponse.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can delete students
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student not found' },
        { status: 404 }
      );
    }

    // Delete student and user in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete student
      await tx.student.delete({
        where: { id },
      });

      // Delete profile
      await tx.profile.delete({
        where: { userId: student.userId },
      });

      // Delete user
      await tx.user.delete({
        where: { id: student.userId },
      });
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 