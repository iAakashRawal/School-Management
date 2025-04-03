import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

const prisma = new PrismaClient();

// GET endpoint to fetch inventory summary
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

    // Get total items count
    const totalItems = await prisma.inventoryItem.count();

    // Get low stock items count (items with quantity less than 10)
    const lowStockItems = await prisma.inventoryItem.count({
      where: {
        quantity: {
          lt: 10,
        },
      },
    });

    // Get total transactions count by type
    const [inTransactions, outTransactions] = await Promise.all([
      prisma.inventoryTransaction.count({
        where: { type: 'IN' },
      }),
      prisma.inventoryTransaction.count({
        where: { type: 'OUT' },
      }),
    ]);

    // Get recent transactions
    const recentTransactions = await prisma.inventoryTransaction.findMany({
      take: 5,
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
    });

    // Return summary data
    return NextResponse.json({
      status: 'success',
      data: {
        totalItems,
        lowStockItems,
        totalTransactions: {
          in: inTransactions,
          out: outTransactions,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch inventory summary' },
      { status: 500 }
    );
  }
} 