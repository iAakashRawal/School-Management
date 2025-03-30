'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/form/input';
import { Select } from '@/components/ui/form/select';

interface Subject {
  id: string;
  name: string;
  maxMarks: number;
  passMarks: number;
  weightage: number;
}

interface MarksheetDesign {
  id: string;
  name: string;
  class: string;
  section: string;
  subjects: Subject[];
  totalMarks: number;
  passPercentage: number;
}

export function MarksheetDesigner() {
  const [design, setDesign] = useState<MarksheetDesign>({
    id: '',
    name: '',
    class: '',
    section: '',
    subjects: [],
    totalMarks: 0,
    passPercentage: 35,
  });

  const [newSubject, setNewSubject] = useState<Subject>({
    id: '',
    name: '',
    maxMarks: 0,
    passMarks: 0,
    weightage: 0,
  });

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

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.maxMarks) {
      setDesign((prev) => ({
        ...prev,
        subjects: [...prev.subjects, { ...newSubject, id: Date.now().toString() }],
        totalMarks: prev.totalMarks + newSubject.maxMarks,
      }));
      setNewSubject({
        id: '',
        name: '',
        maxMarks: 0,
        passMarks: 0,
        weightage: 0,
      });
    }
  };

  const handleRemoveSubject = (subjectId: string) => {
    const subject = design.subjects.find((s) => s.id === subjectId);
    if (subject) {
      setDesign((prev) => ({
        ...prev,
        subjects: prev.subjects.filter((s) => s.id !== subjectId),
        totalMarks: prev.totalMarks - subject.maxMarks,
      }));
    }
  };

  const handleSave = () => {
    // Save marksheet design
    console.log('Saving marksheet design:', design);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Design Marksheet</h2>
      
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Marksheet Name"
            value={design.name}
            onChange={(value) => setDesign((prev) => ({ ...prev, name: value }))}
            required
          />
          <Select
            label="Class"
            value={design.class}
            onChange={(value) => setDesign((prev) => ({ ...prev, class: value }))}
            options={classOptions}
            required
          />
          <Select
            label="Section"
            value={design.section}
            onChange={(value) => setDesign((prev) => ({ ...prev, section: value }))}
            options={sectionOptions}
            required
          />
          <Input
            label="Pass Percentage"
            value={design.passPercentage.toString()}
            onChange={(value) => setDesign((prev) => ({ ...prev, passPercentage: Number(value) }))}
            type="number"
            required
          />
        </div>

        {/* Add Subject */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Subject</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Subject Name"
              value={newSubject.name}
              onChange={(value) => setNewSubject((prev) => ({ ...prev, name: value }))}
              required
            />
            <Input
              label="Max Marks"
              value={newSubject.maxMarks.toString()}
              onChange={(value) => setNewSubject((prev) => ({ ...prev, maxMarks: Number(value) }))}
              type="number"
              required
            />
            <Input
              label="Pass Marks"
              value={newSubject.passMarks.toString()}
              onChange={(value) => setNewSubject((prev) => ({ ...prev, passMarks: Number(value) }))}
              type="number"
              required
            />
            <Input
              label="Weightage (%)"
              value={newSubject.weightage.toString()}
              onChange={(value) => setNewSubject((prev) => ({ ...prev, weightage: Number(value) }))}
              type="number"
              required
            />
          </div>
          <button
            onClick={handleAddSubject}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Subject
          </button>
        </div>

        {/* Subjects List */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Subjects</h3>
          <div className="overflow-x-auto">
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
                    Pass Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weightage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {design.subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.maxMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.passMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.weightage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleRemoveSubject(subject.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Marks */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Total Marks: {design.totalMarks}</h3>
              <p className="text-sm text-gray-500">
                Pass Percentage: {design.passPercentage}%
              </p>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 