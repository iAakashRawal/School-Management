import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// Schema for inventory item update validation
const updateInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  description: z.string().optional(),
  quantity: z.number().int().min(0, 'Quantity must be a non-negative integer').optional(),
  unit: z.string().min(1, 'Unit is required').optional(),
});

// GET endpoint to fetch a single inventory item by ID
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

    // Fetch the inventory item with transactions
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
          take: 10, // Include only the most recent transactions
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { status: 'error', error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: item,
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch inventory item' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update an inventory item
export async function PUT(
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

    // Only admins can update inventory items
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to update inventory items' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if inventory item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { status: 'error', error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateInventoryItemSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Validation failed',
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // If updating name, check for duplicates
    if (updateData.name && updateData.name !== existingItem.name) {
      const nameExists = await prisma.inventoryItem.findFirst({
        where: {
          name: { equals: updateData.name, mode: 'insensitive' },
          id: { not: id },
        },
      });

      if (nameExists) {
        return NextResponse.json(
          { status: 'error', error: 'An item with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Update the inventory item
    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      status: 'success',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete an inventory item
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

    // Only admins can delete inventory items
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to delete inventory items' },
        { status: 403 }
      );
    }

    const id = params.id;

    // Check if inventory item exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { transactions: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { status: 'error', error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Check if item has transactions
    if (existingItem.transactions.length > 0) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'Cannot delete item with transaction history',
          transactionCount: existingItem.transactions.length,
        },
        { status: 400 }
      );
    }

    // Delete the inventory item
    await prisma.inventoryItem.delete({
      where: { id },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
} 