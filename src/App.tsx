import { RestCove } from "./features/rest-cove";
import { NotificationsSettings } from "./features/notifications";
import { StatsDashboard } from "./features/statistics";
import { useState } from "react";
import { LifeSphere, Task } from "./shared/types";
import { BalanceWheel, useBalanceWheel } from "./features/balance-wheel";
import { DailyPlanning } from "./features/daily-planning";
import { TodayTasks } from "./features/today-tasks";
import { DayPlanner } from "./features/archetype-planning";
import { GoalsList, useGoalsSystem } from "./features/goals-system";

const Navigation = ({ currentScreen, onScreenChange }: any) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
    <div className="flex justify-around">
      {[
        { id: "balance", icon: "⚖️", label: "Баланс" },
        { id: "archetypes", icon: "🦊", label: "Архетипы" },
        { id: "goals", icon: "🎯", label: "Цели" },
        { id: "planning", icon: "📅", label: "Планы" },
        { id: "tasks", icon: "✅", label: "Задачи" },
        { id: "review", icon: "📊", label: "Обзор" },
        { id: "rest", icon: "🌴", label: "Отдых" },
        { id: "settings", icon: "⚙️", label: "Настройки" },
      ].map((screen) => (
        <button
          key={screen.id}
          onClick={() => onScreenChange(screen.id)}
          className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[60px] ${
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
  | "archetypes"
  | "goals"
  | "planning"
  | "tasks"
  | "review"
  | "rest"
  | "settings";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("balance");
  const [selectedSphere, setSelectedSphere] = useState<LifeSphere | null>(null);
  const { spheres, updateSphereValue } = useBalanceWheel();
  const { goals, addGoal, toggleStep, deleteGoal } = useGoalsSystem();

  // Единое состояние для всех задач
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const handleSphereSelect = (sphere: LifeSphere) => {
    setSelectedSphere(sphere);
    setCurrentScreen("planning");
  };

  // Функции для управления задачами
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
      case "archetypes":
        return <DayPlanner />;
      case "goals":
        return (
          <GoalsList
            goals={goals}
            onAddGoal={addGoal}
            onToggleStep={toggleStep}
            onDeleteGoal={deleteGoal}
          />
        );
      case "planning":
        return selectedSphere ? (
          <DailyPlanning
            selectedSphere={selectedSphere}
            tasks={allTasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <div className="text-center p-8">
            <p>Пожалуйста, выберите сферу жизни сначала</p>
            <button
              onClick={() => setCurrentScreen("balance")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Вернуться к колесу баланса
            </button>
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
      case "review":
        return <StatsDashboard tasks={allTasks} spheres={spheres} />;
      case "rest":
        return <RestCove tasks={allTasks} spheres={spheres} />;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="container mx-auto px-4 py-8 pb-20">
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
