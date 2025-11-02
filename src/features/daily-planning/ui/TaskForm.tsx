import React, { useState } from "react";
import { Task } from "../../../shared/types"; // ← ИСПРАВЛЕННЫЙ ИМПОРТ

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
      date: selectedDate.toISOString().split("T")[0], // ← ИСПРАВЛЕНО: только дата
      completed: false,
    });

    // Сброс формы
    setTitle("");
    setDescription("");
    setPriority("medium");
    setTimeEstimate(30);
    setCategory("");
  };

  // Остальной код без изменений...
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
      {/* ... остальной JSX без изменений */}
    </form>
  );
};
