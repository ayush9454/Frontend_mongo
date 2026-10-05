import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
test("renders the parking application home page", () => {
  localStorage.clear();
  render(<App />);
  expect(screen.getAllByText(/smart parking/i).length).toBeGreaterThan(0);
});
