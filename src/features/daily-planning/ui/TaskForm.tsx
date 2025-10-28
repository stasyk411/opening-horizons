import React, { useState } from "react";
import { Task } from "../../../types";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  selectedDate: Date;
  isMobile: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  selectedDate,
  isMobile,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [timeEstimate, setTimeEstimate] = useState<number>(30);
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      timeEstimate,
      category: category.trim() || undefined,
      date: selectedDate.toISOString(),
      completed: false,
    });

    // Сброс формы
    setTitle("");
    setDescription("");
    setPriority("medium");
    setTimeEstimate(30);
    setCategory("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "white",
        padding: isMobile ? "15px" : "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px",
      }}
    >
      <h3
        style={{
          margin: "0 0 15px 0",
          color: "#8A2BE2",
          fontSize: isMobile ? "1.1rem" : "1.3rem",
        }}
      >
        ➕ Добавить задачу
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Название задачи */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Задача *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Что нужно сделать?"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Описание */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Дополнительные детали..."
            rows={3}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />
        </div>

        {/* Приоритет и время */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "15px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Приоритет
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                background: "white",
              }}
            >
              <option value="low">🔵 Низкий</option>
              <option value="medium">🟡 Средний</option>
              <option value="high">🔴 Высокий</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Время (мин)
            </label>
            <input
              type="number"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(Number(e.target.value))}
              min="5"
              max="480"
              step="5"
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        {/* Категория */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Категория
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Работа, Личное, Здоровье..."
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>

        {/* Кнопка добавления */}
        <button
          type="submit"
          disabled={!title.trim()}
          style={{
            background: title.trim() ? "#8A2BE2" : "#ccc",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: title.trim() ? "pointer" : "not-allowed",
            transition: "background 0.3s ease",
          }}
        >
          ✅ Добавить задачу
        </button>
      </div>
    </form>
  );
};
