import React from 'react';
import { Task } from '../../../types';

interface PlanningTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  settings: any;
  saveSettings: (settings: any) => void;
  isMobile: boolean;
}

const PlanningTab: React.FC<PlanningTabProps> = ({
  tasks,
  setTasks,
  settings,
  saveSettings,
  isMobile
}) => {
  return (
    <div style={{ padding: isMobile ? '15px' : '20px' }}>
      <h2 style={{ color: '#8A2BE2', marginBottom: '20px' }}>
        🗓️ Планирование дня
      </h2>
      <p>Функционал планирования дня будет добавлен позже.</p>
      <p>Задачи: {tasks.length}</p>
    </div>
  );
};

export { PlanningTab };

