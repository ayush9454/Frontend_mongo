import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookingConfirmation from "./BookingConfirmation";
import BookingDialog from "./BookingDialog";
import BookingCard from "./BookingCard";
import BookingList from "./BookingList";
import { AuthProvider } from "../contexts/AuthContext";
import { parkingService } from "../services/api";
import { ticketText } from "../utils/format";
import { testBooking } from "../testFixtures";
jest.mock("../services/api", () => ({
  parkingService: {
    createBooking: jest.fn(),
    cancelBooking: jest.fn(),
    getBookings: jest.fn(),
    getBookingHistory: jest.fn(),
  },
  authService: { me: jest.fn() },
  onSessionExpired: () => () => {},
  errorMessage: () => "Request failed; retry",
  uncertainResult: () => true,
}));
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
test("confirmation uses returned spot and pricing without a fake QR code", () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <BookingConfirmation bookingDetails={testBooking} />
    </MemoryRouter>,
  );
  expect(screen.getByText("Spot: S0001")).toBeInTheDocument();
  expect(screen.getByText(/No money was charged/)).toBeInTheDocument();
  expect(ticketText(testBooking)).toContain("Spot Number: S0001");
  expect(ticketText(testBooking)).toContain("Test road");
});
test("retries uncertain booking results using the same idempotency key", async () => {
  const create = parkingService.createBooking as jest.Mock;
  create
    .mockRejectedValueOnce(new Error("network"))
    .mockResolvedValueOnce({ data: testBooking });
  const onBooked = jest.fn();
  render(
    <BookingDialog
      lot={testBooking.parkingSpaceId!}
      onClose={() => {}}
      onBooked={onBooked}
    />,
  );
  fireEvent.click(screen.getByText("Confirm demo booking"));
  await screen.findByText(/result is uncertain/);
  fireEvent.click(screen.getByText("Retry confirmation"));
  await waitFor(() => expect(onBooked).toHaveBeenCalledWith(testBooking));
  expect(create.mock.calls[0][1]).toBe(create.mock.calls[1][1]);
  expect(create.mock.calls[0][0]).toEqual({
    parkingSpaceId: "lot-1",
    spotType: "normal",
    durationHours: 1,
  });
});
test("cancellation goes to the API and errors are visible", async () => {
  (parkingService.cancelBooking as jest.Mock).mockRejectedValue(
    new Error("network"),
  );
  render(<BookingCard booking={testBooking} />);
  fireEvent.click(screen.getByText("Cancel booking"));
  expect(await screen.findByText("Request failed; retry")).toBeInTheDocument();
  expect(parkingService.cancelBooking).toHaveBeenCalledWith(testBooking._id);
});
test("successful cancellation disappears from the list and stays cancelled after remount", async () => {
  const get = parkingService.getBookings as jest.Mock;
  get
    .mockResolvedValueOnce({
      data: { items: [testBooking], page: 1, pageSize: 20, total: 1 },
    })
    .mockResolvedValue({
      data: { items: [], page: 1, pageSize: 20, total: 0 },
    });
  (parkingService.cancelBooking as jest.Mock).mockResolvedValue({
    data: { ...testBooking, status: "cancelled" },
  });
  const view = render(
    <AuthProvider>
      <BookingList mode="current" title="Bookings" />
    </AuthProvider>,
  );
  await screen.findByText("Spot: S0001 (normal)");
  fireEvent.click(screen.getByText("Cancel booking"));
  await waitFor(() =>
    expect(screen.queryByText("Cancel booking")).not.toBeInTheDocument(),
  );
  view.unmount();
  render(
    <AuthProvider>
      <BookingList mode="current" title="Bookings" />
    </AuthProvider>,
  );
  expect(await screen.findByText("No results yet.")).toBeInTheDocument();
  expect(screen.queryByText("Cancel booking")).not.toBeInTheDocument();
});
