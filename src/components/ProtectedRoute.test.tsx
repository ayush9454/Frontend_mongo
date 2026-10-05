import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { authService } from "../services/api";
import { testUser } from "../testFixtures";
import ProtectedRoute from "./ProtectedRoute";
jest.mock("../services/api", () => ({
  authService: { me: jest.fn() },
  onSessionExpired: () => () => {},
  errorMessage: () => "Session failed",
}));
function renderRoute() {
  render(
    <AuthProvider>
      <MemoryRouter
        initialEntries={["/dashboard"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute>Protected content</ProtectedRoute>}
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}
beforeEach(() => {
  localStorage.clear();
  (authService.me as jest.Mock).mockReset();
});
test("redirects when no token exists", async () => {
  renderRoute();
  expect(await screen.findByText("Login page")).toBeInTheDocument();
});
test("waits for the server to verify a restored session", async () => {
  localStorage.setItem("token", "token");
  (authService.me as jest.Mock).mockResolvedValue({ data: testUser });
  renderRoute();
  expect(await screen.findByText("Protected content")).toBeInTheDocument();
});
