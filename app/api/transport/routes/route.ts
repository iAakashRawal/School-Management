import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: List all transport routes with pagination
export async function GET(request: NextRequest) {
  try {
    // Authenticate request - only admin can view all transport routes
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { startPoint: { contains: search, mode: 'insensitive' } },
        { endPoint: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get transport routes with pagination
    const [routes, total] = await Promise.all([
      prisma.transportRoute.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              assignments: true,
            },
          },
        },
      }),
      prisma.transportRoute.count({ where }),
    ]);

    // Return paginated transport routes
    return NextResponse.json({
      success: true,
      message: 'Transport routes retrieved successfully',
      data: {
        routes,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching transport routes:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new transport route
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin can create transport routes
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const { name, startPoint, endPoint, stops } = await request.json();

    // Validate required fields
    if (!name || !startPoint || !endPoint) {
      return NextResponse.json(
        { success: false, message: 'Name, start point, and end point are required' },
        { status: 400 }
      );
    }

    // Check if route with same name already exists
    const existingRoute = await prisma.transportRoute.findFirst({
      where: { name },
    });

    if (existingRoute) {
      return NextResponse.json(
        { success: false, message: 'Transport route with this name already exists' },
        { status: 409 }
      );
    }

    // Create transport route
    const route = await prisma.transportRoute.create({
      data: {
        name,
        startPoint,
        endPoint,
        stops: stops || [],
      },
    });

    // Return created transport route
    return NextResponse.json({
      success: true,
      message: 'Transport route created successfully',
      data: route,
    });
  } catch (error) {
    console.error('Error creating transport route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 