import React, { useState, useEffect } from "react";
import { EmergencyErrorBoundary } from "./components/System/EmergencyErrorBoundary";

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

// 🍅 Pomodoro Timer - ОТДЕЛЬНЫЙ КОМПОНЕНТ
const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            alert(
              `🎉 ${mode === "work" ? "Рабочая сессия" : "Перерыв"} завершена!`
            );
            const newMode = mode === "work" ? "break" : "work";
            setMode(newMode);
            return newMode === "work" ? 25 * 60 : 5 * 60;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      style={{
        background: "#f8f8ff",
        padding: "12px",
        borderRadius: "12px",
        border: "2px solid #8A2BE2",
        minWidth: "180px",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "14px" }}>
          🍅 {mode === "work" ? "Работа" : "Перерыв"}
        </span>
        <div
          style={{
            fontWeight: "bold",
            fontFamily: "monospace",
            fontSize: "16px",
          }}
        >
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setIsRunning(true)}
          style={{
            padding: "6px 8px",
            border: "none",
            borderRadius: "6px",
            background: "#8A2BE2",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ▶️
        </button>
        <button
          onClick={() => setIsRunning(false)}
          style={{
            padding: "6px 8px",
            border: "none",
            borderRadius: "6px",
            background: "#8A2BE2",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ⏸️
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
          }}
          style={{
            padding: "6px 8px",
            border: "none",
            borderRadius: "6px",
            background: "#8A2BE2",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          🔄
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            const newMode = mode === "work" ? "break" : "work";
            setMode(newMode);
            setTimeLeft(newMode === "work" ? 25 * 60 : 5 * 60);
          }}
          style={{
            padding: "6px 8px",
            border: "none",
            borderRadius: "6px",
            background: "#8A2BE2",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ⚡
        </button>
      </div>
    </div>
  );
};

// 🎯 Главный компонент Life Wheel
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

  // 🕒 ИСПРАВЛЕННАЯ ФУНКЦИЯ ФОРМАТИРОВАНИЯ ВРЕМЕНИ
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
              🕐 {task.startTime}-{task.endTime}
            </span>
          )}
          <span>📌 {getSphereName(task.sphere)}</span>
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
        🗑️
      </button>
    </div>
  );

  // 📅 Компонент планирования
  const PlanningTab = () => {
    const [taskText, setTaskText] = useState("");
    const [taskSphere, setTaskSphere] = useState("health");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [taskDate, setTaskDate] = useState(
      new Date().toISOString().split("T")[0]
    );

    const addTask = (withDate: boolean = true) => {
      if (!taskText.trim()) {
        alert("Введите текст задачи!");
        return;
      }

      // ИСПРАВЛЕНА ВАЛИДАЦИЯ ВРЕМЕНИ
      if (startTime && !validateTime(startTime)) {
        alert("Пожалуйста, введите корректное время начала в формате ЧЧ:MM");
        return;
      }

      if (endTime && !validateTime(endTime)) {
        alert("Пожалуйста, введите корректное время окончания в формате ЧЧ:MM");
        return;
      }

      const newTask: Task = {
        id: Date.now(),
        text: taskText,
        sphere: taskSphere,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        date: withDate ? taskDate : undefined,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      saveTasks([...tasks, newTask]);
      setTaskText("");
      setStartTime("");
      setEndTime("");

      alert("✅ Задача добавлена!");
    };

    const toggleTaskCompletion = (taskId: number) => {
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      saveTasks(updatedTasks);
    };

    const deleteTask = (taskId: number) => {
      if (confirm("Удалить задачу?")) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        saveTasks(updatedTasks);
      }
    };

    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter(
      (task) => task.date === today && !task.completed
    );
    const futureTasks = tasks.filter(
      (task) => task.date && task.date > today && !task.completed
    );
    const noDateTasks = tasks.filter((task) => !task.date && !task.completed);

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
          Планирование Дня
        </h2>

        {/* Выбор архетипа */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: isMobile ? "1.2em" : "1.5em" }}>
            Выберите тип дня
          </h3>
          <div
            style={{
              display: "flex",
              gap: isMobile ? "8px" : "15px",
              marginTop: "15px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            {[
              {
                key: "productive",
                name: "ПРОДУКТИВНЫЙ",
                icon: "📈",
                desc: "Сфокусируйтесь на важных задачах",
              },
              {
                key: "balanced",
                name: "СБАЛАНСИРОВАННЫЙ",
                icon: "⚖️",
                desc: "Равномерное распределение энергии",
              },
              {
                key: "recovery",
                name: "ВОССТАНАВЛИВАЮЩИЙ",
                icon: "🔄",
                desc: "День для отдыха и восстановления",
              },
            ].map((arch) => (
              <div
                key={arch.key}
                onClick={() =>
                  saveSettings({ ...settings, archetype: arch.key })
                }
                style={{
                  flex: 1,
                  padding: isMobile ? "15px" : "20px",
                  background:
                    settings.archetype === arch.key ? "#8A2BE2" : "#f8f8ff",
                  color: settings.archetype === arch.key ? "white" : "#333",
                  borderRadius: "12px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "2px solid #8A2BE2",
                  minHeight: isMobile ? "auto" : "120px",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "1.5em" : "2em",
                    marginBottom: "8px",
                  }}
                >
                  {arch.icon}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                >
                  {arch.name}
                </div>
                {!isMobile && (
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    {arch.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Форма добавления задачи */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Опишите вашу задачу..."
            style={{
              flex: 1,
              padding: "12px",
              border: "2px solid #8A2BE2",
              borderRadius: "8px",
              fontSize: "16px",
              background: "white",
              color: "#333",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: isMobile ? "row" : "column",
            }}
          >
            <button
              onClick={() => addTask(true)}
              style={{
                padding: "12px 16px",
                background: "#8A2BE2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              ➕ Добавить
            </button>
            <button
              onClick={() => addTask(false)}
              style={{
                padding: "12px 16px",
                background: "#6A0DAD",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              ⏳ Без даты
            </button>
          </div>
        </div>

        {/* Опции задачи */}
        <div
          style={{
            display: "grid",
            gap: "15px",
            marginBottom: "20px",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Сфера жизни
            </div>
            <select
              value={taskSphere}
              onChange={(e) => setTaskSphere(e.target.value)}
              style={{
                padding: "10px",
                border: "2px solid #8A2BE2",
                borderRadius: "6px",
                width: "100%",
                fontSize: "14px",
                background: "white",
                color: "#333",
              }}
            >
              <option value="health">Здоровье</option>
              <option value="career">Карьера</option>
              <option value="family">Семья</option>
              <option value="finance">Финансы</option>
              <option value="development">Развитие</option>
              <option value="hobby">Хобби</option>
            </select>
          </div>

          <div>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Время выполнения
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(formatTimeInput(e.target.value))}
                placeholder="09:00"
                maxLength={5}
                style={{
                  padding: "10px",
                  border: "2px solid #8A2BE2",
                  borderRadius: "6px",
                  width: isMobile ? "70px" : "80px",
                  textAlign: "center",
                  fontSize: "14px",
                  background: "white",
                  color: "#333",
                }}
              />
              <span style={{ fontSize: "14px" }}>—</span>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(formatTimeInput(e.target.value))}
                placeholder="10:30"
                maxLength={5}
                style={{
                  padding: "10px",
                  border: "2px solid #8A2BE2",
                  borderRadius: "6px",
                  width: isMobile ? "70px" : "80px",
                  textAlign: "center",
                  fontSize: "14px",
                  background: "white",
                  color: "#333",
                }}
              />
            </div>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Формат: ЧЧ:MM (24-часовой)
            </div>
          </div>

          <div>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Дата выполнения
            </div>
            <input
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              style={{
                padding: "10px",
                border: "2px solid #8A2BE2",
                borderRadius: "6px",
                width: "100%",
                fontSize: "14px",
                background: "white",
                color: "#333",
              }}
            />
          </div>
        </div>

        {/* Списки задач */}
        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          <div>
            <h3 style={{ fontSize: isMobile ? "1.1em" : "1.3em" }}>
              📋 Сегодня ({todayTasks.length})
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {todayTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                  isMobile={isMobile}
                />
              ))}
              {todayTasks.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    background: "#f8f8ff",
                    borderRadius: "8px",
                  }}
                >
                  Задачи отсутствуют
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: isMobile ? "1.1em" : "1.3em" }}>
              📅 Будущие ({futureTasks.length})
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {futureTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                  isMobile={isMobile}
                />
              ))}
              {futureTasks.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    background: "#f8f8ff",
                    borderRadius: "8px",
                  }}
                >
                  Задачи отсутствуют
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: isMobile ? "1.1em" : "1.3em" }}>
              ⏳ Без даты ({noDateTasks.length})
            </h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {noDateTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  onDelete={deleteTask}
                  isMobile={isMobile}
                />
              ))}
              {noDateTasks.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666",
                    background: "#f8f8ff",
                    borderRadius: "8px",
                  }}
                >
                  Задачи отсутствуют
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🎯 Компонент целей
  const GoalsTab = () => {
    const [goalText, setGoalText] = useState("");

    const addGoal = () => {
      if (!goalText.trim()) {
        alert("Введите текст цели!");
        return;
      }

      const newGoal: Goal = {
        id: Date.now(),
        text: goalText,
        steps: [],
        createdAt: new Date().toISOString(),
      };

      saveGoals([...goals, newGoal]);
      setGoalText("");
      alert("✅ Цель добавлена!");
    };

    const deleteGoal = (goalId: number) => {
      if (confirm("Удалить цель?")) {
        const updatedGoals = goals.filter((goal) => goal.id !== goalId);
        saveGoals(updatedGoals);
      }
    };

    // ИСПРАВЛЕННАЯ ФУНКЦИЯ ДОБАВЛЕНИЯ ШАГА
    const addStep = () => {
      if (!stepText.trim()) {
        alert("Введите текст шага!");
        return;
      }

      if (!currentGoalId) {
        alert("Ошибка: цель не выбрана");
        return;
      }

      const updatedGoals = goals.map((goal) => {
        if (goal.id === currentGoalId) {
          const newStep: GoalStep = {
            id: Date.now(),
            text: stepText,
            completed: false,
          };
          return {
            ...goal,
            steps: [...goal.steps, newStep],
          };
        }
        return goal;
      });

      saveGoals(updatedGoals);
      setStepText("");
      setShowStepForm(false);
      setCurrentGoalId(null);
      alert("✅ Шаг добавлен!");
    };

    const toggleStep = (goalId: number, stepId: number) => {
      const updatedGoals = goals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            steps: goal.steps.map((step) =>
              step.id === stepId
                ? { ...step, completed: !step.completed }
                : step
            ),
          };
        }
        return goal;
      });

      saveGoals(updatedGoals);
    };

    const deleteStep = (goalId: number, stepId: number) => {
      if (confirm("Удалить шаг?")) {
        const updatedGoals = goals.map((goal) => {
          if (goal.id === goalId) {
            return {
              ...goal,
              steps: goal.steps.filter((step) => step.id !== stepId),
            };
          }
          return goal;
        });

        saveGoals(updatedGoals);
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
          Мои Цели
        </h2>

        <div style={{ marginBottom: "30px" }}>
          {goals.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#666",
                background: "#f8f8ff",
                borderRadius: "12px",
              }}
            >
              Цели еще не добавлены
            </div>
          ) : (
            goals.map((goal) => {
              const completedSteps = goal.steps.filter(
                (step) => step.completed
              ).length;
              const totalSteps = goal.steps.length;
              const progress =
                totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

              return (
                <div
                  key={goal.id}
                  style={{
                    background: "#f8f8ff",
                    padding: isMobile ? "15px" : "20px",
                    borderRadius: "12px",
                    marginBottom: "15px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "10px",
                      flexDirection: isMobile ? "column" : "row",
                      gap: isMobile ? "10px" : "0",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        color: "#333",
                        fontSize: isMobile ? "1.1em" : "1.2em",
                        flex: 1,
                      }}
                    >
                      {goal.text}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() => {
                          setCurrentGoalId(goal.id);
                          setShowStepForm(true);
                        }}
                        style={{
                          background: "#8A2BE2",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ➕ Шаг
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        style={{
                          background: "#FF4500",
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        🗑️ Удалить
                      </button>
                    </div>
                  </div>

                  {/* Прогресс бар */}
                  <div style={{ marginBottom: "15px" }}>
                    <div
                      style={{
                        background: "#e0e0e0",
                        borderRadius: "10px",
                        height: "8px",
                        overflow: "hidden",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        style={{
                          background: "#8A2BE2",
                          height: "100%",
                          width: `${progress}%`,
                          transition: "width 0.3s",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        fontSize: "0.9em",
                        color: "#666",
                        textAlign: "center",
                      }}
                    >
                      {completedSteps} из {totalSteps} шагов (
                      {Math.round(progress)}%)
                    </div>
                  </div>

                  {/* Список шагов */}
                  {goal.steps.length > 0 && (
                    <div style={{ marginTop: "15px" }}>
                      <div
                        style={{
                          fontSize: "0.9em",
                          color: "#666",
                          marginBottom: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Шаги:
                      </div>
                      {goal.steps.map((step) => (
                        <div
                          key={step.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            margin: "4px 0",
                            background: "white",
                            borderRadius: "6px",
                            border: "1px solid #e0e0e0",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={step.completed}
                            onChange={() => toggleStep(goal.id, step.id)}
                            style={{ marginRight: "10px" }}
                          />
                          <span
                            style={{
                              flex: 1,
                              textDecoration: step.completed
                                ? "line-through"
                                : "none",
                              color: step.completed ? "#888" : "#333",
                              fontSize: "14px",
                            }}
                          >
                            {step.text}
                          </span>
                          <button
                            onClick={() => deleteStep(goal.id, step.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                              color: "#FF4500",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Форма добавления цели */}
        <div>
          <h3
            style={{
              fontSize: isMobile ? "1.1em" : "1.3em",
              marginBottom: "15px",
            }}
          >
            Добавить новую цель
          </h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="Опишите вашу цель..."
              style={{
                flex: 1,
                padding: "12px",
                border: "2px solid #8A2BE2",
                borderRadius: "8px",
                fontSize: "16px",
                background: "white",
                color: "#333",
              }}
            />
            <button
              onClick={addGoal}
              style={{
                padding: "12px 20px",
                background: "#8A2BE2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                whiteSpace: "nowrap",
              }}
            >
              🎯 Добавить цель
            </button>
          </div>
        </div>

        {/* Форма добавления шага */}
        {showStepForm && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#f0f0f0",
              borderRadius: "8px",
              border: "2px solid #8A2BE2",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>Добавить шаг к цели</h4>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <input
                type="text"
                value={stepText}
                onChange={(e) => setStepText(e.target.value)}
                placeholder="Опишите шаг..."
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "14px",
                  background: "white",
                  color: "#333",
                }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  onClick={addStep}
                  style={{
                    padding: "10px 15px",
                    background: "#8A2BE2",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ➕ Добавить
                </button>
                <button
                  onClick={() => {
                    setShowStepForm(false);
                    setCurrentGoalId(null);
                    setStepText("");
                  }}
                  style={{
                    padding: "10px 15px",
                    background: "#666",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ❌ Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 🌙 Компонент вечернего анализа
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
      alert("✅ Анализ сохранен!");
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
            💾 Сохранить анализ
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
            📊 История анализов
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
                        🗑️
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

  // ⚙️ Компонент настроек
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

      alert("✅ Данные экспортированы!");
    };

    const handleImport = () => {
      try {
        const data = JSON.parse(importData);

        if (data.tasks) saveTasks(data.tasks);
        if (data.goals) saveGoals(data.goals);
        if (data.reflections) saveReflections(data.reflections);
        if (data.settings) saveSettings(data.settings);

        setImportData("");
        alert("✅ Данные импортированы!");
      } catch (error) {
        alert("❌ Ошибка при импорте: неверный формат JSON");
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
        alert("✅ Данные сброшены!");
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
                {showPomodoro ? "❌ Скрыть Pomodoro" : "🍅 Показать Pomodoro"}
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
                📤 Экспорт данных
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
                  📥 Импорт данных
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
                🔄 Сбросить все данные
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
                🎯 Колесо Жизни
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
                🔙 К архитектурам
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
                {showPomodoro ? "❌ Скрыть" : "🍅 Pomodoro"}
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
                { key: "planning", label: "📅 Планирование" },
                { key: "goals", label: "🎯 Цели" },
                { key: "reflection", label: "🌙 Анализ" },
                { key: "settings", label: "⚙️ Настройки" },
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
          {currentTab === "planning" && <PlanningTab />}
          {currentTab === "goals" && <GoalsTab />}
          {currentTab === "reflection" && <ReflectionTab />}
          {currentTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </EmergencyErrorBoundary>
  );
};

export default LifeWheelApp;
