import React from "react";
import { Task, LifeSphere } from "../../../shared/types";

interface UncompletedTasksProps {
  tasks: Task[];
  getSphereById: (sphereId: string) => LifeSphere | undefined;
  onMoveToTomorrow: (taskId: string) => void;
  onRemove: (taskId: string) => void;
}

export const UncompletedTasks: React.FC<UncompletedTasksProps> = ({
  tasks,
  getSphereById,
  onMoveToTomorrow,
  onRemove,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-green-600 mb-2">
          Все задачи выполнены!
        </h3>
        <p className="text-gray-600">
          Отличная работа! Можно отдохнуть с чистой совестью.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        🌅 Невыполненные задачи сегодня
      </h3>

      <div className="space-y-3">
        {tasks.map((task) => {
          const sphere = getSphereById(task.category || "");

          return (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {sphere && (
                    <span
                      className="text-xs px-2 py-1 rounded border"
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
                <span className="text-gray-800">{task.title}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onMoveToTomorrow(task.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                  title="Перенести на завтра"
                >
                  📅
                </button>
                <button
                  onClick={() => onRemove(task.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  title="Удалить задачу"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
