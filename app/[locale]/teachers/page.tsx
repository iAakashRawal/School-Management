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
import { useTeachers, useDeleteTeacher } from '@/lib/hooks/useTeachers';
import { formatDate } from '@/lib/utils';
import { Trash, Edit, Search, Plus } from 'lucide-react';

export default function TeachersPage() {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  // Fetch teachers with React Query
  const { data, isLoading, error } = useTeachers({ 
    page, 
    limit, 
    search: searchQuery 
  });
  
  // Delete teacher mutation
  const deleteTeacher = useDeleteTeacher();

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
    if (window.confirm(t('teachers.confirm_delete'))) {
      try {
        await deleteTeacher.mutateAsync(id);
        alert(t('teachers.delete_success'));
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert(t('teachers.delete_error'));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('teachers.all')}</h1>
        <Link href="/teachers/add">
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            {t('teachers.add')}
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('teachers.search_placeholder')}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>{t('common.search')}</Button>
      </div>

      {/* Teachers Table */}
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
                  <TableHead>{t('teachers.name')}</TableHead>
                  <TableHead>{t('teachers.employee_id')}</TableHead>
                  <TableHead>{t('teachers.email')}</TableHead>
                  <TableHead>{t('teachers.qualification')}</TableHead>
                  <TableHead>{t('teachers.specialization')}</TableHead>
                  <TableHead>{t('teachers.joining_date')}</TableHead>
                  <TableHead>{t('teachers.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.teachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {t('teachers.no_teachers')}
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        <Link href={`/teachers/${teacher.id}`} className="hover:underline">
                          {teacher.user.name}
                        </Link>
                      </TableCell>
                      <TableCell>{teacher.employeeId}</TableCell>
                      <TableCell>{teacher.user.email}</TableCell>
                      <TableCell>{teacher.qualification}</TableCell>
                      <TableCell>{teacher.specialization || '-'}</TableCell>
                      <TableCell>{formatDate(teacher.joiningDate)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/teachers/${teacher.id}/edit`}>
                            <Button variant="outline" size="icon" title={t('common.edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="icon"
                            title={t('common.delete')}
                            onClick={() => handleDelete(teacher.id)}
                            disabled={deleteTeacher.isPending || (teacher._count?.classAssignments || 0) > 0}
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
          {data?.data?.pagination?.total && data.data.pagination.total > 0 && (
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