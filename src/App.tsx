import { Archetype } from "./shared/types/archetypes";
import { RestCove } from "./features/rest-cove";
import { NotificationsSettings } from "./features/notifications";
import { StatsDashboard } from "./features/statistics";
import { LifeSphere, Task } from "./shared/types";
import { BalanceWheel, useBalanceWheel } from "./features/balance-wheel";
import { DailyPlanning } from "./features/daily-planning";
import { TodayTasks } from "./features/today-tasks";
import { DayPlanner } from "./features/archetype-planning";
import { GoalsList, useGoalsSystem } from "./features/goals-system";
import { ArchetypeBadge } from "./features/archetype-planning/ui/ArchetypeBadge";
import { ArchetypeSelector } from "./features/archetype-planning/ui/ArchetypeSelector";
import { WelcomeMessage } from "./components/WelcomeMessage";
import { PomodoroTimer } from "./features/pomodoro-timer/ui/PomodoroTimer";
import { useState, useEffect } from "react";
import { useServiceWorker } from "./hooks/useServiceWorker"; // ← ДОБАВЛЕНО

// Хук для работы с сохранением архетипа
const useArchetypeStorage = () => {
  const [archetype, setArchetype] = useState<Archetype | null>(null);

  // Загружаем из localStorage при монтировании компонента
  useEffect(() => {
    const savedArchetype = localStorage.getItem(
      "currentArchetype"
    ) as Archetype;
    if (savedArchetype && ["fox", "dolphin", "owl"].includes(savedArchetype)) {
      setArchetype(savedArchetype);
    }
  }, []);

  // Функция для сохранения архетипа
  const saveArchetype = (newArchetype: Archetype) => {
    setArchetype(newArchetype);
    localStorage.setItem("currentArchetype", newArchetype);
  };

  // Функция для сброса архетипа
  const clearArchetype = () => {
    setArchetype(null);
    localStorage.removeItem("currentArchetype");
  };

  return {
    archetype,
    saveArchetype,
    clearArchetype,
  };
};

const Navigation = ({ currentScreen, onScreenChange }: any) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 safe-area-inset-bottom">
    <div className="flex justify-around">
      {[
        { id: "balance", icon: "⚖️", label: "Баланс" },
        { id: "plans", icon: "🎯", label: "Планы" },
        { id: "tasks", icon: "✅", label: "Задачи" },
        { id: "analysis", icon: "📊", label: "Анализ" },
        { id: "pomodoro", icon: "🍅", label: "Таймер" },
        { id: "settings", icon: "⚙️", label: "Настройки" },
      ].map((screen) => (
        <button
          key={screen.id}
          onClick={() => onScreenChange(screen.id)}
          className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[60px] transition-colors ${
            currentScreen === screen.id
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:text-blue-500"
          }`}
        >
          <div className="text-lg mb-1">{screen.icon}</div>
          <div className="text-xs font-medium">{screen.label}</div>
        </button>
      ))}
    </div>
  </nav>
);

type AppScreen =
  | "balance"
  | "plans"
  | "tasks"
  | "analysis"
  | "pomodoro"
  | "settings";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("balance");
  const [selectedSphere, setSelectedSphere] = useState<LifeSphere | null>(null);
  const { spheres, updateSphereValue } = useBalanceWheel();
  const { goals, addGoal, toggleStep, deleteGoal } = useGoalsSystem();

  // ДОБАВЛЕНО: Регистрация Service Worker
  const swStatus = useServiceWorker();

  // ДОБАВЛЕНО: Индикатор статуса Service Worker (только для разработки)
  const getSwStatusMessage = () => {
    switch (swStatus) {
      case "loading":
        return "🔄 Загрузка...";
      case "registered":
        return "✅ Оффлайн режим";
      case "error":
        return "⚠️ Ошибка SW";
      case "unsupported":
        return "ℹ️ Только онлайн";
      default:
        return "";
    }
  };

  const [showWelcome, setShowWelcome] = useState(true);

  // Показываем приветствие только при первом посещении
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeDismiss = () => {
    setShowWelcome(false);
    localStorage.setItem("hasSeenWelcome", "true");
  };

  // Используем наш хук для архетипа
  const {
    archetype: currentArchetype,
    saveArchetype,
    clearArchetype,
  } = useArchetypeStorage();

  // Единое состояние для всех задач
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  // ПЕРВОЕ что проверяем - приветствие
  if (showWelcome) {
    return <WelcomeMessage onDismiss={handleWelcomeDismiss} />;
  }

  // ВТОРОЕ что проверяем - архетип
  if (!currentArchetype) {
    return <ArchetypeSelector onArchetypeSelect={saveArchetype} />;
  }

  const handleSphereSelect = (sphere: LifeSphere) => {
    setSelectedSphere(sphere);
    setCurrentScreen("plans");
  };

  const handleAddTask = (task: Task) => {
    setAllTasks((prev) => [...prev, task]);
  };

  const handleToggleTask = (taskId: string) => {
    setAllTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setAllTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "balance":
        return (
          <BalanceWheel
            spheres={spheres}
            onSphereChange={updateSphereValue}
            onSphereSelect={handleSphereSelect}
          />
        );
      case "plans":
        return (
          <div className="space-y-6">
            <DayPlanner currentArchetype={currentArchetype} />
            {selectedSphere && (
              <DailyPlanning
                selectedSphere={selectedSphere}
                tasks={allTasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        );
      case "tasks":
        return (
          <TodayTasks
            tasks={allTasks}
            spheres={spheres}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case "analysis":
        return (
          <div className="space-y-6">
            <StatsDashboard tasks={allTasks} spheres={spheres} />
            <RestCove tasks={allTasks} spheres={spheres} />
          </div>
        );
      case "pomodoro":
        return (
          <div className="flex justify-center">
            <PomodoroTimer />
          </div>
        );
      case "settings":
        return <NotificationsSettings />;
      default:
        return (
          <BalanceWheel
            spheres={spheres}
            onSphereChange={updateSphereValue}
            onSphereSelect={handleSphereSelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 safe-area-inset">
      <main className="container mx-auto px-4 py-8 pb-24">
        {" "}
        {/* Увеличил padding-bottom для навигации */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Opening Horizons
            </h1>
            {/* ДОБАВЛЕНО: Индикатор статуса Service Worker */}
            {process.env.NODE_ENV === "development" && (
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {getSwStatusMessage()}
              </span>
            )}
          </div>
          <ArchetypeBadge
            archetype={currentArchetype}
            onArchetypeChange={clearArchetype}
          />
        </div>
        {renderScreen()}
      </main>
      <Navigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />
    </div>
  );
}

export default App;
