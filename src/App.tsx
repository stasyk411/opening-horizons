import React, { useState, useEffect } from "react";
import { EmergencyErrorBoundary } from "./components/System/EmergencyErrorBoundary";
import { Task, Goal, GoalStep, Reflection, Settings } from './types';
import { PlanningTab } from './features/daily-planning';
import { GoalsTab } from './features/goals-system';
import { ReflectionTab } from './features/archetype-planning';
import { PomodoroTimer } from './features/pomodoro-timer';
import { SettingsTab } from './features/settings';

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Простой заглушки для состояний
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          padding: '15px 20px',
          textAlign: 'center'
        }}>
          <h1>🎯 Opening Horizons</h1>
          <p>Минимальная рабочая версия</p>
        </header>
        
        <main style={{ padding: '20px' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h2>📊 Статус</h2>
            <p>Задачи: {tasks.length}</p>
            <p>Цели: {goals.length}</p>
            <p>Анализы: {reflections.length}</p>
            <p>Мобильный: {isMobile ? 'Да' : 'Нет'}</p>
          </div>
        </main>
      </div>
    </EmergencyErrorBoundary>
  );
};

export default App;




