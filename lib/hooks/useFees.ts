import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/api-client';

type FeeType = 'TUITION' | 'TRANSPORT' | 'HOSTEL' | 'LIBRARY' | 'OTHER';
type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

type Fee = {
  id: string;
  studentId: string;
  amount: number;
  type: FeeType;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    admissionNo: string;
    rollNo: string;
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
};

type PaginatedFees = {
  fees: Fee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

type FeeParams = {
  page?: number;
  limit?: number;
  studentId?: string;
  classId?: string;
  status?: PaymentStatus;
  type?: FeeType;
};

// Fetch fees with pagination and filtering
export function useFees(params: FeeParams = {}) {
  const { page = 1, limit = 10, studentId, classId, status, type } = params;
  
  return useQuery<ApiResponse<PaginatedFees>>({
    queryKey: ['fees', { page, limit, studentId, classId, status, type }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (studentId) searchParams.append('studentId', studentId);
      if (classId) searchParams.append('classId', classId);
      if (status) searchParams.append('status', status);
      if (type) searchParams.append('type', type);
      
      const response = await apiClient.get(`/fees?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch a single fee record
export function useFee(id: string) {
  return useQuery<ApiResponse<Fee>>({
    queryKey: ['fee', id],
    queryFn: async () => {
      const response = await apiClient.get(`/fees/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new fee
export function useCreateFee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Fee, 'id' | 'createdAt' | 'updatedAt' | 'student'>) => {
      const response = await apiClient.post('/fees', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
}

// Create bulk fees for a class
export function useCreateBulkFees() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { classId: string; amount: number; type: FeeType; dueDate: string; description?: string }) => {
      const response = await apiClient.patch('/fees', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
}

// Update a fee
export function useUpdateFee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Fee, 'id' | 'studentId' | 'createdAt' | 'updatedAt' | 'student'>> }) => {
      const response = await apiClient.put(`/fees/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      queryClient.invalidateQueries({ queryKey: ['fee', variables.id] });
    },
  });
}

// Delete a fee
export function useDeleteFee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/fees/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
}

// Dashboard summary of fees by status
export function useFeeSummary() {
  return useQuery<ApiResponse<{
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    cancelled: number;
    pendingAmount: number;
    paidAmount: number;
    overdueAmount: number;
  }>>({
    queryKey: ['fees', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get('/fees/summary');
      return response.data;
    },
  });
}

// Get student fees summary
export function useStudentFeesSummary(studentId: string) {
  return useQuery<ApiResponse<{
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    pendingAmount: number;
    paidAmount: number;
    overdueAmount: number;
  }>>({
    queryKey: ['fees', 'student-summary', studentId],
    queryFn: async () => {
      const response = await apiClient.get(`/fees/student-summary/${studentId}`);
      return response.data;
    },
    enabled: !!studentId,
  });
} 