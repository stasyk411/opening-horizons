import React from 'react';
import { Reflection } from '../../types';

interface ReflectionTabProps {
  reflections: Reflection[];
  saveReflections: (reflections: Reflection[]) => void;
  settings: { archetype: string };
  isMobile: boolean;
}

const ReflectionTab: React.FC<ReflectionTabProps> = ({
  reflections,
  saveReflections,
  settings,
  isMobile
}) => {
  return (
    <div style={{ padding: isMobile ? '15px' : '20px' }}>
      <h2 style={{ color: '#8A2BE2', marginBottom: '20px' }}>
        📝 Вечерний Анализ
      </h2>
      <p>Функционал анализа будет добавлен позже.</p>
      <p>Анализов: {reflections.length}</p>
    </div>
  );
};

export { ReflectionTab };
