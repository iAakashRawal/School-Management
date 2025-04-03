import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/api-client';

type Student = {
  id: string;
  admissionNo: string;
  rollNo: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  class: {
    id: string;
    name: string;
    section: string;
  };
};

type PaginatedStudents = {
  students: Student[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

type StudentParams = {
  page?: number;
  limit?: number;
  search?: string;
  class?: string;
};

// Fetch students with pagination
export function useStudents(params: StudentParams = {}) {
  const { page = 1, limit = 10, search, class: classId } = params;
  
  return useQuery<ApiResponse<PaginatedStudents>>({
    queryKey: ['students', { page, limit, search, classId }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (search) searchParams.append('search', search);
      if (classId) searchParams.append('class', classId);
      
      const response = await apiClient.get(`/students?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch a single student
export function useStudent(id: string) {
  return useQuery<ApiResponse<Student>>({
    queryKey: ['student', id],
    queryFn: async () => {
      const response = await apiClient.get(`/students/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new student
export function useCreateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (studentData: any) => {
      const response = await apiClient.post('/students', studentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// Update a student
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/students/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
    },
  });
}

// Delete a student
export function useDeleteStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/students/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
} 