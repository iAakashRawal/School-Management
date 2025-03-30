'use client';

import { useState } from 'react';
import { Card, Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody } from "@tremor/react"
import { DeleteAlertModal } from '@/components/ui/delete-alert-modal';

interface ClassInfo {
  id: number;
  name: string;
  sections: string[];
  totalStudents: number;
  classTeacher: string;
  subjects: string[];
}

const initialClasses: ClassInfo[] = [
  {
    id: 1,
    name: "10th",
    sections: ["A", "B", "C"],
    totalStudents: 120,
    classTeacher: "Dr. Robert Wilson",
    subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"],
  },
  {
    id: 2,
    name: "11th",
    sections: ["A", "B"],
    totalStudents: 80,
    classTeacher: "Ms. Sarah Johnson",
    subjects: ["Mathematics", "Physics", "Chemistry", "English", "Computer Science"],
  },
]

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassInfo[]>(initialClasses);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (classInfo: ClassInfo) => {
    setSelectedClass(classInfo);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedClass) return;
    
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter out the deleted class
      setClasses(prevClasses => 
        prevClasses.filter(cls => cls.id !== selectedClass.id)
      );
      
      // Close the modal
      setDeleteModalOpen(false);
      setSelectedClass(null);
    } catch (error) {
      console.error('Error deleting class:', error);
      // Handle error (could show an error toast here)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage classes, sections, and subjects
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Class
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Section
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {classes.map((classInfo) => (
          <Card key={classInfo.id}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Class {classInfo.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Class Teacher: {classInfo.classTeacher}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {classInfo.totalStudents} Students
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {classInfo.sections.length} Sections
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Sections</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {classInfo.sections.map((section) => (
                    <span
                      key={section}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      Section {section}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Subjects</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {classInfo.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button className="text-indigo-600 hover:text-indigo-900">
                Edit
              </button>
              <button 
                className="text-red-600 hover:text-red-900"
                onClick={() => handleDeleteClick(classInfo)}
              >
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Alert Modal */}
      <DeleteAlertModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Class"
        description="Are you sure you want to delete this class? All data associated with this class including sections, subject assignments, and student enrollments will be permanently removed. This action cannot be undone."
        itemName={selectedClass ? `Class ${selectedClass.name}` : ''}
        isLoading={isDeleting}
      />
    </div>
  )
} 