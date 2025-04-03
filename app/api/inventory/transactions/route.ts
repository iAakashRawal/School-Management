import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// Schema for transaction creation validation
const createTransactionSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  type: z.enum(['IN', 'OUT']),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  date: z.string().transform(val => new Date(val)),
  remarks: z.string().optional(),
  referenceNo: z.string().optional(),
});

// GET endpoint to fetch all transactions with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const itemId = searchParams.get('itemId');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where: any = {};
    
    if (itemId) {
      where.itemId = itemId;
    }
    
    if (type && (type === 'IN' || type === 'OUT')) {
      where.type = type;
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }
    
    // Execute query with pagination
    const [transactions, totalCount] = await Promise.all([
      prisma.inventoryTransaction.findMany({
        where,
        take: limit,
        skip,
        orderBy: { date: 'desc' },
        include: {
          item: {
            select: {
              id: true,
              name: true,
              category: true,
              unit: true,
            },
          },
        },
      }),
      prisma.inventoryTransaction.count({ where }),
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      status: 'success',
      data: {
        transactions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new transaction
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'You must be logged in to access this resource' },
        { status: 401 }
      );
    }
    
    // Only admins can create transactions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to create transactions' },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createTransactionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Validation failed', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    const { itemId, type, quantity, date, remarks, referenceNo } = validationResult.data;
    
    // Check if item exists
    const item = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });
    
    if (!item) {
      return NextResponse.json(
        { status: 'error', error: 'Inventory item not found' },
        { status: 404 }
      );
    }
    
    // For OUT transactions, check if enough quantity is available
    if (type === 'OUT' && item.quantity < quantity) {
      return NextResponse.json(
        { 
          status: 'error', 
          error: 'Insufficient quantity available',
          available: item.quantity,
          requested: quantity,
        },
        { status: 400 }
      );
    }
    
    // Create transaction and update item quantity in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.inventoryTransaction.create({
        data: {
          itemId,
          type,
          quantity,
          date,
          remarks,
          referenceNo,
        },
      });
      
      // Update item quantity
      const updatedItem = await tx.inventoryItem.update({
        where: { id: itemId },
        data: {
          quantity: {
            increment: type === 'IN' ? quantity : -quantity,
          },
        },
      });
      
      return { transaction, updatedItem };
    });
    
    return NextResponse.json({
      status: 'success',
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 