import React from "react";
import { Task } from "../../../shared/types";

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  isMobile: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  isMobile,
}) => {
  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "неизвестно";
    }
  };

  // Функция для перевода архетипов
  const getArchetypeLabel = (archetype: string = "") => {
    const archetypes: Record<string, string> = {
      productive: "📈 Продуктивный",
      balanced: "⚖️ Сбалансированный",
      recovery: "🔄 Восстанавливающий",
    };
    return archetypes[archetype] || archetype;
  };

  // Функция для русских названий сфер жизни
  const getSphereName = (sphere: string = "") => {
    const spheres: Record<string, string> = {
      health: "❤️ Здоровье",
      career: "💼 Карьера",
      family: "👨‍👩‍👧‍👦 Семья",
      finance: "💰 Финансы",
      development: "📚 Развитие",
      hobby: "🎨 Хобби",
    };
    return spheres[sphere] || sphere;
  };

  if (tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#666",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📝</div>
        <h3 style={{ margin: "0 0 10px 0" }}>Нет задач на этот день</h3>
        <p>Добавьте первую задачу используя форму выше</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: isMobile ? "15px" : "20px",
          borderBottom: "1px solid #eee",
          background: "#f8f9fa",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#333",
            fontSize: isMobile ? "1.1rem" : "1.3rem",
          }}
        >
          📋 Задачи на день ({tasks.length})
        </h3>
      </div>

      <div>
        {tasks.map((task, index) => (
          <div
            key={task.id}
            style={{
              padding: isMobile ? "15px" : "20px",
              borderBottom:
                index < tasks.length - 1 ? "1px solid #f0f0f0" : "none",
              background: task.completed ? "#f8fff8" : "white",
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              transition: "background 0.3s ease",
            }}
          >
            {/* Чекбокс выполнения */}
            <button
              onClick={() => onToggleTask(task.id)}
              style={{
                width: "24px",
                height: "24px",
                border: `2px solid ${task.completed ? "#44aa44" : "#ccc"}`,
                background: task.completed ? "#44aa44" : "white",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              {task.completed && (
                <span style={{ color: "white", fontSize: "14px" }}>✓</span>
              )}
            </button>

            {/* Информация о задаче */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    color: task.completed ? "#888" : "#333",
                    textDecoration: task.completed ? "line-through" : "none",
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    wordBreak: "break-word",
                  }}
                >
                  {task.title}
                </h4>
              </div>

              {task.description && (
                <p
                  style={{
                    margin: "0 0 8px 0",
                    color: task.completed ? "#999" : "#666",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {task.description}
                </p>
              )}

              {/* Мета-информация */}
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "center",
                  flexWrap: "wrap",
                  fontSize: "12px",
                  color: "#888",
                }}
              >
                {task.archetype && (
                  <span>🧩 {getArchetypeLabel(task.archetype)}</span>
                )}
                {task.timeEstimate && <span>⏱️ {task.timeEstimate} мин</span>}
                {task.category && <span>{getSphereName(task.category)}</span>}
                {task.startTime && task.endTime && (
                  <span>
                    🕒 {task.startTime} - {task.endTime}
                  </span>
                )}
                <span>📅 {formatTime(task.createdAt)}</span>
              </div>
            </div>

            {/* Кнопки действий */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              {!task.completed && (
                <button
                  onClick={() => {
                    const newTitle = prompt(
                      "Редактировать задачу:",
                      task.title
                    );
                    if (newTitle !== null && newTitle.trim()) {
                      onUpdateTask(task.id, { title: newTitle.trim() });
                    }
                  }}
                  style={{
                    padding: "6px 10px",
                    border: "1px solid #8A2BE2",
                    background: "white",
                    color: "#8A2BE2",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  ✏️
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm("Удалить эту задачу?")) {
                    onDeleteTask(task.id);
                  }
                }}
                style={{
                  padding: "6px 10px",
                  border: "1px solid #ff4444",
                  background: "white",
                  color: "#ff4444",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
