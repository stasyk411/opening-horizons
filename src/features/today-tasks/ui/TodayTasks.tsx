import React from "react";
import { Task } from "../../../shared/types";

interface TodayTasksProps {
  tasks: Task[];
  spheres: any[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TodayTasks: React.FC<TodayTasksProps> = ({
  tasks,
  spheres,
  onToggleTask,
  onDeleteTask,
}) => {
  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.createdAt);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Задачи на сегодня
      </h2>

      {todayTasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          На сегодня задач нет
        </div>
      ) : (
        <div className="space-y-3">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                task.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div
                    className={`font-medium ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-sm text-gray-600">
                      {task.description}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getSphereColor(
                        task.sphere
                      )}`}
                    >
                      {getSphereName(task.sphere, spheres)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority === "high"
                        ? "🔥 Высокий"
                        : task.priority === "medium"
                        ? "⚡ Средний"
                        : "💤 Низкий"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Вспомогательные функции
const getSphereColor = (sphere: string) => {
  const colors: Record<string, string> = {
    health: "bg-green-100 text-green-800",
    career: "bg-blue-100 text-blue-800",
    finance: "bg-yellow-100 text-yellow-800",
    education: "bg-purple-100 text-purple-800",
    relationships: "bg-pink-100 text-pink-800",
    hobbies: "bg-indigo-100 text-indigo-800",
    spirituality: "bg-teal-100 text-teal-800",
    environment: "bg-orange-100 text-orange-800",
    general: "bg-gray-100 text-gray-800",
  };
  return colors[sphere] || colors.general;
};

const getSphereName = (sphere: string, spheres: any[]) => {
  const sphereMap: Record<string, string> = {
    health: "Здоровье",
    career: "Карьера",
    finance: "Финансы",
    education: "Образование",
    relationships: "Отношения",
    hobbies: "Хобби",
    spirituality: "Духовность",
    environment: "Окружение",
    general: "Общее",
  };

  const foundSphere = spheres.find((s) => s.id === sphere);
  return foundSphere?.name || sphereMap[sphere] || sphere;
};

const getPriorityColor = (priority: string) => {
  const colors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};
