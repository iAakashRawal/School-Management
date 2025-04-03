'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useStudents, useDeleteStudent } from '@/lib/hooks/useStudents';
import { UserPlus, Trash, Edit, Search, Plus } from 'lucide-react';

export default function StudentsPage() {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  // Fetch students with React Query
  const { data, isLoading, error } = useStudents({ 
    page, 
    limit, 
    search: searchQuery 
  });
  
  // Delete student mutation
  const deleteStudent = useDeleteStudent();

  // Handle search
  const handleSearch = () => {
    setSearchQuery(search);
    setPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm(t('students.confirm_delete'))) {
      try {
        await deleteStudent.mutateAsync(id);
        alert(t('students.delete_success'));
      } catch (error) {
        console.error('Error deleting student:', error);
        alert(t('students.delete_error'));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('students.all')}</h1>
        <Link href="/students/add">
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            {t('students.add')}
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('students.search_placeholder')}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>{t('common.search')}</Button>
      </div>

      {/* Students Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{t('common.error_loading')}</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('students.name')}</TableHead>
                  <TableHead>{t('students.admission_no')}</TableHead>
                  <TableHead>{t('students.class')}</TableHead>
                  <TableHead>{t('students.roll_no')}</TableHead>
                  <TableHead>{t('students.parent_name')}</TableHead>
                  <TableHead>{t('students.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t('students.no_students')}
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <Link href={`/students/${student.id}`} className="hover:underline">
                          {student.user.name}
                        </Link>
                      </TableCell>
                      <TableCell>{student.admissionNo}</TableCell>
                      <TableCell>
                        {student.class.name} - {student.class.section}
                      </TableCell>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/students/${student.id}/edit`}>
                            <Button variant="outline" size="icon" title={t('common.edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="icon"
                            title={t('common.delete')}
                            onClick={() => handleDelete(student.id)}
                            disabled={deleteStudent.isPending}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data?.data.pagination.total > 0 && (
            <Pagination
              currentPage={page}
              totalPages={data?.data.pagination.pages || 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
} 