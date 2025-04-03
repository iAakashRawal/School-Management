import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: Retrieve a single class by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin and teachers can view classes
    const auth = await authenticateRequest(request, ['ADMIN', 'TEACHER']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Find class by ID
    const classItem = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            assignments: true,
          },
        },
      },
    });

    if (!classItem) {
      return NextResponse.json(
        { success: false, message: 'Class not found' },
        { status: 404 }
      );
    }

    // Return class
    return NextResponse.json({
      success: true,
      message: 'Class retrieved successfully',
      data: classItem,
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update a class
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can update classes
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;
    const { name, section, academicYear } = await request.json();

    // Check if class exists
    const classExists = await prisma.class.findUnique({
      where: { id },
    });

    if (!classExists) {
      return NextResponse.json(
        { success: false, message: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if another class with same name, section, and academic year already exists
    const duplicateClass = await prisma.class.findFirst({
      where: {
        name,
        section,
        academicYear,
        id: { not: id },
      },
    });

    if (duplicateClass) {
      return NextResponse.json(
        { success: false, message: 'Another class with this name, section, and academic year already exists' },
        { status: 409 }
      );
    }

    // Update class
    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name: name || undefined,
        section: section || undefined,
        academicYear: academicYear || undefined,
      },
      include: {
        _count: {
          select: {
            students: true,
            assignments: true,
          },
        },
      },
    });

    // Return updated class
    return NextResponse.json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass,
    });
  } catch (error) {
    console.error('Error updating class:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a class
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can delete classes
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Check if class exists
    const classItem = await prisma.class.findUnique({
      where: { id },
      include: {
        _count: {
          select: { students: true }
        }
      }
    });

    if (!classItem) {
      return NextResponse.json(
        { success: false, message: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if class has students
    if (classItem._count.students > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete class with students. Transfer or remove students first.' },
        { status: 400 }
      );
    }

    // Delete class
    await prisma.class.delete({
      where: { id },
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting class:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 