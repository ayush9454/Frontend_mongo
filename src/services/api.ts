import axios from 'axios';

// Update this to your Render deployment URL
const API_BASE_URL = 'https://backend-mongodb-vkph.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log the request for debugging
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration and log errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('Response from:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log the error
    console.error('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('API endpoint not found:', originalRequest?.url);
      return Promise.reject(new Error('API endpoint not found. Please check the server configuration.'));
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }

    return Promise.reject(error);
  }
);

export const parkingService = {
  getParkingSpaces: () => api.get('/parking-spaces'),
  getParkingSpace: (id: string) => api.get(`/parking-spaces/${id}`),
  createBooking: (data: any) => api.post('/bookings', data),
  getBookings: (userId?: string) => 
    userId ? api.get(`/bookings?userId=${userId}`) : api.get('/bookings'),
  getBookingHistory: (userId: string) => api.get(`/bookings/history?userId=${userId}`),
  cancelBooking: (id: string) => api.post(`/bookings/${id}/cancel`),
};

export const authService = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) => 
    api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default api; 