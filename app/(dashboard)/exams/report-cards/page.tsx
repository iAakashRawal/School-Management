'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface SubjectResult {
  subject: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  remarks: string;
}

interface ReportCard {
  studentId: string;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  academicYear: string;
  term: string;
  subjects: SubjectResult[];
  totalMarks: number;
  maxTotalMarks: number;
  overallPercentage: number;
  overallGrade: string;
  attendance: number;
  remarks: string;
}

export default function ReportCards() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedTerm('');
    setReportCard(null);
  };

  const handleTermChange = (value: string) => {
    setSelectedTerm(value);
    // TODO: Fetch report card for selected student
    setReportCard({
      studentId: studentId || '1',
      studentName: 'John Doe',
      rollNumber: '1',
      class: 'Class 1',
      section: 'A',
      academicYear: '2024-2025',
      term: value,
      subjects: [
        {
          subject: 'Mathematics',
          marks: 85,
          maxMarks: 100,
          percentage: 85,
          grade: 'A',
          remarks: 'Excellent',
        },
        {
          subject: 'Science',
          marks: 92,
          maxMarks: 100,
          percentage: 92,
          grade: 'A+',
          remarks: 'Outstanding',
        },
        {
          subject: 'English',
          marks: 78,
          maxMarks: 100,
          percentage: 78,
          grade: 'B+',
          remarks: 'Good',
        },
      ],
      totalMarks: 255,
      maxTotalMarks: 300,
      overallPercentage: 85,
      overallGrade: 'A',
      attendance: 95,
      remarks: 'Overall performance is excellent. Keep up the good work!',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Report Card</h1>
        <Button variant="outline" onClick={() => router.push('/exams/results')}>
          Back to Results
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="classId">Class</Label>
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Class 1 - Section A</SelectItem>
                  <SelectItem value="2">Class 2 - Section B</SelectItem>
                  <SelectItem value="3">Class 3 - Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select value={selectedTerm} onValueChange={handleTermChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIRST">First Term</SelectItem>
                  <SelectItem value="SECOND">Second Term</SelectItem>
                  <SelectItem value="FINAL">Final Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {reportCard && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Student Name</Label>
                  <p className="font-medium">{reportCard.studentName}</p>
                </div>
                <div>
                  <Label>Roll Number</Label>
                  <p className="font-medium">{reportCard.rollNumber}</p>
                </div>
                <div>
                  <Label>Class</Label>
                  <p className="font-medium">{reportCard.class} - {reportCard.section}</p>
                </div>
                <div>
                  <Label>Academic Year</Label>
                  <p className="font-medium">{reportCard.academicYear}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Subject-wise Performance</h3>
                <div className="grid grid-cols-6 gap-4 font-medium">
                  <div>Subject</div>
                  <div>Marks</div>
                  <div>Max Marks</div>
                  <div>Percentage</div>
                  <div>Grade</div>
                  <div>Remarks</div>
                </div>
                {reportCard.subjects.map((subject) => (
                  <div key={subject.subject} className="grid grid-cols-6 gap-4 items-center">
                    <div>{subject.subject}</div>
                    <div>{subject.marks}</div>
                    <div>{subject.maxMarks}</div>
                    <div className={subject.percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
                      {subject.percentage}%
                    </div>
                    <div>{subject.grade}</div>
                    <div>{subject.remarks}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Total Marks</Label>
                  <p className="font-medium">{reportCard.totalMarks} / {reportCard.maxTotalMarks}</p>
                </div>
                <div>
                  <Label>Overall Percentage</Label>
                  <p className={`font-medium ${reportCard.overallPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                    {reportCard.overallPercentage}%
                  </p>
                </div>
                <div>
                  <Label>Overall Grade</Label>
                  <p className="font-medium">{reportCard.overallGrade}</p>
                </div>
                <div>
                  <Label>Attendance</Label>
                  <p className="font-medium">{reportCard.attendance}%</p>
                </div>
              </div>

              <div>
                <Label>Remarks</Label>
                <p className="mt-1">{reportCard.remarks}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/exams/results')}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => window.print()}
            >
              Print Report Card
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 