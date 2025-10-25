import { useState, useEffect } from 'react';

export interface GoalStep {
  id: number;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: number;
  text: string;
  steps: GoalStep[];
  createdAt: string;
}

export const useGoalsSystem = (externalGoals?: Goal[], externalSetGoals?: (goals: Goal[]) => void) => {
  const [goals, setGoals] = useState<Goal[]>(externalGoals || []);
  const [newGoal, setNewGoal] = useState({ text: '', category: 'personal' });
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Синхронизация с внешним состоянием
  useEffect(() => {
    if (externalGoals) {
      setGoals(externalGoals);
    }
  }, [externalGoals]);

  const addGoal = () => {
    if (!newGoal.text.trim()) {
      alert('Введите текст цели!');
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      text: newGoal.text,
      steps: [],
      createdAt: new Date().toISOString(),
    };

    const updatedGoals = [...goals, goal];
    
    if (externalSetGoals) {
      externalSetGoals(updatedGoals);
    } else {
      setGoals(updatedGoals);
    }
    
    setNewGoal({ text: '', category: 'personal' });
  };

  const deleteGoal = (goalId: number) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    
    if (externalSetGoals) {
      externalSetGoals(updatedGoals);
    } else {
      setGoals(updatedGoals);
    }
  };

  const toggleGoal = (goalId: number) => {
    // Implementation for toggling goal completion
  };

  const editGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };

  const saveGoal = (updatedGoal: Goal) => {
    const updatedGoals = goals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    
    if (externalSetGoals) {
      externalSetGoals(updatedGoals);
    } else {
      setGoals(updatedGoals);
    }
    
    setEditingGoal(null);
  };

  return {
    goals,
    setGoals,
    newGoal,
    setNewGoal,
    addGoal,
    deleteGoal,
    toggleGoal,
    editGoal,
    editingGoal,
    setEditingGoal,
    saveGoal,
  };
};
