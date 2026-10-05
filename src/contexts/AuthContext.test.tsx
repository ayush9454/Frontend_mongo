import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { authService, onSessionExpired } from "../services/api";
import { testUser } from "../testFixtures";
jest.mock("../services/api", () => ({
  authService: { me: jest.fn() },
  onSessionExpired: jest.fn(),
  errorMessage: () => "Unable to verify session",
}));
const me = authService.me as jest.Mock;
let expire: () => void;
function Probe() {
  const { user, loading, login, logout, sessionError } = useAuth();
  return (
    <>
      <div>{loading ? "loading" : user?.email || "signed out"}</div>
      <div>{sessionError}</div>
      <button onClick={() => login(testUser, "token")}>Login</button>
      <button onClick={logout}>Logout</button>
    </>
  );
}
beforeEach(() => {
  localStorage.clear();
  me.mockReset();
  (onSessionExpired as jest.Mock).mockImplementation((callback) => {
    expire = callback;
    return () => {};
  });
});
test("does not trust a stored user without a token", async () => {
  localStorage.setItem("user", JSON.stringify(testUser));
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
  expect(await screen.findByText("signed out")).toBeInTheDocument();
  expect(me).not.toHaveBeenCalled();
});
test("verifies the token before restoring the session", async () => {
  localStorage.setItem("token", "token");
  me.mockResolvedValue({ data: testUser });
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
  expect(await screen.findByText(testUser.email)).toBeInTheDocument();
  expect(me).toHaveBeenCalledTimes(1);
});
test("clears session on logout and on an expired token", async () => {
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
  fireEvent.click(screen.getByText("Login"));
  expect(localStorage.getItem("token")).toBe("token");
  act(() => expire());
  expect(screen.getByText("signed out")).toBeInTheDocument();
  expect(localStorage.getItem("token")).toBeNull();
  fireEvent.click(screen.getByText("Login"));
  fireEvent.click(screen.getByText("Logout"));
  expect(localStorage.getItem("user")).toBeNull();
});
test("shows session network failures instead of trusting cached user data", async () => {
  localStorage.setItem("token", "token");
  me.mockRejectedValue(new Error("network"));
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
  expect(
    await screen.findByText("Unable to verify session"),
  ).toBeInTheDocument();
});
