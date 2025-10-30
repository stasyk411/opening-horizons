import React, { useState } from "react";
import { Task } from "../../../types";

interface PlanningTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  settings: any;
  saveSettings: (settings: any) => void;
  isMobile: boolean;
}

const PlanningTab: React.FC<PlanningTabProps> = ({
  tasks,
  setTasks,
  settings,
  saveSettings,
  isMobile,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [taskInput, setTaskInput] = useState("");
  const [taskSphere, setTaskSphere] = useState("health");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [taskRepeat, setTaskRepeat] = useState("");
  const [taskAlarm, setTaskAlarm] = useState("");
  const [archetype, setArchetype] = useState("");

  // Стили из макета
  const sectionTitleStyle = {
    fontSize: isMobile ? "1.3rem" : "1.8rem",
    marginBottom: isMobile ? "15px" : "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const archetypeSectionStyle = {
    marginBottom: isMobile ? "20px" : "30px",
    padding: isMobile ? "15px" : "25px",
    background: "#F8F8FF",
    borderRadius: isMobile ? "15px" : "20px",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  // Адаптивная сетка для архетипов
  const archetypeSelectorStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: isMobile ? "15px" : "20px",
    marginTop: isMobile ? "15px" : "20px",
    width: "100%",
  };

  const archetypeOptionStyle = (isActive: boolean) => ({
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: isMobile ? "15px 10px" : "25px 15px",
    borderRadius: isMobile ? "15px" : "20px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    textAlign: "center" as const,
    border: isActive ? "2px solid #8A2BE2" : "2px solid transparent",
    background: isActive
      ? "linear-gradient(to bottom, rgba(138, 43, 226, 0.05), rgba(75, 0, 130, 0.05))"
      : "white",
    width: "100%",
    minHeight: isMobile ? "140px" : "auto",
  });

  // Ярлыки для архетипов (как в макете)
  const archetypeBadgeStyle = {
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: isMobile ? "0.7rem" : "0.8rem",
    fontWeight: "bold",
    marginBottom: "10px",
    textTransform: "uppercase" as const,
  };

  const taskFormStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
    gap: isMobile ? "10px" : "15px",
    marginBottom: isMobile ? "20px" : "30px",
    width: "100%",
  };

  // ИСПРАВЛЕННЫЙ СТИЛЬ ДЛЯ ВВОДА ТЕКСТА
  const taskInputStyle = {
    padding: isMobile ? "12px" : "15px",
    border: "1px solid #E0E0E0",
    borderRadius: isMobile ? "12px" : "15px",
    fontSize: isMobile ? "14px" : "1rem",
    background: "white",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box" as const,
    color: "#333", // ДОБАВЛЕНО: четкий цвет текста
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const btnStyle = {
    padding: isMobile ? "12px 18px" : "15px 25px",
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    border: "none",
    borderRadius: isMobile ? "12px" : "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: isMobile ? "14px" : "16px",
    minHeight: "44px",
    justifyContent: "center" as const,
    whiteSpace: "nowrap" as const,
  };

  const taskOptionsStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
    gap: isMobile ? "10px" : "15px",
    marginBottom: isMobile ? "15px" : "20px",
    width: "100%",
  };

  const optionGroupStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: isMobile ? "5px" : "8px",
    width: "100%",
  };

  const optionLabelStyle = {
    fontWeight: 600,
    fontSize: isMobile ? "0.8rem" : "0.9rem",
    color: "#696969",
  };

  // ИСПРАВЛЕННЫЙ СТИЛЬ ДЛЯ SELECT И INPUT
  const optionSelectStyle = {
    padding: isMobile ? "10px" : "12px",
    border: "1px solid #E0E0E0",
    borderRadius: isMobile ? "8px" : "10px",
    background: "white",
    fontSize: isMobile ? "14px" : "1rem",
    width: "100%",
    boxSizing: "border-box" as const,
    color: "#333", // ДОБАВЛЕНО: четкий цвет текста
    outline: "none",
  };

  const taskListStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginTop: "15px",
  };

  const taskItemStyle = (completed: boolean) => ({
    display: "flex",
    alignItems: "center",
    padding: "15px",
    background: completed ? "#f8fff8" : "#F8F8FF",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    position: "relative" as const,
    borderLeft: "4px solid #8A2BE2",
  });

  // Функция для перевода архетипов
  const getArchetypeLabel = (archetype: string = "") => {
    const archetypes: Record<string, string> = {
      productive: "📈 Продуктивный",
      balanced: "⚖️ Сбалансированный",
      recovery: "🔄 Восстанавливающий",
    };
    return archetypes[archetype] || archetype;
  };

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ ДЛЯ ЗАДАЧ С ДАТОЙ
  const handleAddTask = () => {
    if (!taskInput.trim()) {
      alert("Пожалуйста, введите описание задачи");
      return;
    }

    // Правильно вычисляем timeEstimate
    let calculatedTimeEstimate: number | undefined = undefined;
    if (startTime && endTime) {
      const startMinutes =
        parseInt(startTime.split(":")[0]) * 60 +
        parseInt(startTime.split(":")[1]);
      const endMinutes =
        parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
      calculatedTimeEstimate = endMinutes - startMinutes;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskInput.trim(),
      description: "",
      completed: false,
      priority: "medium",
      date: selectedDate.toISOString().split("T")[0],
      timeEstimate: calculatedTimeEstimate,
      category: taskSphere,
      createdAt: new Date().toISOString(),
      // ДОБАВЛЯЕМ НОВЫЕ ПОЛЯ:
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      repeat: taskRepeat || undefined,
      alarm: taskAlarm || undefined,
      archetype: archetype || undefined, // ← ДОБАВЛЯЕМ АРХЕТИП
    };

    setTasks([...tasks, newTask]);

    // Сброс формы
    setTaskInput("");
    setStartTime("");
    setEndTime("");
    setTaskRepeat("");
    setTaskAlarm("");
  };

  // ИСПРАВЛЕННАЯ ФУНКЦИЯ ДЛЯ ЗАДАЧ БЕЗ ДАТЫ
  const handleAddTaskWithoutDate = () => {
    if (!taskInput.trim()) {
      alert("Пожалуйста, введите описание задачи");
      return;
    }

    // Правильно вычисляем timeEstimate
    let calculatedTimeEstimate: number | undefined = undefined;
    if (startTime && endTime) {
      const startMinutes =
        parseInt(startTime.split(":")[0]) * 60 +
        parseInt(startTime.split(":")[1]);
      const endMinutes =
        parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
      calculatedTimeEstimate = endMinutes - startMinutes;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskInput.trim(),
      description: "",
      completed: false,
      priority: "medium",
      date: "", // Пустая строка для задач без даты
      timeEstimate: calculatedTimeEstimate,
      category: taskSphere,
      createdAt: new Date().toISOString(),
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      repeat: taskRepeat || undefined,
      alarm: taskAlarm || undefined,
      archetype: archetype || undefined, // ← ДОБАВЛЯЕМ АРХЕТИП
    };

    setTasks([...tasks, newTask]);

    // Сброс формы
    setTaskInput("");
    setStartTime("");
    setEndTime("");
    setTaskRepeat("");
    setTaskAlarm("");
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Удалить эту задачу?")) {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newTitle = prompt("Редактировать задачу:", task.title);
      if (newTitle !== null && newTitle.trim()) {
        const updatedTasks = tasks.map((t) =>
          t.id === taskId ? { ...t, title: newTitle.trim() } : t
        );
        setTasks(updatedTasks);
      }
    }
  };

  // Фильтрация задач
  const getTodayTasks = () => {
    const today = selectedDate.toISOString().split("T")[0];
    return tasks.filter((task) => task.date === today);
  };

  const getFutureTasks = () => {
    const today = selectedDate.toISOString().split("T")[0];
    return tasks.filter((task) => task.date > today);
  };

  const getTasksWithoutDate = () => {
    return tasks.filter((task) => !task.date || task.date === "");
  };

  const todayTasks = getTodayTasks();
  const futureTasks = getFutureTasks();
  const tasksWithoutDate = getTasksWithoutDate();

  // Автоформатирование времени
  const handleTimeInput = (value: string, setter: (value: string) => void) => {
    let formattedValue = value.replace(/\D/g, "");
    if (formattedValue.length >= 2) {
      formattedValue =
        formattedValue.substring(0, 2) + ":" + formattedValue.substring(2, 4);
    }
    setter(formattedValue);
  };

  // Валидация времени
  const validateTime = (time: string) => {
    if (!time) return true;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Функция для перевода категорий
  const getCategoryLabel = (category: string = "") => {
    const categories: Record<string, string> = {
      health: "Здоровье",
      career: "Карьера",
      family: "Семья",
      finance: "Финансы",
      development: "Развитие",
      hobby: "Хобби",
    };
    return categories[category] || category;
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: isMobile ? "15px" : "20px",
        padding: isMobile ? "15px" : "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "100%",
        boxSizing: "border-box" as const,
        overflow: "hidden" as const,
      }}
    >
      <h2 style={sectionTitleStyle}>Планирование Дня</h2>

      {/* Секция архетипов - ТОЧНО КАК В МАКЕТЕ */}
      <div style={archetypeSectionStyle}>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: isMobile ? "1.1rem" : "1.3rem",
          }}
        >
          Выберите тип дня
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: isMobile ? "0.8rem" : "1rem",
            color: "#666",
            lineHeight: 1.4,
          }}
        >
          Выберите архетип, который лучше всего соответствует вашему состоянию и
          задачам на сегодня
        </p>

        <div style={archetypeSelectorStyle}>
          {/* ПРОДУКТИВНЫЙ - как в макете */}
          <div
            style={archetypeOptionStyle(archetype === "productive")}
            onClick={() => setArchetype("productive")}
          >
            <div style={archetypeBadgeStyle}>📈 ПРОДУКТИВНЫЙ</div>
            <span
              style={{
                fontSize: isMobile ? "2rem" : "3.5rem",
                marginBottom: isMobile ? "8px" : "15px",
              }}
            >
              💼
            </span>
            <div
              style={{
                fontSize: isMobile ? "0.75rem" : "0.9rem",
                opacity: 0.9,
                marginBottom: isMobile ? "8px" : "15px",
                lineHeight: 1.4,
              }}
            >
              Сфокусируйтесь на важных задачах и достижении целей. Идеально для
              рабочих дней и проектов.
            </div>
          </div>

          {/* СБАЛАНСИРОВАННЫЙ - как в макете */}
          <div
            style={archetypeOptionStyle(archetype === "balanced")}
            onClick={() => setArchetype("balanced")}
          >
            <div style={archetypeBadgeStyle}>⚖️ СБАЛАНСИРОВАННЫЙ</div>
            <span
              style={{
                fontSize: isMobile ? "2rem" : "3.5rem",
                marginBottom: isMobile ? "8px" : "15px",
              }}
            >
              🌟
            </span>
            <div
              style={{
                fontSize: isMobile ? "0.75rem" : "0.9rem",
                opacity: 0.9,
                marginBottom: isMobile ? "8px" : "15px",
                lineHeight: 1.4,
              }}
            >
              Равномерное распределение энергии между работой, отдыхом и личными
              делами.
            </div>
          </div>

          {/* ВОССТАНАВЛИВАЮЩИЙ - как в макете */}
          <div
            style={archetypeOptionStyle(archetype === "recovery")}
            onClick={() => setArchetype("recovery")}
          >
            <div style={archetypeBadgeStyle}>🔄 ВОССТАНАВЛИВАЮЩИЙ</div>
            <span
              style={{
                fontSize: isMobile ? "2rem" : "3.5rem",
                marginBottom: isMobile ? "8px" : "15px",
              }}
            >
              🛌
            </span>
            <div
              style={{
                fontSize: isMobile ? "0.75rem" : "0.9rem",
                opacity: 0.9,
                marginBottom: isMobile ? "8px" : "15px",
                lineHeight: 1.4,
              }}
            >
              День для отдыха, восстановления сил и заботы о себе. Минимум
              обязательств.
            </div>
          </div>
        </div>
      </div>

      {/* Форма добавления задачи - ИСПРАВЛЕННЫЙ ВВОД */}
      <div style={taskFormStyle}>
        <input
          type="text"
          style={taskInputStyle}
          placeholder="Опишите вашу задачу..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
        />
        <button style={btnStyle} onClick={handleAddTask}>
          <span>➕</span> Добавить
        </button>
      </div>

      {/* Опции задачи */}
      <div style={taskOptionsStyle}>
        <div style={optionGroupStyle}>
          <div style={optionLabelStyle}>Сфера жизни</div>
          <select
            style={optionSelectStyle}
            value={taskSphere}
            onChange={(e) => setTaskSphere(e.target.value)}
          >
            <option value="health">Здоровье</option>
            <option value="career">Карьера</option>
            <option value="family">Семья</option>
            <option value="finance">Финансы</option>
            <option value="development">Развитие</option>
            <option value="hobby">Хобби</option>
          </select>
        </div>

        <div style={optionGroupStyle}>
          <div style={optionLabelStyle}>Время выполнения</div>
          <div
            style={{
              display: "flex",
              gap: isMobile ? "5px" : "10px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <input
              type="text"
              style={{
                ...optionSelectStyle,
                width: isMobile ? "70px" : "100px",
                textAlign: "center",
                padding: isMobile ? "8px" : "10px",
                borderColor: validateTime(startTime) ? "#E0E0E0" : "#ff4444",
              }}
              placeholder="09:00"
              maxLength={5}
              value={startTime}
              onChange={(e) => handleTimeInput(e.target.value, setStartTime)}
            />
            <span
              style={{
                fontWeight: "bold",
                color: "#696969",
                fontSize: isMobile ? "0.8rem" : "1rem",
              }}
            >
              —
            </span>
            <input
              type="text"
              style={{
                ...optionSelectStyle,
                width: isMobile ? "70px" : "100px",
                textAlign: "center",
                padding: isMobile ? "8px" : "10px",
                borderColor: validateTime(endTime) ? "#E0E0E0" : "#ff4444",
              }}
              placeholder="10:30"
              maxLength={5}
              value={endTime}
              onChange={(e) => handleTimeInput(e.target.value, setEndTime)}
            />
          </div>
          <div
            style={{
              fontSize: isMobile ? "0.7rem" : "0.8rem",
              color: "#696969",
              textAlign: "center",
            }}
          >
            Формат: ЧЧ:MM
          </div>
        </div>

        <div style={optionGroupStyle}>
          <div style={optionLabelStyle}>Повторение</div>
          <select
            style={optionSelectStyle}
            value={taskRepeat}
            onChange={(e) => setTaskRepeat(e.target.value)}
          >
            <option value="">Без повторения</option>
            <option value="daily">Ежедневно</option>
            <option value="weekly">Еженедельно</option>
            <option value="monthly">Ежемесячно</option>
          </select>
        </div>

        <div style={optionGroupStyle}>
          <div style={optionLabelStyle}>Будильник</div>
          <select
            style={optionSelectStyle}
            value={taskAlarm}
            onChange={(e) => setTaskAlarm(e.target.value)}
          >
            <option value="">Без будильника</option>
            <option value="5">За 5 минут</option>
            <option value="15">За 15 минут</option>
            <option value="30">За 30 минут</option>
            <option value="60">За 1 час</option>
          </select>
        </div>
      </div>

      {/* Выбор даты */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          alignItems: "center",
          flexWrap: "wrap" as const,
        }}
      >
        <div style={optionGroupStyle}>
          <div style={optionLabelStyle}>Дата выполнения:</div>
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            style={optionSelectStyle}
          />
        </div>
        <button
          style={{
            ...btnStyle,
            background: "transparent",
            border: "2px solid #8A2BE2",
            color: "#8A2BE2",
            marginTop: "20px",
          }}
          onClick={handleAddTaskWithoutDate} // ИСПРАВЛЕНО: используем отдельную функцию
        >
          <span>⏳</span> Без даты
        </button>
      </div>

      {/* Списки задач */}
      <div style={{ marginTop: "30px" }}>
        {/* Задачи на сегодня */}
        <h3 style={{ color: "#8A2BE2", marginBottom: "15px" }}>
          📅 Задачи на сегодня ({todayTasks.length})
        </h3>
        <div style={taskListStyle}>
          {todayTasks.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#999",
                fontStyle: "italic",
                padding: "20px",
              }}
            >
              На сегодня задач нет. Добавьте первую задачу!
            </p>
          ) : (
            todayTasks.map((task) => (
              <div key={task.id} style={taskItemStyle(task.completed)}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "12px",
                    accentColor: "#8A2BE2",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#999" : "#333",
                      fontSize: isMobile ? "0.9rem" : "1rem",
                    }}
                  >
                    {task.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      marginTop: "4px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap" as const,
                    }}
                  >
                    {/* ИСПРАВЛЕНО: ДОБАВЛЯЕМ АРХЕТИП */}
                    {task.archetype && (
                      <span>🧩 {getArchetypeLabel(task.archetype)}</span>
                    )}
                    <span>🏷️ {getCategoryLabel(task.category)}</span>
                    {task.startTime && task.endTime && (
                      <span>
                        ⏰ {task.startTime}-{task.endTime}
                      </span>
                    )}
                    {task.repeat && <span>🔄 {task.repeat}</span>}
                    {task.alarm && (
                      <span>⏰ Напомнить за {task.alarm} мин</span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEditTask(task.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8A2BE2",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff4444",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Будущие задачи */}
        <h3
          style={{ color: "#8A2BE2", marginBottom: "15px", marginTop: "30px" }}
        >
          📋 Будущие задачи ({futureTasks.length})
        </h3>
        <div style={taskListStyle}>
          {futureTasks.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#999",
                fontStyle: "italic",
                padding: "20px",
              }}
            >
              Будущих задач нет
            </p>
          ) : (
            futureTasks.map((task) => (
              <div key={task.id} style={taskItemStyle(task.completed)}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "12px",
                    accentColor: "#8A2BE2",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#999" : "#333",
                    }}
                  >
                    {task.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      marginTop: "4px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap" as const,
                    }}
                  >
                    {/* ИСПРАВЛЕНО: ДОБАВЛЯЕМ АРХЕТИП */}
                    {task.archetype && (
                      <span>🧩 {getArchetypeLabel(task.archetype)}</span>
                    )}
                    <span>🏷️ {getCategoryLabel(task.category)}</span>
                    <span>
                      📅 {new Date(task.date).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4444",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Задачи без даты */}
        <h3
          style={{ color: "#8A2BE2", marginBottom: "15px", marginTop: "30px" }}
        >
          ⏳ Задачи без даты ({tasksWithoutDate.length})
        </h3>
        <div style={taskListStyle}>
          {tasksWithoutDate.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#999",
                fontStyle: "italic",
                padding: "20px",
              }}
            >
              Задач без даты нет
            </p>
          ) : (
            tasksWithoutDate.map((task) => (
              <div key={task.id} style={taskItemStyle(task.completed)}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "12px",
                    accentColor: "#8A2BE2",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#999" : "#333",
                    }}
                  >
                    {task.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      marginTop: "4px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap" as const,
                    }}
                  >
                    {/* ИСПРАВЛЕНО: ДОБАВЛЯЕМ АРХЕТИП */}
                    {task.archetype && (
                      <span>🧩 {getArchetypeLabel(task.archetype)}</span>
                    )}
                    <span>🏷️ {getCategoryLabel(task.category)}</span>
                    {task.startTime && task.endTime && (
                      <span>
                        ⏰ {task.startTime}-{task.endTime}
                      </span>
                    )}
                    {task.repeat && <span>🔄 {task.repeat}</span>}
                    {task.alarm && (
                      <span>⏰ Напомнить за {task.alarm} мин</span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEditTask(task.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8A2BE2",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff4444",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export { PlanningTab };
