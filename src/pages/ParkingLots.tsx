import React, { useCallback, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import type { Booking, ParkingSpace } from "../types";
import { parkingService } from "../services/api";
import { useResource, invalidateResources } from "../hooks/useResource";
import ResourceState from "../components/ResourceState";
import BookingDialog from "../components/BookingDialog";
import BookingConfirmation from "../components/BookingConfirmation";
import { currency } from "../utils/format";
export default function ParkingLots() {
  const resource = useResource(
    useCallback(async () => (await parkingService.getParkingSpaces()).data, []),
  );
  const [query, setQuery] = useState(""),
    [selected, setSelected] = useState<ParkingSpace | null>(null),
    [confirmed, setConfirmed] = useState<Booking | null>(null);
  if (confirmed)
    return (
      <BookingConfirmation
        bookingDetails={confirmed}
        refreshError={resource.error}
      />
    );
  const lots = (resource.data || []).filter((lot) =>
    `${lot.name} ${lot.location}`.toLowerCase().includes(query.toLowerCase()),
  );
  const booked = (booking: Booking) => {
    setConfirmed(booking);
    setSelected(null);
    invalidateResources();
  };
  return (
    <Container sx={{ py: 4 }}>
      <Typography component="h1" variant="h4">
        Find parking
      </Typography>
      <Typography color="text.secondary" sx={{ my: 1 }}>
        Availability refreshes every minute and when you return to this window.
      </Typography>
      <TextField
        fullWidth
        label="Search by name or location"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        sx={{ my: 2 }}
      />
      <ResourceState
        loading={resource.loading}
        error={resource.error}
        retry={() => void resource.reload()}
        empty={!lots.length}
      />
      <Grid container spacing={2}>
        {lots.map((lot) => (
          <Grid item xs={12} sm={6} md={4} key={lot._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{lot.name}</Typography>
                <Typography color="text.secondary">{lot.location}</Typography>
                <Typography sx={{ my: 1 }}>
                  {lot.availableSpots} / {lot.capacity} spots available
                </Typography>
                <Typography>
                  {currency(Math.round(lot.pricePerHour * 100))}/hr
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={lot.availableSpots <= 0 || lot.allocationBlocked}
                  onClick={() => setSelected(lot)}
                >
                  {lot.allocationBlocked
                    ? "Unavailable for booking"
                    : "Book now"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selected && (
        <BookingDialog
          lot={selected}
          onClose={() => setSelected(null)}
          onBooked={booked}
        />
      )}
    </Container>
  );
}
