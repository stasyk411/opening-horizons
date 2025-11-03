import React, { useState } from "react";
import { Task } from "../../../shared/types";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { AccordionSection } from "./AccordionSection";
import { ArchetypeSection } from "./ArchetypeSection";

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
  const [archetype, setArchetype] = useState("");

  // 🔄 АККОРДЕОНЫ
  const [expandedSections, setExpandedSections] = useState({
    archetypes: false,
    basic: true,
    tasks: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // ОБРАБОТЧИКИ ЗАДАЧ
  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archetype: archetype || undefined,
    };
    setTasks([...tasks, newTask]);
  };

  const handleAddTaskWithoutDate = () => {
    const taskTitle = prompt("Опишите задачу без даты:");
    if (taskTitle && taskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle.trim(),
        description: "",
        completed: false,
        priority: "medium",
        // СТАЛО:
        date: new Date().toISOString().split("T")[0], // Формат YYYY-MM-DD
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archetype: archetype || undefined,
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Удалить эту задачу?")) {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    }
  };

  const handleToggleTask = (taskId: string) => {
    handleUpdateTask(taskId, {
      completed: !tasks.find((t) => t.id === taskId)?.completed,
    });
  };

  // ФИЛЬТРАЦИЯ ЗАДАЧ
  const getTodayTasks = () => {
    const today = selectedDate.toISOString().split("T")[0];
    return tasks.filter((task) => task.date === today);
  };

  const getFutureTasks = () => {
    const today = selectedDate.toISOString().split("T")[0];
    return tasks.filter((task) => task.date && task.date > today);
  };

  const getTasksWithoutDate = () => {
    return tasks.filter((task) => !task.date || task.date === "");
  };

  const todayTasks = getTodayTasks();
  const futureTasks = getFutureTasks();
  const tasksWithoutDate = getTasksWithoutDate();

  // СТИЛИ
  const sectionTitleStyle = {
    fontSize: isMobile ? "1.3rem" : "1.8rem",
    marginBottom: isMobile ? "15px" : "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const containerStyle = {
    background: "white",
    borderRadius: isMobile ? "15px" : "20px",
    padding: isMobile ? "15px" : "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
  };

  return (
    <div style={containerStyle}>
      <h2 style={sectionTitleStyle}>Планирование Дня</h2>

      {/* 🔄 СЕКЦИЯ АРХЕТИПОВ */}
      <AccordionSection
        title="🎭 Тип дня"
        isExpanded={expandedSections.archetypes}
        onToggle={() => toggleSection("archetypes")}
        isMobile={isMobile}
      >
        <ArchetypeSection
          archetype={archetype}
          setArchetype={setArchetype}
          isMobile={isMobile}
        />
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            background: archetype ? "rgba(138, 43, 226, 0.05)" : "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ fontSize: "14px", color: "#696969", marginBottom: "5px" }}
          >
            Текущий архетип:
          </div>
          <div
            style={{
              fontSize: "16px",
              color: archetype ? "#8A2BE2" : "#999",
              fontWeight: archetype ? 600 : "normal",
            }}
          >
            {archetype
              ? archetype === "productive"
                ? "📈 Продуктивный"
                : archetype === "balanced"
                ? "⚖️ Сбалансированный"
                : "🔄 Восстанавливающий"
              : "Не выбран"}
          </div>
        </div>
      </AccordionSection>

      {/* 🔄 НОВАЯ ЗАДАЧА */}
      <AccordionSection
        title="📝 Новая задача"
        isExpanded={expandedSections.basic}
        onToggle={() => toggleSection("basic")}
        isMobile={isMobile}
      >
        <TaskForm
          onSubmit={handleAddTask}
          selectedDate={selectedDate}
          isMobile={isMobile}
          onWithoutDate={handleAddTaskWithoutDate}
        />
      </AccordionSection>

      {/* 🔄 ЗАДАЧИ */}
      <AccordionSection
        title="⏰ Задачи"
        isExpanded={expandedSections.tasks}
        onToggle={() => toggleSection("tasks")}
        isMobile={isMobile}
      >
        {/* ЗАДАЧИ НА СЕГОДНЯ */}
        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              color: "#8A2BE2",
              marginBottom: "15px",
              fontSize: "1.1rem",
            }}
          >
            📅 Задачи на сегодня ({todayTasks.length})
          </h3>
          <TaskList
            tasks={todayTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            isMobile={isMobile}
          />
        </div>

        {/* БУДУЩИЕ ЗАДАЧИ */}
        <div style={{ marginBottom: "25px" }}>
          <h3
            style={{
              color: "#8A2BE2",
              marginBottom: "15px",
              fontSize: "1.1rem",
            }}
          >
            📋 Будущие задачи ({futureTasks.length})
          </h3>
          <TaskList
            tasks={futureTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            isMobile={isMobile}
          />
        </div>

        {/* ЗАДАЧИ БЕЗ ДАТЫ */}
        <div>
          <h3
            style={{
              color: "#8A2BE2",
              marginBottom: "15px",
              fontSize: "1.1rem",
            }}
          >
            ⏳ Задачи без даты ({tasksWithoutDate.length})
          </h3>
          <TaskList
            tasks={tasksWithoutDate}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            isMobile={isMobile}
          />
        </div>
      </AccordionSection>
    </div>
  );
};

export { PlanningTab };
