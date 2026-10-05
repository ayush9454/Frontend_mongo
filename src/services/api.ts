import axios from "axios";
import type {
  User,
  ParkingSpace,
  Booking,
  BookingRequest,
  Page,
  BookingSummary,
} from "../types";
const raw = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5050/api")
  .trim()
  .replace(/\/+$/, "");
const api = axios.create({
  baseURL: raw.endsWith("/api") ? raw : `${raw}/api`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
const expiredListeners = new Set<() => void>();
export const onSessionExpired = (listener: () => void) => {
  expiredListeners.add(listener);
  return () => {
    expiredListeners.delete(listener);
  };
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.headers?.Authorization ===
        `Bearer ${localStorage.getItem("token")}` &&
      !["/auth/login", "/auth/register"].includes(error.config?.url || "")
    )
      expiredListeners.forEach((listener) => listener());
    return Promise.reject(error);
  },
);
export function errorMessage(
  error: unknown,
  fallback = "The request could not be completed",
): string {
  if (axios.isAxiosError<{ error?: { message?: string } }>(error))
    return (
      error.response?.data?.error?.message ||
      (error.code === "ECONNABORTED"
        ? "The request timed out. Please retry."
        : fallback)
    );
  return fallback;
}
export function uncertainResult(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    (!error.response || error.response.status >= 500)
  );
}
export const parkingService = {
  getParkingSpaces: () => api.get<ParkingSpace[]>("/parking-spaces"),
  createBooking: (data: BookingRequest, key: string) =>
    api.post<Booking>("/bookings", data, {
      headers: { "Idempotency-Key": key },
    }),
  getBookings: (page = 1, status?: "current") =>
    api.get<Page<Booking>>("/bookings", {
      params: { page, pageSize: 20, status },
    }),
  getBookingHistory: (page = 1) =>
    api.get<Page<Booking>>("/bookings/history", {
      params: { page, pageSize: 20 },
    }),
  getSummary: () => api.get<BookingSummary>("/bookings/summary"),
  cancelBooking: (id: string) => api.post<Booking>(`/bookings/${id}/cancel`),
};
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post<User & { token: string }>("/auth/login", credentials),
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ message: string }>("/auth/register", data),
  me: () => api.get<User>("/auth/me"),
};
export default api;
