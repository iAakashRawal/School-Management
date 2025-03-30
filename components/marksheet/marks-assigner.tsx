'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/form/input';
import { Select } from '@/components/ui/form/select';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
}

interface SubjectMarks {
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  marks: number;
  remarks: string;
}

interface StudentMarks {
  studentId: string;
  marks: SubjectMarks[];
}

export function MarksAssigner() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedMarksheet, setSelectedMarksheet] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [studentMarks, setStudentMarks] = useState<StudentMarks[]>([]);

  const classOptions = [
    { value: '1', label: 'Class 1' },
    { value: '2', label: 'Class 2' },
    { value: '3', label: 'Class 3' },
    { value: '4', label: 'Class 4' },
    { value: '5', label: 'Class 5' },
    { value: '6', label: 'Class 6' },
    { value: '7', label: 'Class 7' },
    { value: '8', label: 'Class 8' },
    { value: '9', label: 'Class 9' },
    { value: '10', label: 'Class 10' },
  ];

  const sectionOptions = [
    { value: 'A', label: 'Section A' },
    { value: 'B', label: 'Section B' },
    { value: 'C', label: 'Section C' },
    { value: 'D', label: 'Section D' },
  ];

  // Mock data for marksheet templates
  const marksheetOptions = [
    { value: '1', label: 'Mid-Term Examination' },
    { value: '2', label: 'Final Examination' },
    { value: '3', label: 'Unit Test 1' },
  ];

  // Mock data for subjects
  const subjects = [
    { id: '1', name: 'Mathematics', maxMarks: 100 },
    { id: '2', name: 'Science', maxMarks: 100 },
    { id: '3', name: 'English', maxMarks: 100 },
    { id: '4', name: 'History', maxMarks: 100 },
  ];

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedSection('');
    setStudents([]);
    setStudentMarks([]);
  };

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
    // Mock data for students
    setStudents([
      { id: '1', name: 'John Doe', rollNumber: '1' },
      { id: '2', name: 'Jane Smith', rollNumber: '2' },
      { id: '3', name: 'Mike Johnson', rollNumber: '3' },
    ]);
    // Initialize marks for each student
    setStudentMarks(
      students.map((student) => ({
        studentId: student.id,
        marks: subjects.map((subject) => ({
          subjectId: subject.id,
          subjectName: subject.name,
          maxMarks: subject.maxMarks,
          marks: 0,
          remarks: '',
        })),
      }))
    );
  };

  const handleMarksChange = (
    studentId: string,
    subjectId: string,
    value: string,
    field: 'marks' | 'remarks'
  ) => {
    setStudentMarks((prev) =>
      prev.map((studentMark) => {
        if (studentMark.studentId === studentId) {
          return {
            ...studentMark,
            marks: studentMark.marks.map((mark) => {
              if (mark.subjectId === subjectId) {
                return {
                  ...mark,
                  [field]: field === 'marks' ? Number(value) : value,
                };
              }
              return mark;
            }),
          };
        }
        return studentMark;
      })
    );
  };

  const handleSave = () => {
    // Save marks to database
    console.log('Saving marks:', studentMarks);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Assign Marks</h2>
      
      <div className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Class"
            value={selectedClass}
            onChange={handleClassChange}
            options={classOptions}
            required
          />
          <Select
            label="Section"
            value={selectedSection}
            onChange={handleSectionChange}
            options={sectionOptions}
            required
          />
          <Select
            label="Marksheet"
            value={selectedMarksheet}
            onChange={setSelectedMarksheet}
            options={marksheetOptions}
            required
          />
        </div>

        {/* Marks Table */}
        {students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  {subjects.map((subject) => (
                    <th key={subject.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {subject.name}
                    </th>
                  ))}
                  {subjects.map((subject) => (
                    <th key={subject.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => {
                  const studentMark = studentMarks.find((sm) => sm.studentId === student.id);
                  return (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      {studentMark?.marks.map((mark) => (
                        <td key={mark.subjectId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Input
                            value={mark.marks.toString()}
                            onChange={(value) => handleMarksChange(student.id, mark.subjectId, value, 'marks')}
                            type="number"
                            min="0"
                            max={mark.maxMarks}
                            required
                          />
                        </td>
                      ))}
                      {studentMark?.marks.map((mark) => (
                        <td key={mark.subjectId} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Input
                            value={mark.remarks}
                            onChange={(value) => handleMarksChange(student.id, mark.subjectId, value, 'remarks')}
                            placeholder="Add remarks"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Save Button */}
        {students.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Marks
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 