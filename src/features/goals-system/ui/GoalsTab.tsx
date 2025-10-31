import React, { useState, useEffect } from "react";
import { Goal, GoalStep } from "../../../types";

const GoalsTab: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newStepTitle, setNewStepTitle] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Загрузка целей
  useEffect(() => {
    const loadGoals = () => {
      try {
        const stored = localStorage.getItem("life-wheel-goals");
        if (stored) {
          const parsedData = JSON.parse(stored);
          setGoals(parsedData);
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

  // Показать ошибку на 3 секунды
  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  // Создание новой цели
  const handleCreateGoal = () => {
    if (!newGoalTitle.trim()) {
      showError("Введите название цели");
      return;
    }

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: newGoalTitle.trim(),
      description: newGoalDescription.trim(),
      completed: false,
      steps: [],
      createdAt: new Date().toISOString(),
      priority: "medium",
      category: "general",
    };

    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);

    // Сброс формы
    setNewGoalTitle("");
    setNewGoalDescription("");
  };

  // Добавление шага к цели
  const handleAddStep = (goalId: string) => {
    if (!newStepTitle.trim()) {
      showError("Введите название шага");
      return;
    }

    const newStep: GoalStep = {
      id: crypto.randomUUID(),
      title: newStepTitle.trim(),
      completed: false,
    };

    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, steps: [...goal.steps, newStep] } : goal
    );

    saveGoals(updatedGoals);
    setNewStepTitle("");
  };

  // Переключение выполнения шага
  const handleToggleStep = (goalId: string, stepId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedSteps = goal.steps.map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );

        return {
          ...goal,
          steps: updatedSteps,
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);
  };

  // 🔥 ОСНОВНАЯ ЛОГИКА: Переключение выполнения цели
  const handleToggleGoal = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    // 🔄 ВОЗОБНОВЛЕНИЕ - всегда разрешено
    if (goal.completed) {
      const updatedGoals = goals.map((g) =>
        g.id === goalId ? { ...g, completed: false, completedAt: undefined } : g
      );
      saveGoals(updatedGoals);
      return;
    }

    // ✅ ЗАВЕРШЕНИЕ - проверяем шаги
    const hasSteps = goal.steps.length > 0;
    const allStepsCompleted = hasSteps
      ? goal.steps.every((s) => s.completed)
      : true;

    if (!allStepsCompleted) {
      // 🚫 Нельзя завершить - показываем сообщение
      showError(
        `Нельзя завершить цель! Выполните все шаги (${
          goal.steps.filter((s) => !s.completed).length
        } осталось)`
      );
      return;
    }

    // ✅ Можно завершить
    const updatedGoals = goals.map((g) =>
      g.id === goalId
        ? { ...g, completed: true, completedAt: new Date().toISOString() }
        : g
    );
    saveGoals(updatedGoals);
  };

  // Удаление цели
  const handleDeleteGoal = (goalId: string) => {
    if (!confirm("Удалить эту цель?")) return;

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

  // Получить текст для кнопки цели
  const getGoalButtonText = (goal: Goal): string => {
    return goal.completed ? "Возобновить" : "Завершить";
  };

  // Получить цвет для кнопки цели
  const getGoalButtonColor = (goal: Goal): string => {
    if (goal.completed) return "#696969"; // Серый для возобновления

    const canComplete =
      goal.steps.length === 0 || goal.steps.every((s) => s.completed);
    return canComplete ? "#32CD32" : "#FFA500"; // Зеленый или оранжевый
  };

  // Получить подсказку для кнопки
  const getGoalButtonTooltip = (goal: Goal): string => {
    if (goal.completed) return "Возобновить цель";

    const incompleteSteps = goal.steps.filter((s) => !s.completed).length;
    if (incompleteSteps > 0) {
      return `Завершите все шаги (осталось: ${incompleteSteps})`;
    }
    return "Завершить цель";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 className="section-title">🎯 Мои Цели</h2>

      {/* Блок ошибок */}
      {errorMessage && (
        <div
          style={{
            backgroundColor: "#FF4500",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Форма создания цели */}
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{ fontSize: "18px", marginBottom: "12px", color: "#2F2F4F" }}
        >
          Добавить новую цель
        </h3>
        <div className="task-form">
          <input
            type="text"
            className="task-input"
            placeholder="Опишите вашу цель..."
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateGoal()}
          />
          <button className="btn" onClick={handleCreateGoal}>
            <span>🎯</span> Добавить цель
          </button>
        </div>

        <div style={{ marginTop: "12px" }}>
          <textarea
            placeholder="Описание цели (необязательно)"
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            className="answer-input"
            style={{ minHeight: "60px" }}
          />
        </div>
      </div>

      {/* Список целей в виде карточек */}
      <div className="goals-container">
        {goals.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#696969",
              padding: "40px 20px",
              gridColumn: "1 / -1",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🎯</div>
            <h3
              style={{
                color: "#696969",
                marginBottom: "8px",
                fontSize: "16px",
              }}
            >
              Цели еще не добавлены
            </h3>
            <p style={{ fontSize: "14px" }}>Создайте свою первую цель выше</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal);
            const completedSteps = goal.steps.filter(
              (step) => step.completed
            ).length;
            const incompleteSteps = goal.steps.filter(
              (step) => !step.completed
            ).length;

            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-title">
                  {goal.title}
                  {goal.completed && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        backgroundColor: "#32CD32",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        marginLeft: "8px",
                        border: "1px solid #228B22",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      ✓ Завершена
                    </span>
                  )}
                </div>

                {goal.description && (
                  <p
                    style={{
                      color: "#696969",
                      marginBottom: "15px",
                      fontSize: "0.85rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {goal.description}
                  </p>
                )}

                {/* Прогресс-бар */}
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {completedSteps} из {goal.steps.length} шагов
                    {incompleteSteps > 0 && ` (осталось: ${incompleteSteps})`}
                  </div>
                </div>

                {/* Список шагов */}
                <div className="steps-container">
                  {goal.steps.map((step) => (
                    <div key={step.id} className="step-item">
                      <input
                        type="checkbox"
                        className="step-checkbox"
                        checked={step.completed}
                        onChange={() => handleToggleStep(goal.id, step.id)}
                      />
                      <span
                        style={{
                          flex: 1,
                          textDecoration: step.completed
                            ? "line-through"
                            : "none",
                          color: step.completed ? "#696969" : "#2F2F4F",
                          fontSize: "13px",
                        }}
                      >
                        {step.title}
                      </span>
                      <button
                        onClick={() => handleDeleteStep(goal.id, step.id)}
                        className="action-btn"
                        style={{ fontSize: "0.9rem" }}
                        title="Удалить шаг"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                {/* Форма добавления шага */}
                <div style={{ marginTop: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "12px",
                      alignItems: "stretch",
                    }}
                  >
                    <input
                      type="text"
                      className="task-input"
                      placeholder="Добавить шаг..."
                      value={selectedGoalId === goal.id ? newStepTitle : ""}
                      onChange={(e) => setNewStepTitle(e.target.value)}
                      onFocus={() => setSelectedGoalId(goal.id)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddStep(goal.id)
                      }
                      style={{
                        flex: "1 1 auto",
                        padding: "10px",
                        minWidth: "0",
                        fontSize: "13px",
                      }}
                    />
                    <button
                      onClick={() => handleAddStep(goal.id)}
                      disabled={!newStepTitle.trim()}
                      style={{
                        backgroundColor: newStepTitle.trim()
                          ? "transparent"
                          : "#ccc",
                        border: "2px solid #8A2BE2",
                        color: newStepTitle.trim() ? "#8A2BE2" : "#666",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        fontWeight: "600",
                        cursor: newStepTitle.trim() ? "pointer" : "not-allowed",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.8rem",
                      }}
                      onMouseEnter={(e) => {
                        if (newStepTitle.trim()) {
                          e.currentTarget.style.background = "#8A2BE2";
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (newStepTitle.trim()) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#8A2BE2";
                        }
                      }}
                    >
                      <span>➕</span> Добавить
                    </button>
                  </div>

                  {/* Кнопки управления целью */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={() => handleToggleGoal(goal.id)}
                      className="btn"
                      style={{
                        backgroundColor: getGoalButtonColor(goal),
                        flex: 1,
                        padding: "10px 16px",
                        fontSize: "13px",
                      }}
                      title={getGoalButtonTooltip(goal)}
                    >
                      <span>{goal.completed ? "↶" : "✓"}</span>
                      {getGoalButtonText(goal)}
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="btn"
                      style={{
                        backgroundColor: "#FF4500",
                        padding: "10px 16px",
                        fontSize: "13px",
                      }}
                      title="Удалить цель"
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .section-title {
          font-size: 1.6rem;
          margin-bottom: 20px;
          color: #8A2BE2;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .section-title::after {
          content: "";
          flex: 1;
          height: 2px;
          background: linear-gradient(to right, #8A2BE2, transparent);
          margin-left: 12px;
        }
        
        .task-form {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          margin-bottom: 12px;
        }
        
        .task-input {
          padding: 12px;
          border: 1px solid #F8F8FF;
          border-radius: 12px;
          font-size: 14px;
          background: #F8F8FF;
          transition: all 0.3s ease;
        }
        
        .task-input:focus {
          outline: none;
          border-color: #9370DB;
          box-shadow: 0 0 0 3px rgba(147, 112, 219, 0.2);
        }
        
        .btn {
          padding: 12px 20px;
          background: linear-gradient(to right, #8A2BE2, #4B0082);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-outline {
          background: transparent;
          border: 2px solid #8A2BE2;
          color: #8A2BE2;
        }
        
        .btn-outline:hover {
          background: #8A2BE2;
          color: white;
        }
        
        .answer-input {
          padding: 12px;
          border: 1px solid #F8F8FF;
          border-radius: 12px;
          font-size: 14px;
          min-height: 60px;
          resize: vertical;
          background: #F8F8FF;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .answer-input:focus {
          outline: none;
          border-color: #9370DB;
          box-shadow: 0 0 0 3px rgba(147, 112, 219, 0.2);
        }
        
        .goals-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        
        .goal-card {
          background: #F8F8FF;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .goal-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #8A2BE2, #9370DB);
        }
        
        .goal-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }
        
        .goal-title {
          font-size: 1.2rem;
          margin-bottom: 12px;
          color: #2F2F4F;
          font-weight: bold;
          display: flex;
          align-items: center;
          line-height: 1.3;
        }
        
        .goal-progress {
          margin-bottom: 15px;
        }
        
        .progress-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(to right, #8A2BE2, #9370DB);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        .progress-text {
          font-size: 0.8rem;
          color: #696969;
          text-align: right;
        }
        
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
        }
        
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: white;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .step-item:hover {
          background: #f8f8ff;
        }
        
        .step-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #32CD32;
          cursor: pointer;
        }
        
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          color: #696969;
          transition: all 0.3s ease;
          padding: 4px;
          border-radius: 4px;
        }
        
        .action-btn:hover {
          color: #FF4500;
          background: rgba(255, 69, 0, 0.1);
        }
        
        @media (max-width: 768px) {
          .goals-container {
            grid-template-columns: 1fr;
          }
          
          .task-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default GoalsTab;
