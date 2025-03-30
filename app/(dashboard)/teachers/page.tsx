'use client';

import { useState } from 'react';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { DeleteAlertModal } from '@/components/ui/delete-alert-modal';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  class: string;
  email: string;
  status: 'active' | 'inactive';
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    subject: 'Mathematics',
    class: '10, 11',
    email: 'sarah.wilson@school.com',
    status: 'active',
  },
  {
    id: '2',
    name: 'Mr. James Brown',
    subject: 'Science',
    class: '9, 10',
    email: 'james.brown@school.com',
    status: 'active',
  },
  {
    id: '3',
    name: 'Ms. Emily Davis',
    subject: 'English',
    class: '11, 12',
    email: 'emily.davis@school.com',
    status: 'inactive',
  },
];

const columns = [
  { header: 'Name', accessor: 'name' as keyof Teacher },
  { header: 'Subject', accessor: 'subject' as keyof Teacher },
  { header: 'Class', accessor: 'class' as keyof Teacher },
  { header: 'Email', accessor: 'email' as keyof Teacher },
  {
    header: 'Status',
    accessor: 'status' as keyof Teacher,
    cell: (teacher: Teacher) => (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          teacher.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {teacher.status}
      </span>
    ),
  },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRowClick = (teacher: Teacher) => {
    // Handle row click - e.g., navigate to teacher details
    console.log('Clicked teacher:', teacher);
  };

  const handleDeleteClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTeacher) return;
    
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter out the deleted teacher
      setTeachers(prevTeachers => 
        prevTeachers.filter(teacher => teacher.id !== selectedTeacher.id)
      );
      
      // Close the modal
      setDeleteModalOpen(false);
      setSelectedTeacher(null);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      // Handle error (could show an error toast here)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Teachers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your school&apos;s teaching staff
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Add Teacher
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-4 sm:p-6">
          <ResponsiveTable
            data={teachers}
            columns={columns}
            title="Teacher List"
            onRowClick={handleRowClick}
            showDeleteButton={true}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Delete Alert Modal */}
      <DeleteAlertModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Teacher"
        description="Are you sure you want to delete this teacher? All data associated with this teacher will be permanently removed. This action cannot be undone."
        itemName={selectedTeacher?.name}
        isLoading={isDeleting}
      />
    </div>
  );
} 