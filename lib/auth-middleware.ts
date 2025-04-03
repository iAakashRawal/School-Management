import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export type JwtPayload = {
  id: string;
  email: string;
  role: string;
};

export async function authenticateRequest(
  req: NextRequest,
  requiredRoles?: string[]
) {
  try {
    // Get token from header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        status: 401,
        message: 'Authentication required',
      };
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return {
        success: false,
        status: 401,
        message: 'User not found',
      };
    }

    // Check role if required
    if (requiredRoles && !requiredRoles.includes(decoded.role)) {
      return {
        success: false,
        status: 403,
        message: 'Insufficient permissions',
      };
    }

    // Authentication successful
    return {
      success: true,
      user: decoded,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      status: 401,
      message: 'Invalid or expired token',
    };
  }
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  );
}

export function forbiddenResponse(message: string = 'Forbidden') {
  return NextResponse.json(
    { success: false, message },
    { status: 403 }
  );
} 