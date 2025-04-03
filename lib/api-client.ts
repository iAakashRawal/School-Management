import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle API errors here
    const message = error.response?.data?.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// Type for API response
export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export default apiClient; 