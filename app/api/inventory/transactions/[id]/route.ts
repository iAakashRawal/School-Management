import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// GET endpoint to fetch a single transaction by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }

    const id = params.id;

    // Fetch the transaction with related item data
    const transaction = await prisma.inventoryTransaction.findUnique({
      where: { id },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            category: true,
            description: true,
            quantity: true,
            unit: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { status: 'error', error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }

    // Only admins can delete transactions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to delete transactions' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if transaction exists
    const transaction = await prisma.inventoryTransaction.findUnique({
      where: { id },
      include: {
        item: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { status: 'error', error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Delete transaction and update item quantity in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the transaction
      await tx.inventoryTransaction.delete({
        where: { id },
      });
      
      // Reverse the quantity change
      await tx.inventoryItem.update({
        where: { id: transaction.itemId },
        data: {
          quantity: {
            increment: transaction.type === 'IN' ? -transaction.quantity : transaction.quantity,
          },
        },
      });
    });

    return NextResponse.json({
      status: 'success',
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 