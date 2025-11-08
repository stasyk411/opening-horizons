import React, { useState } from "react";
import { Task } from "../../../shared/types";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt">) => void;
  selectedDate: Date;
  isMobile: boolean;
  onWithoutDate: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  selectedDate,
  isMobile,
  onWithoutDate,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState("");
  const [alarm, setAlarm] = useState("");
  const [taskDate, setTaskDate] = useState(
    selectedDate.toISOString().split("T")[0]
  );

  // 🔥 ФУНКЦИЯ СБРОСА ФОРМЫ
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(""); // ✅ Сбрасываем к пустому значению
    setStartTime("");
    setEndTime("");
    setRepeat("");
    setAlarm("");
    setTaskDate(selectedDate.toISOString().split("T")[0]); // ✅ Сбрасываем к текущей дате
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    // Валидация времени
    if (startTime && endTime && startTime >= endTime) {
      alert("Время начала не может быть больше времени окончания");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || undefined,
      date: taskDate || new Date().toISOString().split("T")[0],
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      repeat: repeat || undefined,
      alarm: alarm || undefined,
      completed: false,
      priority: "medium",
    });

    // ✅ ПОЛНЫЙ СБРОС ФОРМЫ
    resetForm();
  };

  // 🔥 ОБРАБОТЧИК ДЛЯ КНОПКИ "БЕЗ ДАТЫ"
  const handleWithoutDate = () => {
    onWithoutDate();
    // ✅ СБРАСЫВАЕМ ФОРМУ ПОСЛЕ СОЗДАНИЯ ЗАДАЧИ БЕЗ ДАТЫ
    // (сброс произойдет в handleAddTaskWithoutDate в PlanningTab)
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
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          id="task-title"
          name="taskTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Опишите вашу задачу..."
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            fontSize: "16px",
          }}
          required
        />
      </div>

      {/* Дата выполнения */}
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="task-date"
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Дата выполнения:
        </label>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="date"
            id="task-date"
            name="taskDate"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              background: "white",
            }}
          />
          <button
            type="button"
            onClick={handleWithoutDate}
            style={{
              padding: "8px 12px",
              border: "2px solid #8A2BE2",
              background: "transparent",
              color: "#8A2BE2",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            ⏳ Без даты
          </button>
        </div>
      </div>

      {/* Расширенные поля */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
        {/* Время начала */}
        <div>
          <label
            htmlFor="task-start-time"
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Время начала
          </label>
          <input
            type="time"
            id="task-start-time"
            name="taskStartTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
            }}
          />
        </div>

        {/* Время окончания */}
        <div>
          <label
            htmlFor="task-end-time"
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Время окончания
          </label>
          <input
            type="time"
            id="task-end-time"
            name="taskEndTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "15px",
          marginBottom: "15px",
        }}
      >
        {/* Повторение */}
        <div>
          <label
            htmlFor="task-repeat"
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Повторение
          </label>
          <select
            id="task-repeat"
            name="taskRepeat"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              background: "white",
            }}
          >
            <option value="">Без повторения</option>
            <option value="daily">Ежедневно</option>
            <option value="weekly">Еженедельно</option>
            <option value="monthly">Ежемесячно</option>
          </select>
        </div>

        {/* Будильник */}
        <div>
          <label
            htmlFor="task-alarm"
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Будильник
          </label>
          <select
            id="task-alarm"
            name="taskAlarm"
            value={alarm}
            onChange={(e) => setAlarm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              background: "white",
            }}
          >
            <option value="">Без будильника</option>
            <option value="5">За 5 минут</option>
            <option value="15">За 15 минут</option>
            <option value="30">За 30 минут</option>
            <option value="60">За 1 час</option>
          </select>
        </div>
      </div>

      {/* Сфера жизни */}
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="task-category"
          style={{
            display: "block",
            marginBottom: "5px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Сфера жизни
        </label>
        <select
          id="task-category"
          name="taskCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            background: "white",
          }}
        >
          <option value="">Выберите сферу</option>
          <option value="health">Здоровье</option>
          <option value="career">Карьера</option>
          <option value="family">Семья</option>
          <option value="finance">Финансы</option>
          <option value="development">Развитие</option>
          <option value="hobby">Хобби</option>
        </select>
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          background: "linear-gradient(to right, #8A2BE2, #4B0082)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Добавить задачу
      </button>
    </form>
  );
};
