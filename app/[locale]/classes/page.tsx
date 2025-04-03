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
import { useClasses, useDeleteClass } from '@/lib/hooks/useClasses';
import { Trash, Edit, Search, Plus } from 'lucide-react';

export default function ClassesPage() {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  // Fetch classes with React Query
  const { data, isLoading, error } = useClasses({ 
    page, 
    limit, 
    search: searchQuery 
  });
  
  // Delete class mutation
  const deleteClass = useDeleteClass();

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
    if (window.confirm(t('classes.confirm_delete'))) {
      try {
        await deleteClass.mutateAsync(id);
        alert(t('classes.delete_success'));
      } catch (error) {
        console.error('Error deleting class:', error);
        alert(t('classes.delete_error'));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('classes.all')}</h1>
        <Link href="/classes/add">
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            {t('classes.add')}
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('classes.search_placeholder')}
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>{t('common.search')}</Button>
      </div>

      {/* Classes Table */}
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
                  <TableHead>{t('classes.name')}</TableHead>
                  <TableHead>{t('classes.section')}</TableHead>
                  <TableHead>{t('classes.academic_year')}</TableHead>
                  <TableHead>{t('classes.students_count')}</TableHead>
                  <TableHead>{t('classes.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {t('classes.no_classes')}
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.classes.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">
                        <Link href={`/classes/${classItem.id}`} className="hover:underline">
                          {classItem.name}
                        </Link>
                      </TableCell>
                      <TableCell>{classItem.section}</TableCell>
                      <TableCell>{classItem.academicYear}</TableCell>
                      <TableCell>{classItem._count?.students || 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/classes/${classItem.id}/edit`}>
                            <Button variant="outline" size="icon" title={t('common.edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="icon"
                            title={t('common.delete')}
                            onClick={() => handleDelete(classItem.id)}
                            disabled={deleteClass.isPending || (classItem._count?.students || 0) > 0}
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