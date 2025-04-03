import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: Retrieve a single fee record by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can view fee details
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Find fee by ID
    const fee = await prisma.fee.findUnique({
      where: { id },
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
    });

    if (!fee) {
      return NextResponse.json(
        { success: false, message: 'Fee record not found' },
        { status: 404 }
      );
    }

    // Return fee record
    return NextResponse.json({
      success: true,
      message: 'Fee record retrieved successfully',
      data: fee,
    });
  } catch (error) {
    console.error('Error fetching fee record:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update a fee record
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can update fee records
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;
    const { amount, type, status, dueDate, remarks } = await request.json();

    // Check if fee exists
    const feeExists = await prisma.fee.findUnique({
      where: { id },
    });

    if (!feeExists) {
      return NextResponse.json(
        { success: false, message: 'Fee record not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (amount !== undefined) {
      updateData.amount = parseFloat(amount.toString());
    }
    
    if (type !== undefined) {
      updateData.type = type;
    }
    
    if (status !== undefined) {
      updateData.status = status;
      
      // If status is changed to PAID, update paid date
      if (status === 'PAID' && feeExists.status !== 'PAID') {
        updateData.paidDate = new Date();
      }
      
      // If status is changed from PAID, clear paid date
      if (status !== 'PAID' && feeExists.status === 'PAID') {
        updateData.paidDate = null;
      }
    }
    
    if (dueDate !== undefined) {
      updateData.dueDate = new Date(dueDate);
    }
    
    if (remarks !== undefined) {
      updateData.remarks = remarks;
    }

    // Update fee record
    const updatedFee = await prisma.fee.update({
      where: { id },
      data: updateData,
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

    // Return updated fee record
    return NextResponse.json({
      success: true,
      message: 'Fee record updated successfully',
      data: updatedFee,
    });
  } catch (error) {
    console.error('Error updating fee record:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a fee record
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - only admin can delete fee records
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { id } = params;

    // Check if fee exists
    const feeExists = await prisma.fee.findUnique({
      where: { id },
    });

    if (!feeExists) {
      return NextResponse.json(
        { success: false, message: 'Fee record not found' },
        { status: 404 }
      );
    }

    // If fee is already paid, don't allow deletion
    if (feeExists.status === 'PAID') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete a paid fee record' },
        { status: 400 }
      );
    }

    // Delete fee record
    await prisma.fee.delete({
      where: { id },
    });

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Fee record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting fee record:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 