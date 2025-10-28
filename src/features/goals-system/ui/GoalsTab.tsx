import React, { useState } from "react";
import { Goal, GoalStep } from "../../../types";

interface GoalsTabProps {
  isMobile: boolean;
  settings: any;
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
}

const GoalsTab: React.FC<GoalsTabProps> = ({
  isMobile,
  settings,
  goals,
  setGoals,
}) => {
  const [goalInput, setGoalInput] = useState("");

  // Стили из макета
  const sectionTitleStyle = {
    fontSize: isMobile ? "1.5rem" : "1.8rem",
    marginBottom: "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const goalsContainerStyle = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
    marginBottom: "30px",
  };

  const goalCardStyle = {
    background: "#F8F8FF",
    borderRadius: "20px",
    padding: "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "all 0.4s ease",
    position: "relative" as const,
    overflow: "hidden" as const,
  };

  const goalTitleStyle = {
    fontSize: "1.4rem",
    marginBottom: "15px",
    color: "#2F2F4F",
  };

  const progressBarStyle = {
    height: "10px",
    background: "#e0e0e0",
    borderRadius: "5px",
    overflow: "hidden" as const,
    marginBottom: "8px",
  };

  const progressFillStyle = (progress: number) => ({
    height: "100%",
    background: "linear-gradient(to right, #8A2BE2, #9370DB)",
    borderRadius: "5px",
    width: `${progress}%`,
    transition: "width 0.5s ease",
  });

  const taskFormStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
    gap: "15px",
    marginBottom: "30px",
  };

  const taskInputStyle = {
    padding: "15px",
    border: "1px solid #F8F8FF",
    borderRadius: "15px",
    fontSize: "1rem",
    background: "#F8F8FF",
    transition: "all 0.3s ease",
  };

  const btnStyle = {
    padding: "15px 25px",
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    border: "none",
    borderRadius: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const stepsContainerStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  };

  const stepItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: "white",
    borderRadius: "10px",
  };

  const addGoal = () => {
    const goalText = goalInput.trim();
    if (goalText) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: goalText,
        description: "",
        completed: false,
        priority: "medium",
        category: "general",
        steps: [],
        createdAt: new Date().toISOString(),
      };
      setGoals([...goals, newGoal]);
      setGoalInput("");
    }
  };

  const addStepToGoal = (goalId: string, stepText: string) => {
    if (stepText.trim()) {
      const newStep: GoalStep = {
        id: Date.now().toString(),
        title: stepText.trim(),
        completed: false,
      };

      const updatedGoals = goals.map((goal) =>
        goal.id === goalId ? { ...goal, steps: [...goal.steps, newStep] } : goal
      );
      setGoals(updatedGoals);
    }
  };

  const toggleStepCompletion = (goalId: string, stepId: string) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === goalId) {
        const updatedSteps = goal.steps.map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        return { ...goal, steps: updatedSteps };
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  const getGoalProgress = (goal: Goal) => {
    if (goal.steps.length === 0) return 0;
    const completedSteps = goal.steps.filter((step) => step.completed).length;
    return (completedSteps / goal.steps.length) * 100;
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: isMobile ? "20px" : "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={sectionTitleStyle}>Мои Цели</h2>

      {/* Список целей */}
      <div style={goalsContainerStyle}>
        {goals.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#666",
              gridColumn: "1 / -1",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎯</div>
            <h3 style={{ margin: "0 0 10px 0" }}>Цели еще не добавлены</h3>
            <p>Добавьте первую цель используя форму ниже</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = getGoalProgress(goal);
            const completedSteps = goal.steps.filter(
              (step) => step.completed
            ).length;

            return (
              <div key={goal.id} style={goalCardStyle}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "linear-gradient(to right, #8A2BE2, #9370DB)",
                  }}
                />

                <div style={goalTitleStyle}>{goal.title}</div>

                {/* Прогресс */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={progressBarStyle}>
                    <div style={progressFillStyle(progress)}></div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#696969",
                      textAlign: "right",
                    }}
                  >
                    {completedSteps} из {goal.steps.length} шагов
                  </div>
                </div>

                {/* Шаги цели */}
                <div style={stepsContainerStyle}>
                  {goal.steps.map((step) => (
                    <div key={step.id} style={stepItemStyle}>
                      <input
                        type="checkbox"
                        style={{
                          width: "20px",
                          height: "20px",
                          accentColor: "#32CD32",
                        }}
                        checked={step.completed}
                        onChange={() => toggleStepCompletion(goal.id, step.id)}
                      />
                      <span
                        style={{
                          textDecoration: step.completed
                            ? "line-through"
                            : "none",
                          opacity: step.completed ? 0.7 : 1,
                        }}
                      >
                        {step.title}
                      </span>
                    </div>
                  ))}

                  {/* Форма добавления шага */}
                  <div style={{ marginTop: "15px" }}>
                    <input
                      type="text"
                      style={{
                        ...taskInputStyle,
                        marginBottom: "10px",
                        padding: "10px",
                      }}
                      placeholder="Добавить шаг..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addStepToGoal(
                            goal.id,
                            (e.target as HTMLInputElement).value
                          );
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                    <button
                      style={{
                        ...btnStyle,
                        padding: "8px 15px",
                        background:
                          "linear-gradient(to right, #9370DB, #BA55D3)",
                      }}
                      onClick={(e) => {
                        const input = (e.target as HTMLButtonElement)
                          .previousSibling as HTMLInputElement;
                        addStepToGoal(goal.id, input.value);
                        input.value = "";
                      }}
                    >
                      <span>➕</span> Добавить шаг
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Форма добавления цели */}
      <div>
        <h3 style={{ marginBottom: "15px" }}>Добавить новую цель</h3>
        <div style={taskFormStyle}>
          <input
            type="text"
            style={taskInputStyle}
            placeholder="Опишите вашу цель..."
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addGoal();
              }
            }}
          />
          <button style={btnStyle} onClick={addGoal}>
            <span>🎯</span> Добавить цель
          </button>
        </div>
      </div>
    </div>
  );
};

export { GoalsTab };
