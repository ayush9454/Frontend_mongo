import React from "react";
import { Alert, Box, Button } from "@mui/material";
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("UI rendering failed", error);
  }
  render() {
    return this.state.failed ? (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">This page could not be displayed.</Alert>
        <Button onClick={() => window.location.reload()}>
          Reload application
        </Button>
      </Box>
    ) : (
      this.props.children
    );
  }
}
export default ErrorBoundary;
