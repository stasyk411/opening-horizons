import { render, screen } from "@testing-library/react";
import App from "../App.tsx";

test("App renders without crashing", () => {
  render(<App />);
  const lifeWheelElement = screen.getByText(/Колесо Жизни|Life Wheel/i);
  expect(lifeWheelElement).toBeTruthy();
});
