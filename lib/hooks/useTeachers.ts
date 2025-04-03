import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/api-client';

type Teacher = {
  id: string;
  employeeId: string;
  qualification: string;
  specialization?: string;
  joiningDate: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile?: {
      phone?: string;
      address?: string;
      avatar?: string;
    };
  };
  _count?: {
    classAssignments: number;
  };
};

type PaginatedTeachers = {
  teachers: Teacher[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

type TeacherParams = {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
};

// Fetch teachers with pagination
export function useTeachers(params: TeacherParams = {}) {
  const { page = 1, limit = 10, search, specialization } = params;
  
  return useQuery<ApiResponse<PaginatedTeachers>>({
    queryKey: ['teachers', { page, limit, search, specialization }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (search) searchParams.append('search', search);
      if (specialization) searchParams.append('specialization', specialization);
      
      const response = await apiClient.get(`/teachers?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch a single teacher
export function useTeacher(id: string) {
  return useQuery<ApiResponse<Teacher>>({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const response = await apiClient.get(`/teachers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new teacher
export function useCreateTeacher() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (teacherData: any) => {
      const response = await apiClient.post('/teachers', teacherData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
}

// Update a teacher
export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiClient.put(`/teachers/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', variables.id] });
    },
  });
}

// Delete a teacher
export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/teachers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
} 