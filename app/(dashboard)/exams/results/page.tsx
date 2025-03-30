'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface ExamResult {
  studentId: string;
  studentName: string;
  rollNumber: string;
  marks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  remarks: string;
}

export default function ExamResults() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [results, setResults] = useState<ExamResult[]>([]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedExam('');
    setSelectedSubject('');
    setResults([]);
  };

  const handleExamChange = (value: string) => {
    setSelectedExam(value);
    setSelectedSubject('');
    setResults([]);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    // TODO: Fetch results for selected exam and subject
    setResults([
      {
        studentId: '1',
        studentName: 'John Doe',
        rollNumber: '1',
        marks: 85,
        maxMarks: 100,
        percentage: 85,
        grade: 'A',
        remarks: 'Excellent',
      },
      {
        studentId: '2',
        studentName: 'Jane Smith',
        rollNumber: '2',
        marks: 92,
        maxMarks: 100,
        percentage: 92,
        grade: 'A+',
        remarks: 'Outstanding',
      },
      {
        studentId: '3',
        studentName: 'Mike Johnson',
        rollNumber: '3',
        marks: 78,
        maxMarks: 100,
        percentage: 78,
        grade: 'B+',
        remarks: 'Good',
      },
    ]);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Exam Results</h1>
        <Button variant="outline" onClick={() => router.push('/exams')}>
          Back to Exams
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Label htmlFor="examId">Exam</Label>
              <Select value={selectedExam} onValueChange={handleExamChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Mid-Term Exam</SelectItem>
                  <SelectItem value="2">Final Exam</SelectItem>
                  <SelectItem value="3">Unit Test 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MATH">Mathematics</SelectItem>
                  <SelectItem value="SCIENCE">Science</SelectItem>
                  <SelectItem value="ENGLISH">English</SelectItem>
                  <SelectItem value="HISTORY">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSubject && (
            <div className="space-y-4">
              <div className="grid grid-cols-8 gap-4 font-medium">
                <div>Roll No.</div>
                <div>Student Name</div>
                <div>Marks</div>
                <div>Max Marks</div>
                <div>Percentage</div>
                <div>Grade</div>
                <div>Remarks</div>
                <div>Actions</div>
              </div>
              {results.map((result) => (
                <div key={result.studentId} className="grid grid-cols-8 gap-4 items-center">
                  <div>{result.rollNumber}</div>
                  <div>{result.studentName}</div>
                  <div>{result.marks}</div>
                  <div>{result.maxMarks}</div>
                  <div className={result.percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
                    {result.percentage}%
                  </div>
                  <div>{result.grade}</div>
                  <div>{result.remarks}</div>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/exams/report-cards?studentId=${result.studentId}`)}
                    >
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/exams')}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/exams/schedule')}
            >
              Schedule New Exam
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 