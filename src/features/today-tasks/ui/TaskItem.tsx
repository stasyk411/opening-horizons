import React from "react";
import { Task, LifeSphere } from "../../../shared/types";

interface TaskItemProps {
  task: Task;
  sphere?: LifeSphere;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  sphere,
  onToggle,
  onDelete,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className={`flex items-center gap-4 p-4 border rounded-lg ${
        task.completed
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-300"
      }`}
    >
      {/* Чекбокс выполнения */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
      />

      {/* Контент задачи */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span
            className={`text-sm px-2 py-1 rounded border ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority === "high"
              ? "🔥 Высокий"
              : task.priority === "medium"
              ? "⚡ Средний"
              : "💤 Низкий"}
          </span>
          {sphere && (
            <span
              className="text-sm px-2 py-1 rounded border"
              style={{
                backgroundColor: `${sphere.color}20`,
                borderColor: sphere.color,
                color: sphere.color,
              }}
            >
              {sphere.icon} {sphere.name}
            </span>
          )}
        </div>

        <span
          className={`block ${
            task.completed ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {task.title}
        </span>
      </div>

      {/* Кнопка удаления */}
      <button
        onClick={() => onDelete(task.id)}
        className="px-3 py-1 text-red-500 hover:bg-red-50 rounded transition-colors"
        title="Удалить задачу"
      >
        🗑️
      </button>
    </div>
  );
};
