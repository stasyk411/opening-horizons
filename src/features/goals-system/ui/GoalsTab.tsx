import React, { useState, useEffect } from "react";
import { Goal, GoalStep } from "../../../shared/types";
import { GoalForm } from "./GoalForm";
import { GoalsList } from "./GoalsList";
import { GoalFilters } from "./GoalFilters";
import { GoalStats } from "./GoalStats";

const GoalsTab: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Загрузка целей из localStorage
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    try {
      const stored = localStorage.getItem("life-wheel-goals");
      if (stored) {
        const parsedData = JSON.parse(stored);
        setGoals(Array.isArray(parsedData) ? parsedData : []);
      }
    } catch (error) {
      console.error("Error loading goals:", error);
      setGoals([]);
    }
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    try {
      setGoals(updatedGoals);
      localStorage.setItem("life-wheel-goals", JSON.stringify(updatedGoals));
    } catch (error) {
      console.error("Error saving goals:", error);
      showError("Ошибка при сохранении целей");
    }
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Обработчики целей
  const handleAddGoal = (goalData: any) => {
    try {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: goalData.title,
        description: goalData.description || "",
        sphere: goalData.sphere || "personal",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deadline: goalData.deadline,
        completed: false,
        priority: goalData.priority || "medium",
        category: goalData.category || "general",
        steps:
          goalData.steps?.map((step: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            title: step.title,
            isCompleted: false,
            order: index,
            deadline: step.deadline,
          })) || [],
      };

      const updatedGoals = [...goals, newGoal];
      saveGoals(updatedGoals);
      setShowGoalForm(false);
    } catch (error) {
      showError("Ошибка при создании цели");
    }
  };

  const handleToggleStep = (goalId: string, stepId: string) => {
    try {
      const updatedGoals = goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedSteps = goal.steps.map((step) =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );

          // Пересчет прогресса
          const completedSteps = updatedSteps.filter(
            (step) => step.completed
          ).length;
          const progress =
            goal.steps.length > 0
              ? Math.round((completedSteps / goal.steps.length) * 100)
              : 0;
          const isCompleted = progress === 100;

          return {
            ...goal,
            steps: updatedSteps,
            progress,
            completed: isCompleted,
            isCompleted,
            updatedAt: new Date().toISOString(),
          };
        }
        return goal;
      });

      saveGoals(updatedGoals);
    } catch (error) {
      showError("Ошибка при обновлении шага");
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    try {
      if (confirm("Удалить эту цель?")) {
        const updatedGoals = goals.filter((goal) => goal.id !== goalId);
        saveGoals(updatedGoals);
      }
    } catch (error) {
      showError("Ошибка при удалении цели");
    }
  };

  const handleToggleGoal = (goalId: string) => {
    try {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;

      const hasSteps = goal.steps.length > 0;
      let updatedGoals: Goal[];

      if (hasSteps) {
        // Для целей с шагами - переключаем все шаги
        const allStepsCompleted = goal.steps.every((step) => step.completed);
        updatedGoals = goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                steps: g.steps.map((step) => ({
                  ...step,
                  completed: !allStepsCompleted,
                })),
                progress: !allStepsCompleted ? 100 : 0,
                completed: !allStepsCompleted,
                isCompleted: !allStepsCompleted,
                updatedAt: new Date().toISOString(),
              }
            : g
        );
      } else {
        // Для целей без шагов - просто переключаем completed
        updatedGoals = goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                completed: !g.completed,
                isCompleted: !g.completed,
                progress: !g.completed ? 100 : 0,
                updatedAt: new Date().toISOString(),
              }
            : g
        );
      }

      saveGoals(updatedGoals);
    } catch (error) {
      showError("Ошибка при обновлении цели");
    }
  };

  // Фильтрация целей
  const filteredGoals = goals.filter((goal) => {
    switch (filter) {
      case "active":
        return !goal.completed;
      case "completed":
        return goal.completed;
      default:
        return true;
    }
  });

  // Статистика
  const stats = {
    total: goals.length,
    completed: goals.filter((g) => g.completed).length,
    active: goals.filter((g) => !g.completed).length,
    progress:
      goals.length > 0
        ? Math.round(
            (goals.filter((g) => g.completed).length / goals.length) * 100
          )
        : 0,
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 mx-2 sm:mx-0 shadow-lg">
      {/* Заголовок с responsive стилями */}
      <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4 sm:mb-6 flex items-center gap-3">
        🎯 Система Целей
      </h2>

      {/* Статистика */}
      <GoalStats stats={stats} />

      {/* Фильтры */}
      <GoalFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        onAddGoal={() => setShowGoalForm(true)}
      />

      {/* Сообщение об ошибке с Tailwind */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-5 text-center mx-2 sm:mx-0">
          {errorMessage}
        </div>
      )}

      {/* Форма создания цели */}
      {showGoalForm && (
        <GoalForm
          onSubmit={handleAddGoal}
          onCancel={() => setShowGoalForm(false)}
        />
      )}

      {/* Список целей */}
      <GoalsList
        goals={filteredGoals}
        onAddGoal={handleAddGoal}
        onToggleStep={handleToggleStep}
        onDeleteGoal={handleDeleteGoal}
      />

      {/* Empty state с responsive стилями */}
      {goals.length === 0 && !showGoalForm && (
        <div className="text-center p-6 sm:p-8 md:p-10 text-gray-600 mx-2 sm:mx-0">
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-5">🎯</div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-800">
            У вас пока нет целей
          </h3>
          <p className="text-base sm:text-lg leading-relaxed">
            Начните с создания первой цели!
            <br className="hidden sm:block" />
            Разбейте большие цели на маленькие шаги для лучшего прогресса.
          </p>
        </div>
      )}
    </div>
  );
};

export { GoalsTab };
