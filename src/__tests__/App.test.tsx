// src/__tests__/App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "../App";

// Простые моки без сложной логики
jest.mock("../shared/contexts/SettingsContext", () => ({
  useSettings: () => ({
    settings: { darkTheme: false },
    updateSettings: jest.fn(),
  }),
  SettingsProvider: ({ children }) => children,
}));

jest.mock("../components/System/EmergencyErrorBoundary", () => ({
  EmergencyErrorBoundary: ({ children }) => children,
}));

jest.mock("../components/System/FeatureErrorBoundary", () => ({
  FeatureErrorBoundary: ({ children, featureName }) => (
    <div data-testid={`error-boundary-${featureName}`}>{children}</div>
  ),
}));

// Простые моки для ленивых компонентов
jest.mock("../features/daily-planning/ui/PlanningTab", () => ({
  PlanningTab: () => <div data-testid="planning-tab">Planning Tab</div>,
}));

jest.mock("../features/goals-system/ui/GoalsTab", () => ({
  GoalsTab: () => <div data-testid="goals-tab">Goals Tab</div>,
}));

jest.mock("../features/archetype-planning/ui/ReflectionTab", () => ({
  ReflectionTab: () => <div data-testid="reflection-tab">Reflection Tab</div>,
}));

jest.mock("../features/pomodoro-enhanced/ui/EnhancedPomodoro", () => ({
  EnhancedPomodoro: () => <div data-testid="pomodoro-tab">Pomodoro Tab</div>,
}));

jest.mock("../features/settings/ui/SettingsTab", () => ({
  SettingsTab: () => <div data-testid="settings-tab">Settings Tab</div>,
}));

// Базовый setup
beforeAll(() => {
  // Mock для matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock для localStorage
  const localStorageMock = {
    getItem: jest.fn(() => "[]"),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, "localStorage", { value: localStorageMock });

  // Mock для unifiedDataManager - создаем только если не существует
  if (!window.unifiedDataManager) {
    window.unifiedDataManager = {
      dataHandlers: new Map(),
      queueSync: jest.fn(),
      getHandler: jest.fn(),
    };
  }
});

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Сбрасываем localStorage mock
    window.localStorage.getItem.mockImplementation((key) => {
      if (key.includes("life-wheel")) return "[]";
      return null;
    });
  });

  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("🎯 Opening Horizons")).toBeInTheDocument();
  });

  it("displays architecture indicator", () => {
    render(<App />);
    // Используем regex для поиска текста, так как он разделен эмодзи
    expect(screen.getByText(/Opening Horizons/i)).toBeInTheDocument();
  });

  it("shows planning tab by default", () => {
    render(<App />);
    expect(screen.getByTestId("planning-tab")).toBeInTheDocument();
  });
});
