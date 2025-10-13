import React from "react";
import { Goal } from "../../../shared/types/goals";

interface GoalItemProps {
  goal: Goal;
  onToggleStep: (goalId: string, stepId: string) => void;
  onDelete: (goalId: string) => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onToggleStep,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      {/* Заголовок и прогресс */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{goal.title}</h3>
          {goal.description && (
            <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {goal.sphere}
            </span>
            <span className="text-xs text-gray-500">
              {goal.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(goal.id)}
          className="text-red-500 hover:text-red-700 text-lg"
        >
          ×
        </button>
      </div>

      {/* Прогресс-бар */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Прогресс</span>
          <span>{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Список шагов */}
      <div className="space-y-2">
        {goal.steps.map((step) => (
          <div
            key={step.id}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
          >
            <input
              type="checkbox"
              checked={step.completed}
              onChange={() => onToggleStep(goal.id, step.id)}
              className="w-4 h-4 text-blue-500 rounded"
            />
            <span
              className={`flex-1 ${
                step.completed ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              {step.title}
            </span>
            <span className="text-xs text-gray-400">{step.order + 1}</span>
          </div>
        ))}
      </div>

      {/* Статус */}
      {goal.isCompleted && (
        <div className="mt-3 text-center">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            🎉 Цель достигнута!
          </span>
        </div>
      )}
    </div>
  );
};
