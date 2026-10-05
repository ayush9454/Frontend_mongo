import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography component="h1" variant="h4">
        Page not found
      </Typography>
      <Button component={Link} to="/">
        Go home
      </Button>
    </Container>
  );
}
