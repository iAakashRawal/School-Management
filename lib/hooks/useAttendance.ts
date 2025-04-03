import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/api-client';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

type AttendanceRecord = {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    admissionNo: string;
    rollNo: string;
    user: {
      id: string;
      name: string;
      email?: string;
    };
    class: {
      id: string;
      name: string;
      section: string;
    };
  };
};

type PaginatedAttendance = {
  attendanceRecords: AttendanceRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

type AttendanceParams = {
  page?: number;
  limit?: number;
  date?: string;
  studentId?: string;
  classId?: string;
  status?: AttendanceStatus;
};

type AttendanceInput = {
  studentId: string;
  date: string;
  status: AttendanceStatus;
};

type BulkAttendanceInput = {
  date: string;
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
  }>;
};

// Fetch attendance records with filters and pagination
export function useAttendance(params: AttendanceParams = {}) {
  const { page = 1, limit = 10, date, studentId, classId, status } = params;
  
  return useQuery<ApiResponse<PaginatedAttendance>>({
    queryKey: ['attendance', { page, limit, date, studentId, classId, status }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (date) searchParams.append('date', date);
      if (studentId) searchParams.append('studentId', studentId);
      if (classId) searchParams.append('classId', classId);
      if (status) searchParams.append('status', status);
      
      const response = await apiClient.get(`/attendance?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Create or update a single attendance record
export function useCreateAttendance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AttendanceInput) => {
      const response = await apiClient.post('/attendance', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

// Create or update multiple attendance records (bulk operation)
export function useBulkAttendance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BulkAttendanceInput) => {
      const response = await apiClient.patch('/attendance', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

// Get daily attendance for class on a specific date
export function useDailyAttendance(classId: string, date: string) {
  return useQuery<ApiResponse<AttendanceRecord[]>>({
    queryKey: ['attendance', 'daily', classId, date],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('classId', classId);
      searchParams.append('date', date);
      searchParams.append('limit', '100'); // Get all students in the class
      
      const response = await apiClient.get(`/attendance?${searchParams.toString()}`);
      return {
        ...response.data,
        data: response.data.data.attendanceRecords,
      };
    },
    enabled: !!classId && !!date,
  });
}

// Get monthly attendance stats for a student
export function useStudentMonthlyAttendance(studentId: string, month: number, year: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return useQuery<ApiResponse<{ records: AttendanceRecord[]; stats: { present: number; absent: number; late: number; excused: number; total: number } }>>({
    queryKey: ['attendance', 'monthly', studentId, month, year],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('studentId', studentId);
      searchParams.append('startDate', startDate.toISOString().split('T')[0]);
      searchParams.append('endDate', endDate.toISOString().split('T')[0]);
      searchParams.append('limit', '100');
      
      const response = await apiClient.get(`/attendance?${searchParams.toString()}`);
      
      // Calculate statistics
      const records = response.data.data.attendanceRecords;
      const stats = {
        present: records.filter((r: AttendanceRecord) => r.status === 'PRESENT').length,
        absent: records.filter((r: AttendanceRecord) => r.status === 'ABSENT').length,
        late: records.filter((r: AttendanceRecord) => r.status === 'LATE').length,
        excused: records.filter((r: AttendanceRecord) => r.status === 'EXCUSED').length,
        total: records.length,
      };
      
      return {
        ...response.data,
        data: {
          records,
          stats,
        },
      };
    },
    enabled: !!studentId,
  });
} 