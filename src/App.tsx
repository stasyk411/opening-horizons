import { Archetype } from "./shared/types/archetypes";
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
import { ArchetypeBadge } from "./features/archetype-planning/ui/ArchetypeBadge";

const Navigation = ({ currentScreen, onScreenChange }: any) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
    <div className="flex justify-around">
      {[
        { id: "balance", icon: "⚖️", label: "Баланс" },
        { id: "plans", icon: "🎯", label: "Планы" },
        { id: "tasks", icon: "✅", label: "Задачи" },
        { id: "analysis", icon: "📊", label: "Анализ" },
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

type AppScreen = "balance" | "plans" | "tasks" | "analysis" | "settings";

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("balance");
  const [selectedSphere, setSelectedSphere] = useState<LifeSphere | null>(null);
  const { spheres, updateSphereValue } = useBalanceWheel();
  const { goals, addGoal, toggleStep, deleteGoal } = useGoalsSystem();
  const [currentArchetype, setCurrentArchetype] = useState<Archetype | null>(
    null
  );

  // Единое состояние для всех задач
  const [allTasks, setAllTasks] = useState<Task[]>([]);

  const handleSphereSelect = (sphere: LifeSphere) => {
    setSelectedSphere(sphere);
    setCurrentScreen("plans");
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
      case "plans":
        return (
          <div className="space-y-6">
            <DayPlanner />
            <GoalsList
              goals={goals}
              onAddGoal={addGoal}
              onToggleStep={toggleStep}
              onDeleteGoal={deleteGoal}
            />
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
        {/* Шапка с архетипом */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Opening Horizons</h1>
          <ArchetypeBadge
            archetype={currentArchetype}
            onArchetypeChange={setCurrentArchetype}
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
