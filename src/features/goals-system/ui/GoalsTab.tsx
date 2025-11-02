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
        priority: goalData.priority || "medium", // < ДОБАВЛЕНО
        category: goalData.category || "general", // < ДОБАВЛЕНО
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

  const sectionTitleStyle = {
    fontSize: "1.8rem",
    marginBottom: "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const containerStyle = {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  };

  return (
    <div style={containerStyle}>
      <h2 style={sectionTitleStyle}>?? Система Целей</h2>

      {/* Статистика */}
      <GoalStats stats={stats} />

      {/* Фильтры */}
      <GoalFilters
        currentFilter={filter}
        onFilterChange={setFilter}
        onAddGoal={() => setShowGoalForm(true)}
      />

      {/* Сообщение об ошибке */}
      {errorMessage && (
        <div
          style={{
            background: "#ff4444",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
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

      {goals.length === 0 && !showGoalForm && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#666",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>??</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
            У вас пока нет целей
          </h3>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            Начните с создания первой цели!
            <br />
            Разбейте большие цели на маленькие шаги для лучшего прогресса.
          </p>
        </div>
      )}
    </div>
  );
};

export { GoalsTab };







