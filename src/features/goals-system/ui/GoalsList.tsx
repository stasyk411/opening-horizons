import React, { useState } from "react";
import { Goal, CreateGoalData } from "../../../shared/types"; // ← ИСПРАВЛЕННЫЙ ИМПОРТ
import { GoalForm } from "./GoalForm";
import { GoalItem } from "./GoalItem";

interface GoalsListProps {
  goals: Goal[];
  onAddGoal: (goalData: CreateGoalData) => void;
  onToggleStep: (goalId: string, stepId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  onAddGoal,
  onToggleStep,
  onDeleteGoal,
}) => {
  const [showForm, setShowForm] = useState(false);

  // 🔽 ИСПРАВЛЯЕМ ФИЛЬТРАЦИЮ - используем completed вместо isCompleted
  const activeGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  return (
    <div className="p-4 space-y-6">
      {/* Заголовок и кнопка добавления */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Мои цели</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600"
        >
          + Новая цель
        </button>
      </div>

      {/* Форма добавления цели */}
      {showForm && (
        <GoalForm
          onSubmit={(goalData) => {
            onAddGoal(goalData);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Активные цели */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Активные цели ({activeGoals.length})
        </h3>
        <div className="space-y-4">
          {activeGoals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Нет активных целей</p>
              <p className="text-sm">Создайте свою первую цель!</p>
            </div>
          ) : (
            activeGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onToggleStep={onToggleStep}
                onDelete={onDeleteGoal}
              />
            ))
          )}
        </div>
      </div>

      {/* Завершенные цели */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            🎉 Завершенные цели ({completedGoals.length})
          </h3>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onToggleStep={onToggleStep}
                onDelete={onDeleteGoal}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
