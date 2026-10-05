import React from "react";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useBookingSummary } from "../hooks/useBookings";
import ResourceState from "../components/ResourceState";
import BookingList from "../components/BookingList";
import { currency } from "../utils/format";
export default function Dashboard() {
  const summary = useBookingSummary();
  const stats = [
    ["Active bookings", summary.data?.activeBookings || 0],
    ["Booked hours", (summary.data?.bookedHours || 0).toFixed(1)],
    ["Simulated spending", currency(summary.data?.spentPaise || 0)],
  ];
  return (
    <>
      <Container sx={{ pt: 4 }}>
        <Typography component="h1" variant="h4">
          Dashboard
        </Typography>
        <ResourceState
          loading={summary.loading}
          error={summary.error}
          retry={() => void summary.reload()}
        />
        <Grid container spacing={2}>
          {stats.map(([label, value]) => (
            <Grid item xs={12} sm={4} key={label}>
              <Paper sx={{ p: 3 }}>
                <Typography>{label}</Typography>
                <Typography variant="h5">{value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Button
          component={Link}
          to="/parking-lots"
          variant="contained"
          sx={{ mt: 3 }}
        >
          Find parking
        </Button>
      </Container>
      <BookingList mode="all" title="Recent bookings" />
    </>
  );
}
