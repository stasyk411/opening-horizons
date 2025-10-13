import React from "react";
import { Task } from "../../../shared/types";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Пока нет задач для этой сферы
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center gap-3 p-4 border rounded-lg ${
            task.completed
              ? "bg-gray-50 border-gray-200"
              : "bg-white border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
            className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
          />
          <span
            className={`flex-1 ${
              task.completed ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {task.title}
          </span>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
          >
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
};
