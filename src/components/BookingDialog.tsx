import React, { useRef, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import type { Booking, ParkingSpace, SpotType } from "../types";
import { SPOT_TYPES } from "../types";
import { parkingService, errorMessage, uncertainResult } from "../services/api";
import { currency } from "../utils/format";
const BookingDialog: React.FC<{
  lot: ParkingSpace;
  onClose: () => void;
  onBooked: (booking: Booking) => void;
}> = ({ lot, onClose, onBooked }) => {
  const [duration, setDuration] = useState(1),
    [spotType, setSpotType] = useState<SpotType>("normal"),
    [busy, setBusy] = useState(false),
    [uncertain, setUncertain] = useState(false),
    [error, setError] = useState("");
  const request = useRef<{ fingerprint: string; key: string } | null>(null),
    inFlight = useRef(false);
  const confirm = async () => {
    if (inFlight.current) return;
    if (!Number.isInteger(duration) || duration < 1 || duration > 24) {
      setError("Choose a whole number of hours between 1 and 24.");
      return;
    }
    const data = { parkingSpaceId: lot._id, spotType, durationHours: duration },
      fingerprint = JSON.stringify(data);
    if (!request.current || request.current.fingerprint !== fingerprint)
      request.current = {
        fingerprint,
        key: Array.from(crypto.getRandomValues(new Uint8Array(24)), (n) =>
          n.toString(16).padStart(2, "0"),
        ).join(""),
      };
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const response = await parkingService.createBooking(
        data,
        request.current.key,
      );
      setUncertain(false);
      onBooked(response.data);
    } catch (err) {
      const unknown = uncertainResult(err);
      setUncertain(unknown);
      setError(
        unknown
          ? "The result is uncertain. Retry these same details to recover your booking safely."
          : errorMessage(err, "Unable to book this spot."),
      );
      if (!unknown) request.current = null;
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  const multiplier =
    SPOT_TYPES.find((type) => type.value === spotType)?.multiplier || 1;
  const rate = Math.round(Math.round(lot.pricePerHour * 100) * multiplier);
  return (
    <Dialog
      open
      onClose={busy || uncertain ? undefined : onClose}
      aria-labelledby="booking-dialog-title"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="booking-dialog-title">Book {lot.name}</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          Demo payment only. No card details are collected and no money is
          charged.
        </Alert>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          select
          fullWidth
          label="Spot category"
          margin="normal"
          value={spotType}
          disabled={busy || uncertain}
          onChange={(event) => setSpotType(event.target.value as SpotType)}
        >
          {SPOT_TYPES.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Duration (hours)"
          type="number"
          margin="normal"
          value={duration}
          disabled={busy || uncertain}
          onChange={(event) => setDuration(Number(event.target.value))}
          inputProps={{ min: 1, max: 24, step: 1 }}
        />
        <Typography>
          Estimated total:{" "}
          {currency(rate * (Number.isFinite(duration) ? duration : 0))}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your booking starts now. The server assigns the spot and confirms the
          final price.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={busy || uncertain} onClick={onClose}>
          Close
        </Button>
        <Button
          variant="contained"
          disabled={busy}
          onClick={() => void confirm()}
        >
          {busy
            ? "Confirming…"
            : uncertain
              ? "Retry confirmation"
              : "Confirm demo booking"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default BookingDialog;
