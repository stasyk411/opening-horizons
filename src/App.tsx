import React, { useState, useEffect, lazy, Suspense } from "react";
import { EmergencyErrorBoundary } from "./components/System/EmergencyErrorBoundary";
import { FeatureErrorBoundary } from "./components/System/FeatureErrorBoundary";
import {
  SettingsProvider,
  useSettings,
} from "./shared/contexts/SettingsContext";
import { Task, Goal, Reflection } from "./shared/types";
import ArchitectureIndicator from "./components/ArchitectureIndicator";

// 🔽 ИСПРАВЛЕННЫЙ LAZY LOADING ДЛЯ GOALSTAB
const GoalsTab = lazy(() =>
  import("./features/goals-system/ui/GoalsTab").then((module) => ({
    default: module.GoalsTab,
  }))
);

// Остальные компоненты используют named exports
const PlanningTab = lazy(() =>
  import("./features/daily-planning/ui/PlanningTab").then((module) => ({
    default: module.PlanningTab,
  }))
);

// 🔽 ИСПРАВЛЕННЫЙ ПУТЬ ДЛЯ REFLECTIONTAB
const ReflectionTab = lazy(() =>
  import("./features/archetype-planning/ui/ReflectionTab").then((module) => ({
    default: module.ReflectionTab,
  }))
);

const SettingsTab = lazy(() =>
  import("./features/settings/ui/SettingsTab").then((module) => ({
    default: module.SettingsTab,
  }))
);

const EnhancedPomodoro = lazy(() =>
  import("./features/pomodoro-enhanced/ui/EnhancedPomodoro").then((module) => ({
    default: module.EnhancedPomodoro,
  }))
);

