import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/api-client';

// Types
export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assignments: number;
  };
};

export type LibraryAssignment = {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'LOST';
  createdAt: string;
  updatedAt: string;
  book?: Book;
  student?: {
    id: string;
    user: {
      name: string;
      email: string;
    };
    class: {
      name: string;
      section: string;
    };
  };
};

export type PaginatedBooks = {
  books: Book[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export type PaginatedAssignments = {
  assignments: LibraryAssignment[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

type BookParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

type AssignmentParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  studentId?: string;
};

// Fetch books with pagination
export function useBooks(params: BookParams = {}) {
  const { page = 1, limit = 10, search, category } = params;
  
  return useQuery<ApiResponse<PaginatedBooks>>({
    queryKey: ['books', { page, limit, search, category }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (search) searchParams.append('search', search);
      if (category) searchParams.append('category', category);
      
      const response = await apiClient.get(`/library/books?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch a single book
export function useBook(id: string) {
  return useQuery<ApiResponse<Book>>({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await apiClient.get(`/library/books/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new book
export function useCreateBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await apiClient.post('/library/books', bookData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

// Update a book
export function useUpdateBook(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookData: Partial<Book>) => {
      const response = await apiClient.put(`/library/books/${id}`, bookData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    },
  });
}

// Delete a book
export function useDeleteBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/library/books/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

// Fetch library assignments
export function useLibraryAssignments(params: AssignmentParams = {}) {
  const { page = 1, limit = 10, search, status, studentId } = params;
  
  return useQuery<ApiResponse<PaginatedAssignments>>({
    queryKey: ['libraryAssignments', { page, limit, search, status, studentId }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (search) searchParams.append('search', search);
      if (status) searchParams.append('status', status);
      if (studentId) searchParams.append('studentId', studentId);
      
      const response = await apiClient.get(`/library/assignments?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch a single library assignment
export function useLibraryAssignment(id: string) {
  return useQuery<ApiResponse<LibraryAssignment>>({
    queryKey: ['libraryAssignment', id],
    queryFn: async () => {
      const response = await apiClient.get(`/library/assignments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new book assignment (issue a book)
export function useIssueBook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentData: {
      bookId: string;
      studentId: string;
      issueDate: string;
      dueDate: string;
    }) => {
      const response = await apiClient.post('/library/assignments', assignmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

// Update a book assignment (return, mark as lost, etc.)
export function useUpdateAssignment(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assignmentData: {
      status?: 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'LOST';
      returnDate?: string;
      remarks?: string;
    }) => {
      const response = await apiClient.put(`/library/assignments/${id}`, assignmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryAssignments'] });
      queryClient.invalidateQueries({ queryKey: ['libraryAssignment', id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

// Delete a book assignment record
export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/library/assignments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryAssignments'] });
    },
  });
} 