'use client';

import { useState } from 'react';
import { Select } from '@/components/ui/form/select';

interface SubjectMarks {
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  marks: number;
  remarks: string;
  grade: string;
  percentage: number;
}

interface MarksheetData {
  id: string;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  examination: string;
  date: string;
  subjects: SubjectMarks[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  remarks: string;
}

export default function MarksheetPage({ params }: { params: { id: string } }) {
  const [selectedMarksheet, setSelectedMarksheet] = useState('');

  // Mock data for marksheet options
  const marksheetOptions = [
    { value: '1', label: 'Mid-Term Examination' },
    { value: '2', label: 'Final Examination' },
    { value: '3', label: 'Unit Test 1' },
  ];

  // Mock data for marksheet
  const marksheet: MarksheetData = {
    id: '1',
    studentName: 'John Doe',
    rollNumber: '1',
    class: '10',
    section: 'A',
    examination: 'Final Examination',
    date: '2024-03-28',
    subjects: [
      {
        subjectId: '1',
        subjectName: 'Mathematics',
        maxMarks: 100,
        marks: 85,
        remarks: 'Good performance',
        grade: 'A',
        percentage: 85,
      },
      {
        subjectId: '2',
        subjectName: 'Science',
        maxMarks: 100,
        marks: 90,
        remarks: 'Excellent work',
        grade: 'A+',
        percentage: 90,
      },
      {
        subjectId: '3',
        subjectName: 'English',
        maxMarks: 100,
        marks: 75,
        remarks: 'Needs improvement',
        grade: 'B',
        percentage: 75,
      },
      {
        subjectId: '4',
        subjectName: 'History',
        maxMarks: 100,
        marks: 88,
        remarks: 'Very good',
        grade: 'A',
        percentage: 88,
      },
    ],
    totalMarks: 400,
    obtainedMarks: 338,
    percentage: 84.5,
    grade: 'A',
    remarks: 'Overall performance is good. Keep up the good work!',
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Marksheet</h2>
            <Select
              label="Select Marksheet"
              value={selectedMarksheet}
              onChange={setSelectedMarksheet}
              options={marksheetOptions}
              required
            />
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {marksheet.studentName}</p>
                <p><span className="font-medium">Roll Number:</span> {marksheet.rollNumber}</p>
                <p><span className="font-medium">Class:</span> {marksheet.class}</p>
                <p><span className="font-medium">Section:</span> {marksheet.section}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Examination Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Examination:</span> {marksheet.examination}</p>
                <p><span className="font-medium">Date:</span> {marksheet.date}</p>
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Obtained
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marksheet.subjects.map((subject) => (
                  <tr key={subject.subjectId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.subjectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.maxMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Total Marks:</span> {marksheet.totalMarks}</p>
                  <p><span className="font-medium">Marks Obtained:</span> {marksheet.obtainedMarks}</p>
                  <p><span className="font-medium">Percentage:</span> {marksheet.percentage}%</p>
                  <p><span className="font-medium">Grade:</span> {marksheet.grade}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Teacher's Remarks</h3>
                <p className="text-gray-600">{marksheet.remarks}</p>
              </div>
            </div>
          </div>

          {/* Print Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Print Marksheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 