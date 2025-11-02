// ВСТАВЬ ЭТОТ КОД В GoalStats.tsx:

import React from "react";

interface GoalStatsProps {
  stats: {
    total: number;
    completed: number;
    active: number;
    progress: number;
  };
}

export const GoalStats: React.FC<GoalStatsProps> = ({ stats }) => {
  const statsContainerStyle = {
    background: "linear-gradient(135deg, #8A2BE2, #4B0082)",
    color: "white",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "25px",
    boxShadow: "0 10px 25px rgba(138, 43, 226, 0.3)",
  };

  const progressBarStyle = {
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    height: "12px",
    margin: "15px 0",
    overflow: "hidden" as const,
  };

  const progressFillStyle = {
    background: "linear-gradient(to right, #00FF00, #32CD32)",
    height: "100%",
    width: `${stats.progress}%`,
    borderRadius: "10px",
    transition: "width 0.5s ease",
  };

  const getMotivationalMessage = () => {
    if (stats.total === 0) return "🎯 Начните с первой цели!";
    if (stats.progress === 100) return "🎉 Все цели завершены! Вы великолепны!";
    if (stats.progress >= 80)
      return "💪 Почти у цели! Осталось совсем немного!";
    if (stats.progress >= 50)
      return "🚀 Отличный прогресс! Продолжайте в том же духе!";
    if (stats.progress > 0) return "📈 Хорошее начало! Каждый шаг важен!";
    return "🌟 Время начинать! Первый шаг - самый важный!";
  };

  return (
    <div style={statsContainerStyle}>
      <h3
        style={{
          margin: "0 0 20px 0",
          fontSize: "1.3rem",
          textAlign: "center" as const,
        }}
      >
        📊 Статистика целей
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div style={{ textAlign: "center" as const }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {stats.total}
          </div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Всего</div>
        </div>

        <div style={{ textAlign: "center" as const }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {stats.active}
          </div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Активных</div>
        </div>

        <div style={{ textAlign: "center" as const }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {stats.completed}
          </div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Завершено</div>
        </div>

        <div style={{ textAlign: "center" as const }}>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {stats.progress}%
          </div>
          <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>Прогресс</div>
        </div>
      </div>

      <div style={progressBarStyle}>
        <div style={progressFillStyle}></div>
      </div>

      <div
        style={{
          fontSize: "0.9rem",
          textAlign: "center" as const,
          opacity: 0.9,
          fontStyle: "italic",
          marginTop: "10px",
        }}
      >
        {getMotivationalMessage()}
      </div>
    </div>
  );
};
