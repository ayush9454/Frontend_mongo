import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { authService, errorMessage } from "../services/api";
export default function Login() {
  const { user, login } = useAuth(),
    navigate = useNavigate(),
    location = useLocation();
  const destination =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || "/dashboard";
  const from =
    destination.startsWith("/") &&
    !destination.startsWith("//") &&
    !destination.includes("\\") &&
    !["/login", "/register"].includes(destination)
      ? destination
      : "/dashboard";
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await authService.login({ email, password });
      login(
        { userId: data.userId, name: data.name, email: data.email },
        data.token,
      );
      navigate(from, { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Login failed. Please retry."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Typography component="h1" variant="h4">
        Sign in
      </Typography>
      <Box component="form" onSubmit={submit}>
        {error && <Alert severity="error">{error}</Alert>}
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
          type={show ? "text" : "password"}
          autoComplete="current-password"
          margin="normal"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow(!show)}
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={busy}
          sx={{ my: 2 }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </Button>
        <Button component={Link} to="/register">
          Create account
        </Button>
      </Box>
    </Container>
  );
}
