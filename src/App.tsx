import React, { useState, useEffect } from "react";
import { EmergencyErrorBoundary } from "./components/System/EmergencyErrorBoundary";
import { Task, Goal, GoalStep, Reflection, Settings } from './types';
import { PlanningTab } from './features/daily-planning';
import { GoalsTab } from './features/goals-system';
import { ReflectionTab } from './features/archetype-planning';
import { PomodoroTimer } from './features/pomodoro-timer';
import { SettingsTab } from './features/settings';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<
    "planning" | "goals" | "reflection" | "settings"
  >("planning");
  const [isMobile, setIsMobile] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [settings, setSettings] = useState<Settings>({
    archetype: "warrior",
    darkTheme: false,
    notifications: true,
    autoSave: true,
    colorScheme: "purple"
  });

  // Сохранение в localStorage
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("life-wheel-tasks", JSON.stringify(newTasks));
  };

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem("life-wheel-goals", JSON.stringify(newGoals));
  };

  const saveReflections = (newReflections: Reflection[]) => {
    setReflections(newReflections);
    localStorage.setItem("life-wheel-reflections", JSON.stringify(newReflections));
  };

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("life-wheel-settings", JSON.stringify(newSettings));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Загрузка данных
    const savedTasks = localStorage.getItem("life-wheel-tasks");
    const savedGoals = localStorage.getItem("life-wheel-goals");
    const savedReflections = localStorage.getItem("life-wheel-reflections");
    const savedSettings = localStorage.getItem("life-wheel-settings");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedReflections) setReflections(JSON.parse(savedReflections));
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabStyle = (isActive: boolean) => ({
    padding: isMobile ? "10px 15px" : "12px 20px",
    background: isActive ? "#8A2BE2" : "transparent",
    color: isActive ? "white" : settings.darkTheme ? "#ccc" : "#666",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: isMobile ? "14px" : "16px",
    margin: "0 2px",
    transition: "all 0.3s ease"
  });

  return (
    <EmergencyErrorBoundary>
      <div style={{ 
        background: settings.darkTheme ? '#1a1a1a' : '#f5f5f5',
        minHeight: '100vh',
        color: settings.darkTheme ? 'white' : 'black'
      }}>
        <header style={{ 
          background: '#8A2BE2', 
          color: 'white', 
          padding: isMobile ? '10px 15px' : '15px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: isMobile ? '1.5em' : '2em' }}>
            🎯 Opening Horizons
          </h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
            Персональная система продуктивности
          </p>
        </header>

        {/* Навигация */}
        <nav style={{
          background: settings.darkTheme ? '#2a2a2a' : 'white',
          padding: isMobile ? '10px' : '15px 20px',
          borderBottom: settings.darkTheme ? '1px solid #444' : '1px solid #eee',
          display: 'flex',
          overflowX: 'auto',
          gap: '5px'
        }}>
          <button 
            onClick={() => setCurrentTab("planning")}
            style={tabStyle(currentTab === "planning")}
          >
            🗓️ Планирование
          </button>
          <button 
            onClick={() => setCurrentTab("goals")}
            style={tabStyle(currentTab === "goals")}
          >
            🎯 Цели
          </button>
          <button 
            onClick={() => setCurrentTab("reflection")}
            style={tabStyle(currentTab === "reflection")}
          >
            📝 Анализ
          </button>
          <button 
            onClick={() => setCurrentTab("settings")}
            style={tabStyle(currentTab === "settings")}
          >
            ⚙️ Настройки
          </button>
        </nav>
        
        <main>
          {currentTab === "planning" && (
            <PlanningTab 
              tasks={tasks} 
              setTasks={saveTasks} 
              settings={settings} 
              saveSettings={saveSettings}
              isMobile={isMobile} 
            />
          )}
          {currentTab === "goals" && (
            <GoalsTab 
              isMobile={isMobile} 
              settings={settings} 
              goals={goals} 
              setGoals={saveGoals} 
            />
          )}
          {currentTab === "reflection" && (
            <ReflectionTab 
              reflections={reflections} 
              saveReflections={saveReflections} 
              settings={settings} 
              isMobile={isMobile} 
            />
          )}
          {currentTab === "settings" && (
            <SettingsTab 
              settings={settings} 
              saveSettings={saveSettings} 
              isMobile={isMobile} 
            />
          )}
        </main>

        {/* Pomodoro Timer - всегда доступен */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          <PomodoroTimer />
        </div>
      </div>
    </EmergencyErrorBoundary>
  );
};

export default App;
