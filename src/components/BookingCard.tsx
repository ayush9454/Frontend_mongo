import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import type { Booking } from "../types";
import { STATUS_LABELS } from "../types";
import { dateTime, currency, downloadTicket } from "../utils/format";
import { cancelBooking } from "../hooks/useBookings";
import { errorMessage } from "../services/api";
const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const cancel = async () => {
    setBusy(true);
    setError("");
    try {
      await cancelBooking(booking._id);
    } catch (err) {
      setError(errorMessage(err, "Cancellation failed. Please retry."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {booking.parkingSpaceId?.name || booking.parkingLotName}
        </Typography>
        <Typography color="text.secondary">
          {booking.parkingSpaceId?.location}
        </Typography>
        <Chip sx={{ my: 1 }} label={STATUS_LABELS[booking.status]} />
        <Typography>
          Spot: {booking.parkingId} ({booking.spotType})
        </Typography>
        <Typography>
          {dateTime(booking.startTime)} – {dateTime(booking.endTime)}
        </Typography>
        <Typography>
          Booked rate: {currency(booking.pricing.ratePaise)}/hr
        </Typography>
        <Typography>
          Total: {currency(booking.pricing.amountPaise)} · simulated payment
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button onClick={() => downloadTicket(booking)}>
            Download ticket
          </Button>
          {["active", "confirmed"].includes(booking.status) && (
            <Button color="error" disabled={busy} onClick={() => void cancel()}>
              {busy ? "Cancelling…" : "Cancel booking"}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
export default BookingCard;
