import React from "react";
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Booking } from "../types";
import { currency, dateTime, downloadTicket } from "../utils/format";
const BookingConfirmation: React.FC<{
  bookingDetails: Booking;
  refreshError?: string;
}> = ({ bookingDetails: booking, refreshError }) => (
  <Container maxWidth="sm" sx={{ py: 6 }}>
    <Paper sx={{ p: 4 }}>
      <Typography component="h1" variant="h4">
        Booking confirmed!
      </Typography>
      <Alert severity="info" sx={{ my: 2 }}>
        Payment is simulated. No money was charged.
      </Alert>
      {refreshError && (
        <Alert severity="warning">Your booking succeeded. {refreshError}</Alert>
      )}
      <Typography>Booking ID: {booking._id}</Typography>
      <Typography variant="h6">
        {booking.parkingSpaceId?.name || booking.parkingLotName}
      </Typography>
      <Typography>{booking.parkingSpaceId?.location}</Typography>
      <Typography>Spot: {booking.parkingId}</Typography>
      <Typography>
        {dateTime(booking.startTime)} – {dateTime(booking.endTime)}
      </Typography>
      <Typography>Total: {currency(booking.pricing.amountPaise)}</Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button component={Link} to="/bookings">
          My bookings
        </Button>
        <Button variant="contained" onClick={() => downloadTicket(booking)}>
          Download ticket
        </Button>
      </Stack>
    </Paper>
  </Container>
);
export default BookingConfirmation;
