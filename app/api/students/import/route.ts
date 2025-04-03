import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateRequest, unauthorizedResponse, forbiddenResponse } from '@/lib/auth-middleware';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Define expected column mappings
export const EXPECTED_COLUMNS = {
  name: 'Student Name',
  email: 'Email',
  admissionNo: 'Admission No',
  rollNo: 'Roll No',
  dateOfBirth: 'Date of Birth',
  gender: 'Gender',
  parentName: 'Parent Name',
  parentPhone: 'Parent Phone',
  parentEmail: 'Parent Email',
  address: 'Address',
  className: 'Class',
  section: 'Section',
};

// POST: Import students from CSV/Excel
export async function POST(request: NextRequest) {
  try {
    // Authenticate request - only admin can import students
    const auth = await authenticateRequest(request, ['ADMIN']);
    if (!auth.success) {
      return auth.status === 403 
        ? forbiddenResponse(auth.message) 
        : unauthorizedResponse(auth.message);
    }

    const { mappings, students, academicYear } = await request.json();

    // Validate request data
    if (!mappings || !students || !academicYear || !Array.isArray(students)) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Process students in batches
    const batchSize = 50;
    const results = {
      success: 0,
      failed: 0,
      errors: [] as { row: number; error: string }[],
    };

    // Process in batches using transaction
    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize);
      
      await prisma.$transaction(async (tx) => {
        for (const [index, studentData] of batch.entries()) {
          const rowNumber = i + index + 1;
          try {
            // Map the data using provided column mappings
            const mappedData = {
              name: studentData[mappings.name],
              email: studentData[mappings.email],
              admissionNo: studentData[mappings.admissionNo],
              rollNo: studentData[mappings.rollNo],
              dateOfBirth: new Date(studentData[mappings.dateOfBirth]),
              gender: studentData[mappings.gender].toUpperCase(),
              parentName: studentData[mappings.parentName],
              parentPhone: studentData[mappings.parentPhone],
              parentEmail: studentData[mappings.parentEmail],
              address: studentData[mappings.address],
              className: studentData[mappings.className],
              section: studentData[mappings.section],
            };

            // Validate required fields
            if (!mappedData.name || !mappedData.email || !mappedData.admissionNo) {
              throw new Error('Missing required fields');
            }

            // Find or create class
            const classRecord = await tx.class.upsert({
              where: {
                name_section_academicYear: {
                  name: mappedData.className,
                  section: mappedData.section,
                  academicYear: academicYear,
                },
              },
              create: {
                name: mappedData.className,
                section: mappedData.section,
                academicYear: academicYear,
              },
              update: {},
            });

            // Check if student already exists
            const existingStudent = await tx.student.findFirst({
              where: {
                OR: [
                  { admissionNo: mappedData.admissionNo },
                  { user: { email: mappedData.email } },
                ],
              },
            });

            if (existingStudent) {
              throw new Error('Student with same admission number or email already exists');
            }

            // Create user and student
            const hashedPassword = await hash(mappedData.admissionNo, 10); // Use admission number as initial password
            const user = await tx.user.create({
              data: {
                name: mappedData.name,
                email: mappedData.email,
                password: hashedPassword,
                role: 'STUDENT',
                student: {
                  create: {
                    admissionNo: mappedData.admissionNo,
                    rollNo: mappedData.rollNo,
                    dateOfBirth: mappedData.dateOfBirth,
                    gender: mappedData.gender as 'MALE' | 'FEMALE' | 'OTHER',
                    parentName: mappedData.parentName,
                    parentPhone: mappedData.parentPhone,
                    parentEmail: mappedData.parentEmail,
                    address: mappedData.address,
                    classId: classRecord.id,
                  },
                },
              },
            });

            results.success++;
          } catch (error) {
            results.failed++;
            results.errors.push({
              row: rowNumber,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Import completed',
      data: results,
    });
  } catch (error) {
    console.error('Error importing students:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 