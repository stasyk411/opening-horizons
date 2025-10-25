import React, { useState, useEffect } from "react";
import { EmergencyErrorBoundary } from "./components/System/EmergencyErrorBoundary";
import { PlanningTab } from './features/daily-planning/ui';
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
  const GoalsTab = () => {
    const { goals, setGoals } = useGoalsSystem();
    return (
      <GoalsTabComponent
        isMobile={isMobile}
        settings={settings}
      />
    );
  };

  // ?? Компонент вечернего анализа
  const ReflectionTab = () => {
    const [answers, setAnswers] = useState({
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      question5: "",
    });

    const saveReflection = () => {
      if (!answers.question1.trim()) {
        alert("Пожалуйста, ответьте хотя бы на первый вопрос");
        return;
      }

      const newReflection: Reflection = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        ...answers,
        archetype: settings.archetype,
        createdAt: new Date().toISOString(),
      };

      saveReflections([...reflections, newReflection]);
      setAnswers({
        question1: "",
        question2: "",
        question3: "",
        question4: "",
        question5: "",
      });
      alert("? Анализ сохранен!");
    };

    const deleteReflection = (reflectionId: number) => {
      if (confirm("Удалить анализ?")) {
        const updatedReflections = reflections.filter(
          (ref) => ref.id !== reflectionId
        );
        saveReflections(updatedReflections);
      }
    };

    return (
      <div
        style={{
          padding: isMobile ? "15px" : "20px",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <h2
          style={{
            color: "#8A2BE2",
            marginBottom: "20px",
            fontSize: isMobile ? "1.5em" : "2em",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Вечерний Анализ
        </h2>

        {/* Форма анализа */}
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: isMobile ? "15px" : "25px",
            borderRadius: "15px",
            backdropFilter: "blur(10px)",
            marginBottom: "30px",
          }}
        >
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: "white",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              1. Что получилось особенно хорошо сегодня?
            </div>
            <textarea
              value={answers.question1}
              onChange={(e) =>
                setAnswers({ ...answers, question1: e.target.value })
              }
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #8A2BE2",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
                background: "white",
                color: "#333",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: "white",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              2. Что бы я сделал иначе, если бы мог вернуться назад?
            </div>
            <textarea
              value={answers.question2}
              onChange={(e) =>
                setAnswers({ ...answers, question2: e.target.value })
              }
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #8A2BE2",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
                background: "white",
                color: "#333",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: "white",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              3. Какие уроки я извлек из сегодняшнего дня?
            </div>
            <textarea
              value={answers.question3}
              onChange={(e) =>
                setAnswers({ ...answers, question3: e.target.value })
              }
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #8A2BE2",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
                background: "white",
                color: "#333",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: "white",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              4. За что я благодарен сегодня?
            </div>
            <textarea
              value={answers.question4}
              onChange={(e) =>
                setAnswers({ ...answers, question4: e.target.value })
              }
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #8A2BE2",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
                background: "white",
                color: "#333",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
                color: "white",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              5. Что я планирую сделать завтра для улучшения своей жизни?
            </div>
            <textarea
              value={answers.question5}
              onChange={(e) =>
                setAnswers({ ...answers, question5: e.target.value })
              }
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #8A2BE2",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
                background: "white",
                color: "#333",
              }}
            />
          </div>

          <button
            onClick={saveReflection}
            style={{
              padding: "15px 30px",
              background: "#8A2BE2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              width: isMobile ? "100%" : "auto",
            }}
          >
            ?? Сохранить анализ
          </button>
        </div>

        {/* История анализов */}
        <div>
          <h3
            style={{
              fontSize: isMobile ? "1.2em" : "1.5em",
              marginBottom: "20px",
              color: "white",
            }}
          >
            ?? История анализов
          </h3>

          {reflections.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#ccc",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              Анализы отсутствуют
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "15px",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(300px, 1fr))",
              }}
            >
              {reflections
                .slice(-6)
                .reverse()
                .map((reflection) => (
                  <div
                    key={reflection.id}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      padding: "15px",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <strong style={{ color: "white", fontSize: "14px" }}>
                        {reflection.date}
                      </strong>
                      <span
                        style={{
                          background: "#8A2BE2",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "10px",
                          fontSize: "12px",
                        }}
                      >
                        {reflection.archetype || "Не указан"}
                      </span>
                      <button
                        onClick={() => deleteReflection(reflection.id)}
                        style={{
                          background: "rgba(255,69,0,0.7)",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        ???
                      </button>
                    </div>
                    <div style={{ color: "#e0e0e0", fontSize: "13px" }}>
                      <div style={{ marginBottom: "5px" }}>
                        <strong>Что получилось:</strong>{" "}
                        {reflection.question1?.substring(0, 100)}...
                      </div>
                      {reflection.question2 && (
                        <div style={{ marginBottom: "5px" }}>
                          <strong>Что бы изменил:</strong>{" "}
                          {reflection.question2?.substring(0, 80)}...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ?? Компонент настроек
  const SettingsTab = () => {
    const [importData, setImportData] = useState("");

    const exportData = () => {
      const data = {
        tasks,
        goals,
        reflections,
        settings,
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = `life-wheel-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();

      alert("? Данные экспортированы!");
    };

    const handleImport = () => {
      try {
        const data = JSON.parse(importData);

        if (data.tasks) saveTasks(data.tasks);
        if (data.goals) saveGoals(data.goals);
        if (data.reflections) saveReflections(data.reflections);
        if (data.settings) saveSettings(data.settings);

        setImportData("");
        alert("? Данные импортированы!");
      } catch (error) {
        alert("? Ошибка при импорте: неверный формат JSON");
      }
    };

    const resetData = () => {
      if (
        confirm(
          "Вы уверены, что хотите сбросить ВСЕ данные? Это действие нельзя отменить."
        )
      ) {
        localStorage.removeItem("life-wheel-tasks");
        localStorage.removeItem("life-wheel-goals");
        localStorage.removeItem("life-wheel-reflections");
        localStorage.removeItem("life-wheel-settings");
        setTasks([]);
        setGoals([]);
        setReflections([]);
        alert("? Данные сброшены!");
      }
    };

    return (
      <div
        style={{
          padding: isMobile ? "15px" : "20px",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <h2
          style={{
            color: "#8A2BE2",
            marginBottom: "20px",
            fontSize: isMobile ? "1.5em" : "2em",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Настройки
        </h2>

        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {/* Внешний вид */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "20px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "15px" }}>
              Внешний вид
            </h3>

            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "white", fontSize: "14px" }}>
                  Темная тема
                </span>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "50px",
                    height: "24px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.darkTheme}
                    onChange={(e) =>
                      saveSettings({ ...settings, darkTheme: e.target.checked })
                    }
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.darkTheme ? "#8A2BE2" : "#ccc",
                      borderRadius: "24px",
                      transition: "0.4s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: '""',
                        height: "18px",
                        width: "18px",
                        left: settings.darkTheme ? "26px" : "3px",
                        bottom: "3px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        transition: "0.4s",
                      }}
                    ></span>
                  </span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "white", fontSize: "14px" }}>
                  Уведомления
                </span>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "50px",
                    height: "24px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        notifications: e.target.checked,
                      })
                    }
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.notifications
                        ? "#8A2BE2"
                        : "#ccc",
                      borderRadius: "24px",
                      transition: "0.4s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: '""',
                        height: "18px",
                        width: "18px",
                        left: settings.notifications ? "26px" : "3px",
                        bottom: "3px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        transition: "0.4s",
                      }}
                    ></span>
                  </span>
                </label>
              </div>
            </div>

            {/* КНОПКА POMODORO */}
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setShowPomodoro(!showPomodoro)}
                style={{
                  padding: "12px",
                  background: "#8A2BE2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                {showPomodoro ? "? Скрыть Pomodoro" : "?? Показать Pomodoro"}
              </button>
            </div>
          </div>

          {/* Управление данными */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "20px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "15px" }}>
              Управление данными
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={exportData}
                style={{
                  padding: "12px",
                  background: "#8A2BE2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ?? Экспорт данных
              </button>

              <div>
                <div
                  style={{
                    color: "white",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  Импорт данных (JSON):
                </div>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Вставьте JSON данные..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #8A2BE2",
                    borderRadius: "6px",
                    fontSize: "12px",
                    marginBottom: "8px",
                    resize: "vertical",
                    background: "white",
                    color: "#333",
                  }}
                />
                <button
                  onClick={handleImport}
                  style={{
                    padding: "8px 12px",
                    background: "#8A2BE2",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    width: "100%",
                  }}
                >
                  ?? Импорт данных
                </button>
              </div>

              <button
                onClick={resetData}
                style={{
                  padding: "12px",
                  background: "#FF4500",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ?? Сбросить все данные
              </button>
            </div>
          </div>
        </div>

        {/* Pomodoro Timer */}
        {showPomodoro && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PomodoroTimer />
          </div>
        )}
      </div>
    );
  };

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
