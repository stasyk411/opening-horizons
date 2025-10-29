// 📝 ПОЛНЫЙ ФАЙЛ features/goals-system/ui/GoalsTab.tsx:

import React, { useState, useEffect } from "react";
import { Goal, GoalStep } from "../../../types";
import { useGoalValidation } from "../hooks/useGoalValidation";
import { validateStoredGoal } from "../../../validation";

const GoalsTab: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [newGoalPriority, setNewGoalPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [newGoalCategory, setNewGoalCategory] = useState("");
  const [newStepTitle, setNewStepTitle] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const {
    errors,
    validateGoalForm,
    validateStepForm,
    clearErrors,
    getFieldError,
    hasErrors,
  } = useGoalValidation();

  // Загрузка целей с валидацией
  useEffect(() => {
    const loadGoals = () => {
      try {
        const stored = localStorage.getItem("life-wheel-goals");
        if (stored) {
          const parsedData = JSON.parse(stored);
          const validatedGoals = parsedData
            .map((goal: any) => validateStoredGoal(goal))
            .filter(Boolean) as Goal[];
          setGoals(validatedGoals);
        }
      } catch (error) {
        console.error("Ошибка загрузки целей:", error);
        setGoals([]);
      }
    };

    loadGoals();
  }, []);

  // Сохранение целей
  const saveGoals = (updatedGoals: Goal[]) => {
    try {
      localStorage.setItem("life-wheel-goals", JSON.stringify(updatedGoals));
      setGoals(updatedGoals);
    } catch (error) {
      console.error("Ошибка сохранения целей:", error);
    }
  };

  // Создание новой цели
  const handleCreateGoal = () => {
    clearErrors();

    const goalData: Partial<Goal> = {
      title: newGoalTitle,
      description: newGoalDescription,
      deadline: newGoalDeadline || undefined,
      priority: newGoalPriority,
      category: newGoalCategory,
      completed: false,
      steps: [],
      createdAt: new Date().toISOString(),
    };

    const validation = validateGoalForm(goalData);

    if (validation.isValid && validation.data) {
      const newGoal: Goal = {
        ...validation.data,
        id: crypto.randomUUID(),
      };

      const updatedGoals = [...goals, newGoal];
      saveGoals(updatedGoals);

      // Сброс формы
      setNewGoalTitle("");
      setNewGoalDescription("");
      setNewGoalDeadline("");
      setNewGoalPriority("medium");
      setNewGoalCategory("");
    }
  };

  // Добавление шага к цели
  const handleAddStep = (goalId: string) => {
    if (!newStepTitle.trim()) return;

    const stepData: Partial<GoalStep> = {
      title: newStepTitle,
      completed: false,
    };

    const validation = validateStepForm(stepData);

    if (validation.isValid && validation.data) {
      const newStep: GoalStep = {
        ...validation.data,
        id: crypto.randomUUID(),
      };

      const updatedGoals = goals.map((goal) =>
        goal.id === goalId ? { ...goal, steps: [...goal.steps, newStep] } : goal
      );

      saveGoals(updatedGoals);
      setNewStepTitle("");
    }
  };

  // Переключение выполнения шага
  const handleToggleStep = (goalId: string, stepId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedSteps = goal.steps.map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );

        // Автоматически проверяем, можно ли завершить цель
        const allStepsCompleted = updatedSteps.every((step) => step.completed);

        return {
          ...goal,
          steps: updatedSteps,
          completed: allStepsCompleted ? true : goal.completed,
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
  };

  // Переключение выполнения цели
  const handleToggleGoal = (goalId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const newCompleted = !goal.completed;

        // Если пытаемся завершить цель, проверяем шаги
        if (newCompleted && goal.steps.some((step) => !step.completed)) {
          // Не позволяем завершить цель с незавершенными шагами
          return goal;
        }

        return { ...goal, completed: newCompleted };
      }
      return goal;
    });

    saveGoals(updatedGoals);
  };

  // Удаление цели
  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  // Удаление шага
  const handleDeleteStep = (goalId: string, stepId: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? { ...goal, steps: goal.steps.filter((step) => step.id !== stepId) }
        : goal
    );
    saveGoals(updatedGoals);
  };

  // Расчет прогресса цели
  const calculateProgress = (goal: Goal): number => {
    if (goal.steps.length === 0) return goal.completed ? 100 : 0;
    const completedSteps = goal.steps.filter((step) => step.completed).length;
    return Math.round((completedSteps / goal.steps.length) * 100);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>🎯 Система Целей</h2>

      {/* Форма создания цели */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Создать новую цель</h3>

        {/* Поле названия */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Название цели *"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                getFieldError("title") ? "#dc3545" : "#ccc"
              }`,
              borderRadius: "4px",
            }}
          />
          {getFieldError("title") && (
            <div
              style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}
            >
              {getFieldError("title")}
            </div>
          )}
        </div>

        {/* Поле описания */}
        <div style={{ marginBottom: "15px" }}>
          <textarea
            placeholder="Описание цели"
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                getFieldError("description") ? "#dc3545" : "#ccc"
              }`,
              borderRadius: "4px",
              minHeight: "60px",
            }}
          />
          {getFieldError("description") && (
            <div
              style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}
            >
              {getFieldError("description")}
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          {/* Поле дедлайна */}
          <div>
            <input
              type="date"
              placeholder="Дедлайн"
              value={newGoalDeadline}
              onChange={(e) => setNewGoalDeadline(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${
                  getFieldError("deadline") ? "#dc3545" : "#ccc"
                }`,
                borderRadius: "4px",
              }}
            />
            {getFieldError("deadline") && (
              <div
                style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}
              >
                {getFieldError("deadline")}
              </div>
            )}
          </div>

          {/* Поле приоритета */}
          <div>
            <select
              value={newGoalPriority}
              onChange={(e) =>
                setNewGoalPriority(e.target.value as "low" | "medium" | "high")
              }
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${
                  getFieldError("priority") ? "#dc3545" : "#ccc"
                }`,
                borderRadius: "4px",
              }}
            >
              <option value="low">Низкий приоритет</option>
              <option value="medium">Средний приоритет</option>
              <option value="high">Высокий приоритет</option>
            </select>
            {getFieldError("priority") && (
              <div
                style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}
              >
                {getFieldError("priority")}
              </div>
            )}
          </div>
        </div>

        {/* Поле категории */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Категория *"
            value={newGoalCategory}
            onChange={(e) => setNewGoalCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${
                getFieldError("category") ? "#dc3545" : "#ccc"
              }`,
              borderRadius: "4px",
            }}
          />
          {getFieldError("category") && (
            <div
              style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}
            >
              {getFieldError("category")}
            </div>
          )}
        </div>

        <button
          onClick={handleCreateGoal}
          disabled={hasErrors()}
          style={{
            backgroundColor: hasErrors() ? "#6c757d" : "#8A2BE2",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: hasErrors() ? "not-allowed" : "pointer",
          }}
        >
          Создать цель
        </button>
      </div>

      {/* Список целей */}
      <div>
        <h3>Мои цели ({goals.length})</h3>

        {goals.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
            У вас пока нет целей. Создайте первую цель!
          </p>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: goal.completed ? "#f8fff8" : "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: "0 0 5px 0",
                      textDecoration: goal.completed ? "line-through" : "none",
                      color: goal.completed ? "#666" : "#333",
                    }}
                  >
                    {goal.title}
                  </h4>

                  {goal.description && (
                    <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                      {goal.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "10px",
                    }}
                  >
                    <span>Приоритет: {goal.priority}</span>
                    <span>Категория: {goal.category}</span>
                    {goal.deadline && (
                      <span>
                        До:{" "}
                        {new Date(goal.deadline).toLocaleDateString("ru-RU")}
                      </span>
                    )}
                  </div>

                  {/* Прогресс-бар */}
                  {goal.steps.length > 0 && (
                    <div style={{ marginBottom: "10px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                          marginBottom: "5px",
                        }}
                      >
                        <span>Прогресс:</span>
                        <span>{calculateProgress(goal)}%</span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#e9ecef",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${calculateProgress(goal)}%`,
                            height: "100%",
                            backgroundColor:
                              calculateProgress(goal) === 100
                                ? "#28a745"
                                : "#8A2BE2",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Список шагов */}
                  {goal.steps.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <strong>Шаги:</strong>
                      {goal.steps.map((step) => (
                        <div
                          key={step.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "5px 0",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={step.completed}
                            onChange={() => handleToggleStep(goal.id, step.id)}
                          />
                          <span
                            style={{
                              flex: 1,
                              textDecoration: step.completed
                                ? "line-through"
                                : "none",
                              color: step.completed ? "#666" : "#333",
                            }}
                          >
                            {step.title}
                          </span>
                          <button
                            onClick={() => handleDeleteStep(goal.id, step.id)}
                            style={{
                              color: "#dc3545",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Форма добавления шага */}
                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                  >
                    <input
                      type="text"
                      placeholder="Добавить шаг..."
                      value={selectedGoalId === goal.id ? newStepTitle : ""}
                      onChange={(e) => setNewStepTitle(e.target.value)}
                      onFocus={() => setSelectedGoalId(goal.id)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    />
                    <button
                      onClick={() => handleAddStep(goal.id)}
                      disabled={!newStepTitle.trim()}
                      style={{
                        backgroundColor: newStepTitle.trim()
                          ? "#8A2BE2"
                          : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 15px",
                        cursor: newStepTitle.trim() ? "pointer" : "not-allowed",
                      }}
                    >
                      Добавить
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <button
                    onClick={() => handleToggleGoal(goal.id)}
                    style={{
                      backgroundColor: goal.completed ? "#6c757d" : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    {goal.completed ? "Возобновить" : "Завершить"}
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalsTab;
