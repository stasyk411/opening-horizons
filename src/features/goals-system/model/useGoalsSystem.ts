import { useState } from "react";
import { Goal, GoalStep, CreateGoalData } from "../../../shared/types/goals";

export const useGoalsSystem = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = (goalData: CreateGoalData) => {
    const newGoal: Goal = {
      ...goalData,
      id: Date.now().toString(),
      progress: 0,
      createdAt: new Date(),
      isCompleted: false,
      steps: goalData.steps.map((step, index) => ({
        ...step,
        id: `${Date.now()}-step-${index}`,
        completed: false,
      })),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const toggleStep = (goalId: string, stepId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedSteps = goal.steps.map((step) =>
            step.id === stepId ? { ...step, completed: !step.completed } : step
          );

          const completedSteps = updatedSteps.filter(
            (step) => step.completed
          ).length;
          const progress = Math.round(
            (completedSteps / updatedSteps.length) * 100
          );
          const isCompleted = progress === 100;

          return {
            ...goal,
            steps: updatedSteps,
            progress,
            isCompleted,
          };
        }
        return goal;
      })
    );
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal))
    );
  };

  return {
    goals,
    addGoal,
    toggleStep,
    deleteGoal,
    updateGoal,
  };
};
