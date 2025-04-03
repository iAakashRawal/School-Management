import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/api-client';

type ExamType = 'MID_TERM' | 'FINAL' | 'QUIZ' | 'ASSIGNMENT';

type Exam = {
  id: string;
  name: string;
  type: ExamType;
  startDate: string;
  endDate: string;
  classId: string;
  createdAt: string;
  updatedAt: string;
  class: {
    id: string;
    name: string;
    section: string;
    academicYear: string;
  };
  _count?: {
    results: number;
  };
};

type ExamResult = {
  id: string;
  examId: string;
  studentId: string;
  marks: number;
  grade: string;
  remarks?: string;
  student: {
    id: string;
    rollNo: string;
    user: {
      id: string;
      name: string;
    };
  };
};

type PaginatedExams = {
  exams: Exam[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

type ExamParams = {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  type?: ExamType;
};

// Fetch exams with pagination
export function useExams(params: ExamParams = {}) {
  const { page = 1, limit = 10, search, classId, type } = params;
  
  return useQuery<ApiResponse<PaginatedExams>>({
    queryKey: ['exams', { page, limit, search, classId, type }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (search) searchParams.append('search', search);
      if (classId) searchParams.append('classId', classId);
      if (type) searchParams.append('type', type);
      
      const response = await apiClient.get(`/exams?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch a single exam with results
export function useExam(id: string) {
  return useQuery<ApiResponse<Exam & { results: ExamResult[] }>>({
    queryKey: ['exam', id],
    queryFn: async () => {
      const response = await apiClient.get(`/exams/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new exam
export function useCreateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'class' | '_count'>) => {
      const response = await apiClient.post('/exams', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

// Update an exam
export function useUpdateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'class' | '_count'>> }) => {
      const response = await apiClient.put(`/exams/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam', variables.id] });
    },
  });
}

// Delete an exam
export function useDeleteExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/exams/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

// Add result to an exam
export function useAddExamResult() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ examId, data }: { examId: string; data: Omit<ExamResult, 'id' | 'student'> }) => {
      const response = await apiClient.post(`/exams/${examId}/results`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam', variables.examId] });
    },
  });
}

// Update exam result
export function useUpdateExamResult() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ resultId, data }: { resultId: string; data: Partial<Omit<ExamResult, 'id' | 'examId' | 'studentId' | 'student'>> }) => {
      const response = await apiClient.put(`/exam-results/${resultId}`, data);
      return response.data;
    },
    onSuccess: (response) => {
      // The response should include the examId
      const examId = response.data?.examId;
      if (examId) {
        queryClient.invalidateQueries({ queryKey: ['exam', examId] });
      }
    },
  });
} 