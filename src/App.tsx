import React, { useState, useEffect } from "react";
import { EmergencyErrorBoundary } from "./components/System/EmergencyErrorBoundary";
import { PlanningTab } from './features/daily-planning/ui';
import { SettingsTab } from './features/settings';
import { PomodoroTimer } from './features/pomodoro-timer';
import { LifeWheelApp as LifeWheelAppFromFeatures } from './features/balance-wheel';

// Типы
interface Task {
  id: number;
  text: string;
  sphere: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  completed: boolean;
  createdAt: string;
}

interface Goal {
  id: number;
  text: string;
  steps: GoalStep[];
  createdAt: string;
}

interface GoalStep {
  id: number;
  text: string;
  completed: boolean;
}

interface Reflection {
  id: number;
  date: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  archetype: string;
  createdAt: string;
}

interface Settings {
  archetype: string;
  darkTheme: boolean;
  notifications: boolean;
  autoSave: boolean;
  colorScheme: string;
}

// ?? Pomodoro Timer - ОТДЕЛЬНЫЙ КОМПОНЕНТ

// ?? Главный компонент Life Wheel
const LifeWheelApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<
    "planning" | "goals" | "reflection" | "settings"
  >("planning");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [settings, setSettings] = useState<Settings>({
    archetype: "balanced",
    darkTheme: false,
    notifications: true,
    autoSave: true,
    colorScheme: "purple",
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentGoalId, setCurrentGoalId] = useState<number | null>(null);
  const [stepText, setStepText] = useState("");
  const [showStepForm, setShowStepForm] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);

  // Определение мобильного устройства
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Загрузка данных
  useEffect(() => {
    const savedTasks = localStorage.getItem("life-wheel-tasks");
    const savedGoals = localStorage.getItem("life-wheel-goals");
    const savedReflections = localStorage.getItem("life-wheel-reflections");
    const savedSettings = localStorage.getItem("life-wheel-settings");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedReflections) setReflections(JSON.parse(savedReflections));
    if (savedSettings)
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
  }, []);

  // Сохранение данных
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
    localStorage.setItem(
      "life-wheel-reflections",
      JSON.stringify(newReflections)
    );
  };

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("life-wheel-settings", JSON.stringify(newSettings));
  };

  // Вспомогательные функции
  const getSphereName = (sphere: string) => {
    const spheres: { [key: string]: string } = {
      health: "Здоровье",
      career: "Карьера",
      family: "Семья",
      finance: "Финансы",
      development: "Развитие",
      hobby: "Хобби",
    };
    return spheres[sphere] || sphere;
  };

  // ?? ИСПРАВЛЕННАЯ ФУНКЦИЯ ФОРМАТИРОВАНИЯ ВРЕМЕНИ
  const formatTimeInput = (value: string): string => {
    // Удаляем все нецифровые символы
    let numbers = value.replace(/\D/g, "");

    // Ограничиваем длину
    if (numbers.length > 4) {
      numbers = numbers.substring(0, 4);
    }

    // Форматируем в ЧЧ:ММ
    if (numbers.length <= 2) {
      return numbers;
    } else {
      return numbers.substring(0, 2) + ":" + numbers.substring(2, 4);
    }
  };

  const validateTime = (time: string) => {
    if (!time) return true;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Компонент задачи
  const TaskItem: React.FC<{
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    isMobile: boolean;
  }> = ({ task, onToggle, onDelete, isMobile }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "8px" : "10px",
        margin: "5px 0",
        background: "#f8f8ff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        fontSize: isMobile ? "14px" : "16px",
      }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        style={{ marginRight: "10px" }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            textDecoration: task.completed ? "line-through" : "none",
            color: task.completed ? "#888" : "#000",
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          {task.text}
        </div>
        <div
          style={{
            fontSize: isMobile ? "12px" : "0.8em",
            color: "#666",
            marginTop: "3px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {task.startTime && task.endTime && (
            <span>
              ?? {task.startTime}-{task.endTime}
            </span>
          )}
          <span>?? {getSphereName(task.sphere)}</span>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: isMobile ? "1em" : "1.2em",
          padding: "5px",
        }}
      >
        ???
      </button>
    </div>
  );

  // ?? Компонент планирования

  // ?? Компонент вечернего анализа

  // ?? Компонент настроек

  return (
    <EmergencyErrorBoundary>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        {/* Хедер */}
        <header
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            padding: isMobile ? "15px" : "20px",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              maxWidth: "1200px",
              margin: "0 auto",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "15px" : "0",
            }}
          >
            <div
              style={{
                textAlign: isMobile ? "center" : "left",
                flex: 1,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: isMobile ? "1.8em" : "2.5em",
                  lineHeight: "1.2",
                }}
              >
                ?? Колесо Жизни
              </h1>
              <p
                style={{
                  margin: 0,
                  opacity: 0.9,
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                Баланс, планирование и рефлексия для гармоничной жизни
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 15px",
                  background: "#6A0DAD",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ?? К архитектурам
              </button>
              <button
                onClick={() => setShowPomodoro(!showPomodoro)}
                style={{
                  padding: "8px 12px",
                  background: "#8A2BE2",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {showPomodoro ? "? Скрыть" : "?? Pomodoro"}
              </button>
            </div>
          </div>
        </header>

        {/* Pomodoro в хедере */}
        {showPomodoro && (
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <PomodoroTimer />
          </div>
        )}

        {/* Навигация */}
        <nav
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            padding: isMobile ? "0 10px" : "0 20px",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            overflowX: isMobile ? "auto" : "visible",
          }}
        >
          <div
            style={{
              display: "flex",
              maxWidth: "1200px",
              margin: "0 auto",
              flexWrap: isMobile ? "nowrap" : "wrap",
              overflowX: isMobile ? "auto" : "visible",
            }}
          >
            {(
              [
                { key: "planning", label: "?? Планирование" },
                { key: "goals", label: "?? Цели" },
                { key: "reflection", label: "?? Анализ" },
                { key: "settings", label: "?? Настройки" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                style={{
                  padding: isMobile ? "12px 16px" : "15px 25px",
                  background:
                    currentTab === tab.key
                      ? "rgba(255,255,255,0.2)"
                      : "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: isMobile ? "14px" : "16px",
                  borderBottom:
                    currentTab === tab.key ? "2px solid white" : "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Основной контент */}
        <main
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "10px" : "20px",
            minHeight: "calc(100vh - 200px)",
            overflowX: "hidden",
          }}
        >
          {currentTab === "planning" && <PlanningTab tasks={tasks} setTasks={setTasks} isMobile={isMobile} settings={settings} />}
          {currentTab === "goals" && <GoalsTab />}
          {currentTab === "reflection" && <ReflectionTab />}
          {currentTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </EmergencyErrorBoundary>
  );
};

export default LifeWheelApp;
