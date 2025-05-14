import axios from 'axios';

const API_BASE_URL = 'https://backend-mongodb-vkph.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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