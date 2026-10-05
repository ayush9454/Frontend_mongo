import React from "react";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
const ResourceState: React.FC<{
  loading: boolean;
  error: string;
  retry: () => void;
  empty?: boolean;
}> = ({ loading, error, retry, empty }) => (
  <Box role="status" sx={{ my: 2 }}>
    {loading && <CircularProgress size={24} aria-label="Loading data" />}
    {error && (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={retry}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    )}
    {!loading && !error && empty && (
      <Alert severity="info">No results yet.</Alert>
    )}
  </Box>
);
export default ResourceState;
