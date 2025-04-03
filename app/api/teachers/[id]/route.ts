import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: Retrieve a single teacher by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can view teacher details
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Find teacher by ID
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                phone: true,
                address: true,
                avatar: true,
              },
            },
          },
        },
        classAssignments: {
          include: {
            class: true,
          },
        },
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Return teacher
    return NextResponse.json({
      success: true,
      message: 'Teacher retrieved successfully',
      data: teacher,
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update a teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can update teachers
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
      qualification,
      specialization,
      joiningDate,
      phone,
      address,
    } = await request.json();

    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Check if email is changed and already exists
    if (email && email !== teacher.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== teacher.user.id) {
        return NextResponse.json(
          { success: false, message: 'Email already in use' },
          { status: 409 }
        );
      }
    }

    // Update user and teacher in a transaction
    const updatedTeacher = await prisma.$transaction(async (tx) => {
      // Update user
      const userUpdateData: any = {};
      if (name) userUpdateData.name = name;
      if (email) userUpdateData.email = email;
      if (password) userUpdateData.password = await bcrypt.hash(password, 10);

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: teacher.userId },
          data: userUpdateData,
        });
      }

      // Update profile
      const profileUpdateData: any = {};
      if (phone !== undefined) profileUpdateData.phone = phone;
      if (address !== undefined) profileUpdateData.address = address;

      if (Object.keys(profileUpdateData).length > 0) {
        await tx.profile.update({
          where: { userId: teacher.userId },
          data: profileUpdateData,
        });
      }

      // Update teacher
      const teacherUpdateData: any = {};
      if (qualification) teacherUpdateData.qualification = qualification;
      if (specialization !== undefined) teacherUpdateData.specialization = specialization;
      if (joiningDate) teacherUpdateData.joiningDate = new Date(joiningDate);

      return tx.teacher.update({
        where: { id },
        data: teacherUpdateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: {
                select: {
                  phone: true,
                  address: true,
                },
              },
            },
          },
        },
      });
    });

    // Return updated teacher
    return NextResponse.json({
      success: true,
      message: 'Teacher updated successfully',
      data: updatedTeacher,
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can delete teachers
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { 
        user: true,
        classAssignments: true
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { success: false, message: 'Teacher not found' },
        { status: 404 }
      );
    }

    // Check if teacher has class assignments
    if (teacher.classAssignments.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete teacher with class assignments. Remove assignments first.' },
        { status: 400 }
      );
    }

    // Delete teacher and user in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete teacher
      await tx.teacher.delete({
        where: { id },
      });

      // Delete profile
      await tx.profile.delete({
        where: { userId: teacher.userId },
      });

      // Delete user
      await tx.user.delete({
        where: { id: teacher.userId },
      });
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Teacher deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 