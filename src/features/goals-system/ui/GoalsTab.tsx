import React from 'react';
import { Goal } from '../../../types';

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
  setGoals
}) => {
  return (
    <div style={{ padding: isMobile ? '15px' : '20px' }}>
      <h2 style={{ color: '#8A2BE2', marginBottom: '20px' }}>
        🎯 Система целей
      </h2>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px' 
      }}>
        <p>Цели: {goals.length}</p>
        <p>Архетип: {settings.archetype}</p>
        <div style={{ marginTop: '20px' }}>
          <button
            style={{
              background: '#8A2BE2',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            onClick={() => {
              const newGoal: Goal = {
                id: Date.now(),
                text: 'Новая цель',
                steps: [],
                createdAt: new Date().toISOString()
              };
              setGoals([...goals, newGoal]);
            }}
          >
            + Добавить цель
          </button>
        </div>
      </div>
    </div>
  );
};

export { GoalsTab };
