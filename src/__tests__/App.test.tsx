// src/__tests__/App.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

// Mock для всех зависимостей
jest.mock("../shared/contexts/SettingsContext", () => ({
  useSettings: () => ({
    settings: { darkTheme: false },
    updateSettings: jest.fn(),
  }),
  SettingsProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("../components/System/EmergencyErrorBoundary", () => ({
  EmergencyErrorBoundary: ({ children }: { children: React.ReactNode }) =>
    children,
}));

jest.mock("../components/System/FeatureErrorBoundary", () => ({
  FeatureErrorBoundary: ({
    children,
    featureName,
  }: {
    children: React.ReactNode;
    featureName: string;
  }) => <div data-testid={`error-boundary-${featureName}`}>{children}</div>,
}));

// Mock для lazy components
const mockPlanningTab = () => (
  <div data-testid="planning-tab">Planning Tab</div>
);
const mockGoalsTab = () => <div data-testid="goals-tab">Goals Tab</div>;
const mockReflectionTab = () => (
  <div data-testid="reflection-tab">Reflection Tab</div>
);
const mockEnhancedPomodoro = () => (
  <div data-testid="pomodoro-tab">Pomodoro Tab</div>
);
const mockSettingsTab = () => (
  <div data-testid="settings-tab">Settings Tab</div>
);

jest.mock("../features/daily-planning/ui/PlanningTab", () => ({
  PlanningTab: mockPlanningTab,
}));

jest.mock("../features/goals-system/ui/GoalsTab", () => ({
  GoalsTab: mockGoalsTab,
}));

jest.mock("../features/archetype-planning/ui/ReflectionTab", () => ({
  ReflectionTab: mockReflectionTab,
}));

jest.mock("../features/pomodoro-enhanced/ui/EnhancedPomodoro", () => ({
  EnhancedPomodoro: mockEnhancedPomodoro,
}));

jest.mock("../features/settings/ui/SettingsTab", () => ({
  SettingsTab: mockSettingsTab,
}));

// Типы для моков
interface MockLocalStorage {
  getItem: jest.Mock<string | null, [string]>;
  setItem: jest.Mock<void, [string, string]>;
  removeItem: jest.Mock<void, [string]>;
  clear: jest.Mock<void, []>;
}

interface MockBeforeInstallPromptEvent extends Event {
  preventDefault: jest.Mock;
  prompt: jest.Mock;
  userChoice: Promise<{ outcome: string }>;
}

// Mock для window.unifiedDataManager
const mockUnifiedDataManager = {
  dataHandlers: new Map(),
  queueSync: jest.fn(),
};

// Mock для environment variables
const originalEnv = process.env;

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
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

  // Mock localStorage с правильной типизацией
  const localStorageMock: MockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, "localStorage", { value: localStorageMock });

  // Mock для window.unifiedDataManager - только если не определен
  if (!window.unifiedDataManager) {
    Object.defineProperty(window, "unifiedDataManager", {
      value: mockUnifiedDataManager,
    });
  }
});

afterAll(() => {
  process.env = originalEnv;
});

