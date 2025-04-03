import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { ApiResponse } from '@/lib/api-client';

// Types
export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    transactions: number;
  };
};

export type InventoryTransaction = {
  id: string;
  itemId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  date: string;
  remarks?: string;
  referenceNo?: string;
  createdAt: string;
  updatedAt: string;
  item?: {
    id: string;
    name: string;
    category: string;
    unit: string;
  };
};

type PaginatedItems = {
  items: InventoryItem[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

type PaginatedTransactions = {
  transactions: InventoryTransaction[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

type ItemParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

type TransactionParams = {
  page?: number;
  limit?: number;
  itemId?: string;
  type?: 'IN' | 'OUT';
  startDate?: string;
  endDate?: string;
};

// Fetch inventory items with pagination
export function useInventoryItems(params: ItemParams = {}) {
  const { page = 1, limit = 10, search, category } = params;
  
  return useQuery<ApiResponse<PaginatedItems>>({
    queryKey: ['inventory-items', { page, limit, search, category }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (search) searchParams.append('search', search);
      if (category) searchParams.append('category', category);
      
      const response = await apiClient.get(`/inventory/items?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch a single inventory item
export function useInventoryItem(id: string) {
  return useQuery<ApiResponse<InventoryItem>>({
    queryKey: ['inventory-item', id],
    queryFn: async () => {
      const response = await apiClient.get(`/inventory/items/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new inventory item
export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | '_count'>) => {
      const response = await apiClient.post('/inventory/items', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
}

// Update an inventory item
export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | '_count'>> }) => {
      const response = await apiClient.put(`/inventory/items/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-item', variables.id] });
    },
  });
}

// Delete an inventory item
export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/inventory/items/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
}

// Fetch inventory transactions
export function useInventoryTransactions(params: TransactionParams = {}) {
  const { page = 1, limit = 10, itemId, type, startDate, endDate } = params;
  
  return useQuery<ApiResponse<PaginatedTransactions>>({
    queryKey: ['inventory-transactions', { page, limit, itemId, type, startDate, endDate }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', page.toString());
      searchParams.append('limit', limit.toString());
      if (itemId) searchParams.append('itemId', itemId);
      if (type) searchParams.append('type', type);
      if (startDate) searchParams.append('startDate', startDate);
      if (endDate) searchParams.append('endDate', endDate);
      
      const response = await apiClient.get(`/inventory/transactions?${searchParams.toString()}`);
      return response.data;
    },
  });
}

// Fetch a single transaction
export function useInventoryTransaction(id: string) {
  return useQuery<ApiResponse<InventoryTransaction>>({
    queryKey: ['inventory-transaction', id],
    queryFn: async () => {
      const response = await apiClient.get(`/inventory/transactions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create a new transaction
export function useCreateInventoryTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      itemId: string;
      type: 'IN' | 'OUT';
      quantity: number;
      date: string;
      remarks?: string;
      referenceNo?: string;
    }) => {
      const response = await apiClient.post('/inventory/transactions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
}

// Delete a transaction
export function useDeleteInventoryTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/inventory/transactions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
    },
  });
}

// Get inventory summary
export function useInventorySummary() {
  return useQuery<ApiResponse<{
    totalItems: number;
    lowStockItems: number;
    totalTransactions: {
      in: number;
      out: number;
    };
    recentTransactions: InventoryTransaction[];
  }>>({
    queryKey: ['inventory-summary'],
    queryFn: async () => {
      const response = await apiClient.get('/inventory/summary');
      return response.data;
    },
  });
} 