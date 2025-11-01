import React, { useState, useEffect } from "react";
import { EmergencyErrorBoundary } from "./components/System/EmergencyErrorBoundary";
import { Task, Goal, GoalStep, Reflection, Settings } from "./types";
import { PlanningTab } from "./features/daily-planning";
import { GoalsTab } from "./features/goals-system";
import { ReflectionTab } from "./features/archetype-planning";
import { PomodoroTimer } from "./features/pomodoro-timer";
import { SettingsTab } from "./features/settings";

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<
    "planning" | "goals" | "reflection" | "settings" | "pomodoro"
  >("planning");
  const [isMobile, setIsMobile] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [settings, setSettings] = useState<Settings>({
    archetype: "",
    darkTheme: false,
    notifications: true,
    autoSave: true,
    colorScheme: "purple",
  });

  // PWA УСТАНОВКА
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Детектор мобильных устройств
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (window.innerWidth < 400) {
        document.body.style.fontSize = "14px";
      } else {
        document.body.style.fontSize = "16px";
      }
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

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.fontSize = "";
    };
  }, []);

  // PWA: Отслеживаем возможность установки
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallButton(true);
      console.log("📱 PWA можно установить");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Проверяем если уже установлено
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("✅ PWA уже установлено");
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // PWA: Установка приложения
  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ Пользователь установил PWA");
      setShowInstallButton(false);
    } else {
      console.log("❌ Пользователь отклонил установку");
    }

    setInstallPrompt(null);
  };

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
    localStorage.setItem(
      "life-wheel-reflections",
      JSON.stringify(newReflections)
    );
  };

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("life-wheel-settings", JSON.stringify(newSettings));
  };

  // Адаптивные стили
  const containerStyle = {
    background: settings.darkTheme
      ? "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)"
      : "linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)",
    minHeight: "100vh",
    color: settings.darkTheme ? "white" : "#2F2F4F",
    padding: isMobile ? "10px" : "20px",
    fontSize: isMobile ? "14px" : "16px",
  };

  const headerStyle = {
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    padding: isMobile ? "15px" : "25px",
    borderRadius: isMobile ? "15px" : "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center" as const,
    marginBottom: isMobile ? "20px" : "30px",
    position: "relative" as const,
    overflow: "hidden" as const,
  };

  const navStyle = {
    background: settings.darkTheme ? "#2a2a2a" : "white",
    padding: isMobile ? "10px" : "20px",
    borderRadius: isMobile ? "10px" : "15px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap" as const,
    gap: isMobile ? "8px" : "15px",
    marginBottom: isMobile ? "20px" : "30px",
    overflowX: isMobile ? ("auto" as const) : ("visible" as const),
  };

  const tabStyle = (isActive: boolean) => ({
    padding: isMobile ? "10px 15px" : "15px 25px",
    background: isActive
      ? "linear-gradient(to right, #8A2BE2, #4B0082)"
      : "white",
    color: isActive ? "white" : settings.darkTheme ? "#ccc" : "#666",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: isMobile ? "12px" : "16px",
    margin: "0 2px",
    transition: "all 0.4s ease",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "5px" : "10px",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  });

  // PWA: Стиль кнопки установки
  const installButtonStyle = {
    position: "fixed" as const,
    top: "20px",
    right: "20px",
    background: "linear-gradient(to right, #32CD32, #228B22)",
    color: "white",
    border: "none",
    borderRadius: "25px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    zIndex: 1000,
    animation: "pulse 2s infinite",
  };

  return (
    <EmergencyErrorBoundary>
      <div style={containerStyle}>
        {/* PWA: Кнопка установки */}
        {showInstallButton && (
          <button
            onClick={handleInstallClick}
            style={installButtonStyle}
            title="Установить приложение на устройство"
          >
            📱 Установить App
          </button>
        )}

        {/* Заголовок */}
        <header style={headerStyle}>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? "1.5rem" : "2.8rem",
              marginBottom: isMobile ? "5px" : "10px",
              lineHeight: 1.2,
            }}
          >
            🎯 {isMobile ? "Opening Horizons" : "Opening Horizons"}
          </h1>
          <p
            style={{
              margin: 0,
              opacity: 0.9,
              fontSize: isMobile ? "0.8rem" : "1.3rem",
              lineHeight: 1.3,
            }}
          >
            {isMobile
              ? "Баланс и планирование"
              : "Баланс, планирование и рефлексия для гармоничной жизни"}
          </p>
        </header>

        {/* Навигация */}
        <nav style={navStyle}>
          <button
            onClick={() => setCurrentTab("planning")}
            style={tabStyle(currentTab === "planning")}
          >
            <span>📅</span> {isMobile ? "План" : "Планирование Дня"}
          </button>
          <button
            onClick={() => setCurrentTab("goals")}
            style={tabStyle(currentTab === "goals")}
          >
            <span>🎯</span> {isMobile ? "Цели" : "Цели"}
          </button>
          <button
            onClick={() => setCurrentTab("reflection")}
            style={tabStyle(currentTab === "reflection")}
          >
            <span>🌙</span> {isMobile ? "Анализ" : "Вечерний Анализ"}
          </button>
          <button
            onClick={() => setCurrentTab("pomodoro")}
            style={tabStyle(currentTab === "pomodoro")}
          >
            <span>🍅</span> {isMobile ? "Таймер" : "Pomodoro"}
          </button>
          <button
            onClick={() => setCurrentTab("settings")}
            style={tabStyle(currentTab === "settings")}
          >
            <span>⚙️</span> {isMobile ? "Настройки" : "Настройки"}
          </button>
        </nav>

        {/* Основной контент */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {currentTab === "planning" && (
            <PlanningTab
              tasks={tasks}
              setTasks={saveTasks}
              settings={settings}
              saveSettings={saveSettings}
              isMobile={isMobile}
            />
          )}
          {currentTab === "goals" && <GoalsTab />}
          {currentTab === "reflection" && (
            <ReflectionTab
              reflections={reflections}
              saveReflections={saveReflections}
              settings={settings}
              isMobile={isMobile}
            />
          )}
          {currentTab === "pomodoro" && (
            <PomodoroTimer isMobile={isMobile} settings={settings} />
          )}
          {currentTab === "settings" && (
            <SettingsTab
              settings={settings}
              saveSettings={saveSettings}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>

      {/* PWA: CSS анимация для кнопки */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </EmergencyErrorBoundary>
  );
};

export default App;
