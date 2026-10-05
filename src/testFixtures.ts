import type { Booking, User } from "./types";
export const testUser: User = {
  userId: "user-1",
  name: "Alice",
  email: "alice@example.com",
};
export const testBooking: Booking = {
  _id: "booking-1",
  userId: testUser.userId,
  parkingSpaceId: {
    _id: "lot-1",
    name: "Test lot",
    location: "Test road",
    capacity: 4,
    availableSpots: 3,
    pricePerHour: 50,
  },
  parkingId: "S0001",
  spotType: "normal",
  parkingLotName: "Test lot",
  startTime: "2026-01-01T10:00:00Z",
  endTime: "2026-01-01T11:00:00Z",
  status: "active",
  totalPrice: 50,
  pricing: {
    currency: "INR",
    baseRatePaise: 5000,
    ratePaise: 5000,
    multiplier: 1,
    durationHours: 1,
    amountPaise: 5000,
  },
  payment: { method: "simulated", status: "success" },
};
