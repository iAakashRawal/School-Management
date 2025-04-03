import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

// GET: List all hostel rooms with pagination
export async function GET(request: NextRequest) {
  try {
    // Authenticate request - only admin can view all hostel rooms
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
    const type = searchParams.get('type') || undefined;
    const availableOnly = searchParams.get('availableOnly') === 'true';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.number = { contains: search, mode: 'insensitive' };
    }
    if (type) {
      where.type = type;
    }
    if (availableOnly) {
      where.capacity = { gt: where.occupied };
    }

    // Get hostel rooms with pagination
    const [rooms, total] = await Promise.all([
      prisma.hostelRoom.findMany({
        where,
        skip,
        take: limit,
        orderBy: { number: 'asc' },
        include: {
          _count: {
            select: {
              assignments: true,
            },
          },
        },
      }),
      prisma.hostelRoom.count({ where }),
    ]);

    // Return paginated hostel rooms
    return NextResponse.json({
      success: true,
      message: 'Hostel rooms retrieved successfully',
      data: {
        rooms,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching hostel rooms:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create a new hostel room
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin can create hostel rooms
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    // Get request body
    const { number, type, capacity } = await request.json();

    // Validate required fields
    if (!number || !type || !capacity) {
      return NextResponse.json(
        { success: false, message: 'Room number, type, and capacity are required' },
        { status: 400 }
      );
    }

    // Check if room with same number already exists
    const existingRoom = await prisma.hostelRoom.findFirst({
      where: { number },
    });

    if (existingRoom) {
      return NextResponse.json(
        { success: false, message: 'Hostel room with this number already exists' },
        { status: 409 }
      );
    }

    // Validate capacity based on room type
    let maxCapacity = 1;
    switch (type) {
      case 'SINGLE':
        maxCapacity = 1;
        break;
      case 'DOUBLE':
        maxCapacity = 2;
        break;
      case 'TRIPLE':
        maxCapacity = 3;
        break;
      case 'QUAD':
        maxCapacity = 4;
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid room type' },
          { status: 400 }
        );
    }

    if (parseInt(capacity.toString()) > maxCapacity) {
      return NextResponse.json(
        { success: false, message: `Capacity cannot exceed ${maxCapacity} for ${type} room` },
        { status: 400 }
      );
    }

    // Create hostel room
    const room = await prisma.hostelRoom.create({
      data: {
        number,
        type,
        capacity: parseInt(capacity.toString()),
        occupied: 0,
      },
    });

    // Return created hostel room
    return NextResponse.json({
      success: true,
      message: 'Hostel room created successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error creating hostel room:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 