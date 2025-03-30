'use client';

import { useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableHeaderCell, TableBody } from "@tremor/react";
import { CreateMenu } from "@/components/ui/create-menu";
import Link from "next/link";
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteAlertModal } from '@/components/ui/delete-alert-modal';

const initialStudents = [
  {
    id: 1,
    name: "John Doe",
    rollNumber: "2024001",
    class: "10th",
    section: "A",
    admissionNumber: "ADM001",
    dateOfBirth: "2008-05-15",
    gender: "Male",
  },
  {
    id: 2,
    name: "Jane Smith",
    rollNumber: "2024002",
    class: "10th",
    section: "B",
    admissionNumber: "ADM002",
    dateOfBirth: "2008-07-20",
    gender: "Female",
  },
];

const createMenuItems = [
  {
    label: "Add New Student",
    href: "/students/add",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "Bulk Import",
    href: "/students/import",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState(initialStudents);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof initialStudents[0] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (student: typeof initialStudents[0]) => {
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudent) return;
    
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter out the deleted student
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== selectedStudent.id)
      );
      
      // Close the modal
      setDeleteModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error deleting student:', error);
      // Handle error (could show an error toast here)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Students</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage student information and records
          </p>
        </div>
        <CreateMenu items={createMenuItems} label="Create" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
          <div className="flex space-x-4">
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Class
              </label>
              <select
                id="class"
                name="class"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>All Classes</option>
                <option>10th</option>
                <option>11th</option>
                <option>12th</option>
              </select>
            </div>
            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Section
              </label>
              <select
                id="section"
                name="section"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>All Sections</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>All Genders</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>
        </div>

        <Table className="mt-6">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Roll Number</TableHeaderCell>
              <TableHeaderCell>Admission Number</TableHeaderCell>
              <TableHeaderCell>Class</TableHeaderCell>
              <TableHeaderCell>Section</TableHeaderCell>
              <TableHeaderCell>Date of Birth</TableHeaderCell>
              <TableHeaderCell>Gender</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.admissionNumber}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.dateOfBirth}</TableCell>
                <TableCell>{student.gender}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link
                      href={`/students/${student.id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View
                    </Link>
                    <Link
                      href={`/students/${student.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(student)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </div>

      {/* Delete Alert Modal */}
      <DeleteAlertModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        description="Are you sure you want to delete this student? All data associated with this student will be permanently removed. This action cannot be undone."
        itemName={selectedStudent?.name}
        isLoading={isDeleting}
      />
    </div>
  );
} 