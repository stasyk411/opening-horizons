import React from 'react';
import { GoalsList } from './GoalsList';
import { GoalForm } from './GoalForm';
import { useGoalsSystem } from '../model/useGoalsSystem';

interface GoalsTabProps {
  isMobile: boolean;
  settings: any;
  goals: any[];
  setGoals: (goals: any[]) => void;
}

export const GoalsTab: React.FC<GoalsTabProps> = ({ isMobile, settings, goals, setGoals }) => {
  const {
    newGoal,
    setNewGoal,
    addGoal,
    deleteGoal,
    toggleGoal,
    editGoal,
    editingGoal,
    setEditingGoal,
    saveGoal,
  } = useGoalsSystem(goals, setGoals);

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '100%', 
      overflowX: 'hidden' 
    }}>
      <h2 style={{ 
        color: '#8a2be2', 
        marginBottom: '20px', 
        fontSize: '2em',
        textAlign: 'left'
      }}>
        Цели
      </h2>
      
      <GoalForm 
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        addGoal={addGoal}
        isMobile={isMobile}
      />
      
      <GoalsList
        goals={goals}
        deleteGoal={deleteGoal}
        toggleGoal={toggleGoal}
        editGoal={editGoal}
        editingGoal={editingGoal}
        setEditingGoal={setEditingGoal}
        saveGoal={saveGoal}
        isMobile={isMobile}
      />
    </div>
  );
};

