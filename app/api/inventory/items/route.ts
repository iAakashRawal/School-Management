import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// Schema for inventory item creation validation
const createInventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  quantity: z.number().int().min(0, 'Quantity must be a non-negative integer'),
  unit: z.string().min(1, 'Unit is required'),
});

// GET endpoint to fetch all inventory items with pagination, filtering, and search
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
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build filter conditions
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category && category !== 'All Categories') {
      where.category = category;
    }
    
    // Execute query with pagination
    const [items, totalCount] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        take: limit,
        skip,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { transactions: true }
          }
        }
      }),
      prisma.inventoryItem.count({ where }),
    ]);
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      status: 'success',
      data: {
        items,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new inventory item
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
    
    // Only admins can create inventory items
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to create inventory items' },
        { status: 403 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = createInventoryItemSchema.safeParse(body);
    
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
    
    const { name, category, description, quantity, unit } = validationResult.data;
    
    // Check if item with same name already exists
    const existingItem = await prisma.inventoryItem.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    
    if (existingItem) {
      return NextResponse.json(
        { status: 'error', error: 'An item with this name already exists' },
        { status: 400 }
      );
    }
    
    // Create the inventory item
    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        description,
        quantity,
        unit,
      },
    });
    
    return NextResponse.json({
      status: 'success',
      data: newItem,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
} 