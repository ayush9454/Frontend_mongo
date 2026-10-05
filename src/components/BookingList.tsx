import React, { useState } from "react";
import { Container, Pagination, Stack, Typography } from "@mui/material";
import { useBookings } from "../hooks/useBookings";
import BookingCard from "./BookingCard";
import ResourceState from "./ResourceState";
const BookingList: React.FC<{
  mode: "all" | "current" | "history";
  title: string;
}> = ({ mode, title }) => {
  const [page, setPage] = useState(1),
    resource = useBookings(page, mode);
  const items = resource.data?.items || [];
  return (
    <Container sx={{ py: 4 }}>
      <Typography component="h1" variant="h4">
        {title}
      </Typography>
      <ResourceState
        loading={resource.loading}
        error={resource.error}
        retry={() => void resource.reload()}
        empty={!items.length}
      />
      <Stack spacing={2}>
        {items.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </Stack>
      {!!resource.data?.total && (
        <Pagination
          sx={{ mt: 3 }}
          page={page}
          count={Math.ceil(resource.data.total / resource.data.pageSize)}
          onChange={(_, next) => setPage(next)}
          aria-label="Booking pages"
        />
      )}
    </Container>
  );
};
export default BookingList;
