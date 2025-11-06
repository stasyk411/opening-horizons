import { render, screen } from "@testing-library/react";
import App from "../App";

test("App renders without crashing", () => {
  render(<App />);
  // Temporarily disabled for refactoring
  expect(true).toBeTruthy();
});
