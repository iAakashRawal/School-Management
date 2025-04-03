import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/api-client';

type Class = {
  id: string;
  name: string;
  section: string;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    students: number;
    assignments: number;
  };
};

type PaginatedClasses = {
  classes: Class[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

type ClassParams = {
  page?: number;
  limit?: number;
  search?: string;
  academicYear?: string;
};

// Fetch classes with pagination
export function useClasses(params: ClassParams = {}) {
  const { page = 1, limit = 10, search, academicYear } = params;
  
  return useQuery<ApiResponse<PaginatedClasses>>({
    queryKey: ['classes', { page, limit, search, academicYear }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (search) searchParams.append('search', search);
      if (academicYear) searchParams.append('academicYear', academicYear);
      
      const response = await apiClient.get(`/classes?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch all classes (for dropdowns, etc.)
export function useAllClasses() {
  return useQuery<ApiResponse<Class[]>>({
    queryKey: ['classes', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/classes?limit=100');
      return {
        ...response.data,
        data: response.data.data.classes,
      };
    },
  });
}

// Fetch a single class
export function useClass(id: string) {
  return useQuery<ApiResponse<Class>>({
    queryKey: ['class', id],
    queryFn: async () => {
      const response = await apiClient.get(`/classes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new class
export function useCreateClass() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiClient.post('/classes', classData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}

// Update a class
export function useUpdateClass() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Class> }) => {
      const response = await apiClient.put(`/classes/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['class', variables.id] });
    },
  });
}

// Delete a class
export function useDeleteClass() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/classes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
}