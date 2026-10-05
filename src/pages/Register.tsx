import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService, errorMessage } from "../services/api";
export default function Register() {
  const { user } = useAuth(),
    navigate = useNavigate();
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false);
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await authService.register({ name, email, password });
      setSuccess(true);
    } catch (err) {
      setError(errorMessage(err, "Registration failed. Please retry."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Typography component="h1" variant="h4">
        Create account
      </Typography>
      {success ? (
        <>
          <Alert severity="success" sx={{ my: 2 }}>
            Registration successful. Please sign in.
          </Alert>
          <Button component={Link} to="/login">
            Sign in
          </Button>
        </>
      ) : (
        <Box component="form" onSubmit={submit}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            fullWidth
            required
            label="Name"
            autoComplete="name"
            margin="normal"
            value={name}
            onChange={(event) => setName(event.target.value)}
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            required
            label="Email"
            type="email"
            autoComplete="email"
            margin="normal"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            fullWidth
            required
            label="Password"
            type="password"
            autoComplete="new-password"
            margin="normal"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            helperText="At least 8 characters; maximum 72 UTF-8 bytes"
            inputProps={{ minLength: 8, maxLength: 72 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={busy}
            sx={{ my: 2 }}
          >
            {busy ? "Creating account…" : "Create account"}
          </Button>
          <Button component={Link} to="/login">
            Sign in
          </Button>
        </Box>
      )}
    </Container>
  );
}
