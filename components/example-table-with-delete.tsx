'use client';

import { useState } from 'react';
import { DeleteButton } from '@/components/ui/delete-button';

// Example data for demonstration
const exampleStudents = [
  { id: '1', name: 'John Doe', class: '10A', rollNo: '101' },
  { id: '2', name: 'Jane Smith', class: '9B', rollNo: '202' },
  { id: '3', name: 'Mike Johnson', class: '11C', rollNo: '303' },
  { id: '4', name: 'Sarah Williams', class: '8A', rollNo: '404' },
];

export default function ExampleTableWithDelete() {
  const [students, setStudents] = useState(exampleStudents);

  const handleDeleteStudent = (student: typeof exampleStudents[0]) => {
    // Filter out the deleted student
    setStudents(prevStudents => 
      prevStudents.filter(s => s.id !== student.id)
    );
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Students List</h2>
      
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.class}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.rollNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <DeleteButton 
                    item={student}
                    itemName={student.name}
                    onDelete={handleDeleteStudent}
                    modalTitle="Delete Student"
                    modalDescription="Are you sure you want to delete this student? All data associated with this student will be permanently removed. This action cannot be undone."
                  />
                </td>
              </tr>
            ))}
            
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 