// 🔽 КОМПОНЕНТ ЗАГРУЗКИ
const LoadingFallback: React.FC<{ featureName: string }> = ({
  featureName,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      background: "rgba(138, 43, 226, 0.1)",
      borderRadius: "15px",
      margin: "20px 0",
    }}
  >
    <div
      style={{
        fontSize: "18px",
        color: "#8A2BE2",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span>⏳</span>
      Загрузка {featureName}...
    </div>
  </div>
);

// 🔧 КОНФИГУРАЦИЯ РЕЖИМОВ
const getAppConfig = () => {
  const isDevelopment = import.meta.env.VITE_APP_MODE === "development";
  const defaultArchitecture =
    import.meta.env.VITE_DEFAULT_ARCHITECTURE || "feature";
  const enableArchSwitcher =
    import.meta.env.VITE_ENABLE_ARCH_SWITCHER === "true";
  const enableDevTools = import.meta.env.VITE_ENABLE_DEV_TOOLS === "true";

  return {
    isDevelopment,
    defaultArchitecture,
    enableArchSwitcher,
    enableDevTools,
  };
};

// 🔽 ОСНОВНОЙ КОНТЕНТ APP.TSX
const AppContent: React.FC = () => {
  const config = getAppConfig();

  const [currentTab, setCurrentTab] = useState<
    "planning" | "goals" | "reflection" | "settings" | "pomodoro"
  >("planning");
  const [isMobile, setIsMobile] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);

  // 🔥 ВАЖНО: В production используем только Feature-Based
  const [currentArchitecture, setCurrentArchitecture] = useState(
    config.defaultArchitecture
  );

  const [isDataManagerReady, setIsDataManagerReady] = useState(false);

  // Используем настройки из контекста
  const { settings, updateSettings } = useSettings();

  // PWA УСТАНОВКА
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // 🔧 ИСПРАВЛЕННАЯ ФУНКЦИЯ ЗАГРУЗКИ ДАННЫХ
  const loadArchitectureData = async (architecture: string) => {
    try {
      console.log(`🔄 Загрузка данных для архитектуры: ${architecture}`);

      // 🔥 ВАЖНОЕ ИСПРАВЛЕНИЕ: Ждем инициализации Unified Data Manager
      let retryCount = 0;
      const maxRetries = 10;

      while (!window.unifiedDataManager && retryCount < maxRetries) {
        console.log(
          `⏳ Ожидаем инициализации Unified Data Manager... (${
            retryCount + 1
          }/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
        retryCount++;
      }

      if (!window.unifiedDataManager) {
        console.warn(
          "❌ Unified Data Manager не инициализирован после ожидания"
        );
        // Fallback на старую логику
        const savedTasks = localStorage.getItem("life-wheel-tasks");
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        return;
      }

      const handler = window.unifiedDataManager.dataHandlers.get(architecture);
      if (handler && handler.loadTasks) {
        const tasks = await handler.loadTasks();
        console.log(
          `✅ Загружено ${tasks.length} задач для ${architecture}`,
          tasks
        );

        // 🔥 ВАЖНО: Обновляем состояние
        setTasks(tasks);
      } else {
        console.warn(`⚠️ Обработчик для ${architecture} не найден`);
        // Fallback на старую логику
        const savedTasks = localStorage.getItem("life-wheel-tasks");
        if (savedTasks) setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error(`❌ Ошибка загрузки данных для ${architecture}:`, error);
    }
  };

  // 🔧 УНИФИЦИРОВАННОЕ СОХРАНЕНИЕ ДАННЫХ
  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);

    try {
      // Сохраняем через Unified Data Manager для текущей архитектуры
      const handler =
        window.unifiedDataManager?.dataHandlers.get(currentArchitecture);
      if (handler && handler.saveTasks) {
        await handler.saveTasks(newTasks);
        console.log(
          `✅ Задачи сохранены через Unified Data Manager для ${currentArchitecture}`
        );

        // Запускаем синхронизацию с другими архитектурами
        window.unifiedDataManager?.queueSync();

        // Отправляем событие об изменении данных
        document.dispatchEvent(new CustomEvent("dataChanged"));
      } else {
        // Fallback на старую логику
        localStorage.setItem("life-wheel-tasks", JSON.stringify(newTasks));
      }
    } catch (error) {
      console.error("❌ Ошибка сохранения задач:", error);
      // Fallback на старую логику при ошибке
      localStorage.setItem("life-wheel-tasks", JSON.stringify(newTasks));
    }
  };

  // 🔧 СЛУШАТЕЛЬ ГОТОВНОСТИ UNIFIED DATA MANAGER
  useEffect(() => {
    const handleDataManagerReady = () => {
      console.log("✅ Unified Data Manager готов, загружаем данные...");
      setIsDataManagerReady(true);
      loadArchitectureData(currentArchitecture);
    };

    // Если Unified Data Manager уже готов
    if (window.unifiedDataManager) {
      setIsDataManagerReady(true);
    }

    document.addEventListener(
      "unifiedDataManagerReady",
      handleDataManagerReady
    );

    return () => {
      document.removeEventListener(
        "unifiedDataManagerReady",
        handleDataManagerReady
      );
    };
  }, []);

  // 🔧 ОБРАБОТЧИК ГОРЯЧИХ КЛАВИШ ДЛЯ ПЕРЕКЛЮЧЕНИЯ АРХИТЕКТУР (ТОЛЬКО В DEVELOPMENT)
  useEffect(() => {
    // В production отключаем переключение архитектур
    if (!config.enableArchSwitcher) return;

    const handleKeyPress = async (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        let newArchitecture = currentArchitecture;

        if (e.key === "F1") {
          newArchitecture = "feature";
          console.log("🔥 F1 - АКТИВАЦИЯ FEATURE-BASED");
        } else if (e.key === "F2") {
          newArchitecture = "minimalist";
          console.log("🔥 F2 - АКТИВАЦИЯ MINIMALIST");
        } else if (e.key === "F3") {
          newArchitecture = "react";
          console.log("🔥 F3 - АКТИВАЦИЯ REACT");
        }

        if (newArchitecture !== currentArchitecture) {
          setCurrentArchitecture(newArchitecture);

          // 🔥 ВАЖНОЕ ИСПРАВЛЕНИЕ: Ждем перед отправкой событий
          setTimeout(() => {
            // Отправляем событие для Unified Data Manager
            document.dispatchEvent(
              new CustomEvent("architectureChanged", {
                detail: { architecture: newArchitecture },
              })
            );

            // Запускаем синхронизацию если Unified Data Manager готов
            if (window.unifiedDataManager) {
              window.unifiedDataManager.queueSync();
            }
          }, 200);

          // Загружаем данные для новой архитектуры
          await loadArchitectureData(newArchitecture);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentArchitecture, config.enableArchSwitcher]);

  // 🔧 СЛУШАТЕЛИ ИЗМЕНЕНИЙ ДАННЫХ
  useEffect(() => {
    const handleSyncCompleted = () => {
      console.log("✅ Синхронизация завершена, обновляем данные...");
      loadArchitectureData(currentArchitecture);
    };

    const handleDataChanged = () => {
      console.log("🔄 Данные изменены, обновляем...");
      loadArchitectureData(currentArchitecture);
    };

    document.addEventListener("syncCompleted", handleSyncCompleted);
    document.addEventListener("dataChanged", handleDataChanged);

    return () => {
      document.removeEventListener("syncCompleted", handleSyncCompleted);
      document.removeEventListener("dataChanged", handleDataChanged);
    };
  }, [currentArchitecture]);

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

    // 🔥 ВАЖНОЕ ИСПРАВЛЕНИЕ: Загружаем данные только когда готово
    if (isDataManagerReady) {
      loadArchitectureData(currentArchitecture);
    }

    // Загрузка целей и рефлексий (пока через старую логику)
    const savedGoals = localStorage.getItem("life-wheel-goals");
    const savedReflections = localStorage.getItem("life-wheel-reflections");

    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedReflections) setReflections(JSON.parse(savedReflections));

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.fontSize = "";
    };
  }, [isDataManagerReady]);

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
        {/* 🔧 ИНДИКАТОР ТЕКУЩЕЙ АРХИТЕКТУРЫ (ТОЛЬКО В DEVELOPMENT) */}
        <ArchitectureIndicator
          architecture={currentArchitecture}
          show={config.enableDevTools}
        />

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

        {/* 🔧 КНОПКА ДЛЯ ТЕСТИРОВАНИЯ СИНХРОНИЗАЦИИ (ТОЛЬКО В DEVELOPMENT) */}
        {config.enableDevTools && (
          <button
            onClick={() => {
              console.log("🔄 Принудительная перезагрузка данных");
              loadArchitectureData(currentArchitecture);
              window.unifiedDataManager?.queueSync();
            }}
            style={{
              position: "fixed",
              bottom: "20px",
              left: "20px",
              background: "#FF6B35",
              color: "white",
              border: "none",
              borderRadius: "25px",
              padding: "10px 15px",
              fontSize: "12px",
              cursor: "pointer",
              zIndex: 1000,
            }}
            title="Принудительно перезагрузить данные и синхронизировать"
          >
            🔄 Тест синхронизации
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

        {/* 🔽 ОСНОВНОЙ КОНТЕНТ С LAZY LOADING */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {currentTab === "planning" && (
            <FeatureErrorBoundary featureName="Планирование дня">
              <Suspense
                fallback={<LoadingFallback featureName="Планирования Дня" />}
              >
                <PlanningTab
                  tasks={tasks}
                  setTasks={saveTasks}
                  settings={settings}
                  saveSettings={updateSettings}
                  isMobile={isMobile}
                />
              </Suspense>
            </FeatureErrorBoundary>
          )}
          {currentTab === "goals" && (
            <FeatureErrorBoundary featureName="Система целей">
              <Suspense
                fallback={<LoadingFallback featureName="Системы Целей" />}
              >
                <GoalsTab />
              </Suspense>
            </FeatureErrorBoundary>
          )}
          {currentTab === "reflection" && (
            <FeatureErrorBoundary featureName="Вечерний анализ">
              <Suspense
                fallback={<LoadingFallback featureName="Вечернего Анализа" />}
              >
                <ReflectionTab
                  reflections={reflections}
                  saveReflections={saveReflections}
                  settings={settings}
                  isMobile={isMobile}
                />
              </Suspense>
            </FeatureErrorBoundary>
          )}
          {currentTab === "pomodoro" && (
            <FeatureErrorBoundary featureName="Pomodoro таймер">
              <Suspense
                fallback={<LoadingFallback featureName="Pomodoro Таймера" />}
              >
                <EnhancedPomodoro isMobile={isMobile} />
              </Suspense>
            </FeatureErrorBoundary>
          )}
          {currentTab === "settings" && (
            <FeatureErrorBoundary featureName="Настройки">
              <Suspense fallback={<LoadingFallback featureName="Настроек" />}>
                <SettingsTab
                  settings={settings}
                  saveSettings={updateSettings}
                  isMobile={isMobile}
                />
              </Suspense>
            </FeatureErrorBoundary>
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

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

export default App;