describe("App", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    (window.localStorage.getItem as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === "life-wheel-tasks") return "[]";
        if (key === "life-wheel-goals") return "[]";
        if (key === "life-wheel-reflections") return "[]";
        return null;
      }
    );
  });

  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("🎯 Opening Horizons")).toBeInTheDocument();
  });

  it("displays all navigation tabs", () => {
    render(<App />);

    expect(screen.getByText("📅 Планирование Дня")).toBeInTheDocument();
    expect(screen.getByText("🎯 Цели")).toBeInTheDocument();
    expect(screen.getByText("🌙 Вечерний Анализ")).toBeInTheDocument();
    expect(screen.getByText("🍅 Pomodoro")).toBeInTheDocument();
    expect(screen.getByText("⚙️ Настройки")).toBeInTheDocument();
  });

  it("shows planning tab by default", () => {
    render(<App />);
    expect(screen.getByTestId("planning-tab")).toBeInTheDocument();
  });

  it("switches between tabs correctly", async () => {
    render(<App />);

    // Click on Goals tab
    fireEvent.click(screen.getByText("🎯 Цели"));
    await waitFor(() => {
      expect(screen.getByTestId("goals-tab")).toBeInTheDocument();
    });

    // Click on Pomodoro tab
    fireEvent.click(screen.getByText("🍅 Pomodoro"));
    await waitFor(() => {
      expect(screen.getByTestId("pomodoro-tab")).toBeInTheDocument();
    });

    // Click on Settings tab
    fireEvent.click(screen.getByText("⚙️ Настройки"));
    await waitFor(() => {
      expect(screen.getByTestId("settings-tab")).toBeInTheDocument();
    });
  });

  it("handles mobile layout correctly", () => {
    // Mock mobile viewport
    window.innerWidth = 375;
    window.innerHeight = 667;

    render(<App />);

    // Should render with mobile-optimized layout
    const header = screen.getByText("🎯 Opening Horizons");
    expect(header).toBeInTheDocument();
  });

  it("loads data from localStorage on mount", () => {
    const mockTasks = [{ id: "1", title: "Test Task", completed: false }];
    (window.localStorage.getItem as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === "life-wheel-tasks") return JSON.stringify(mockTasks);
        return "[]";
      }
    );

    render(<App />);

    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "life-wheel-tasks"
    );
    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "life-wheel-goals"
    );
    expect(window.localStorage.getItem).toHaveBeenCalledWith(
      "life-wheel-reflections"
    );
  });

  it("handles PWA install prompt", async () => {
    // Mock beforeinstallprompt event
    const mockEvent: Partial<MockBeforeInstallPromptEvent> = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: "accepted" }),
    };

    render(<App />);

    // Simulate PWA install prompt - создаем кастомное событие
    const event = new Event("beforeinstallprompt");
    Object.assign(event, mockEvent);

    window.dispatchEvent(event);

    // Should show install button
    await waitFor(() => {
      expect(screen.getByText("📱 Установить App")).toBeInTheDocument();
    });
  });

  it("handles window resize events", () => {
    render(<App />);

    // Trigger resize
    window.innerWidth = 500;
    fireEvent(window, new Event("resize"));

    // App should handle resize without crashing
    expect(screen.getByText("🎯 Opening Horizons")).toBeInTheDocument();
  });

  it("renders error boundaries for all features", () => {
    render(<App />);

    expect(
      screen.getByTestId("error-boundary-Планирование дня")
    ).toBeInTheDocument();

    // Switch to other tabs to trigger their error boundaries
    fireEvent.click(screen.getByText("🎯 Цели"));
    expect(
      screen.getByTestId("error-boundary-Система целей")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("🍅 Pomodoro"));
    expect(
      screen.getByTestId("error-boundary-Pomodoro таймер")
    ).toBeInTheDocument();
  });
});

describe("App Architecture Switching", () => {
  beforeEach(() => {
    // Mock data handlers for different architectures
    const mockDataHandler = {
      loadTasks: jest.fn().mockResolvedValue([]),
      saveTasks: jest.fn().mockResolvedValue(undefined),
    };

    (window as any).unifiedDataManager.dataHandlers.set(
      "feature",
      mockDataHandler
    );
    (window as any).unifiedDataManager.dataHandlers.set(
      "minimalist",
      mockDataHandler
    );
    (window as any).unifiedDataManager.dataHandlers.set(
      "react",
      mockDataHandler
    );
  });

  it("handles architecture change via keyboard shortcuts", async () => {
    render(<App />);

    // Simulate Ctrl+F2 for minimalist architecture
    fireEvent.keyDown(window, { ctrlKey: true, key: "F2" });

    // Should switch to minimalist architecture
    await waitFor(() => {
      expect((window as any).unifiedDataManager.queueSync).toHaveBeenCalled();
    });
  });
});

describe("App Data Management", () => {
  it("handles data synchronization events", async () => {
    render(<App />);

    // Simulate sync completed event
    fireEvent(document, new CustomEvent("syncCompleted"));

    // Should trigger data reload
    await waitFor(() => {
      expect(document.dispatchEvent).toHaveBeenCalled();
    });
  });

  it("handles data changed events", async () => {
    render(<App />);

    // Simulate data changed event
    fireEvent(document, new CustomEvent("dataChanged"));

    // Should trigger data reload
    await waitFor(() => {
      expect(document.dispatchEvent).toHaveBeenCalled();
    });
  });
});
