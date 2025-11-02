// ВСТАВЬ ЭТОТ КОД В StatisticsSection.tsx:

import React from "react";
import { Task } from "../../../shared/types";

interface StatisticsSectionProps {
  tasks: Task[];
  isMobile?: boolean;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  tasks,
  isMobile = false,
}) => {
  const calculateTodayStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = tasks.filter((task: Task) => task.date === today);
    const completedTasks = todayTasks.filter((task: Task) => task.completed);
    const totalTasks = todayTasks.length;
    const percentage =
      totalTasks > 0
        ? Math.round((completedTasks.length / totalTasks) * 100)
        : 0;

    const categories = [
      "health",
      "career",
      "family",
      "finance",
      "development",
      "hobby",
    ];
    const categoryStats = categories.map((category) => {
      const categoryTasks = todayTasks.filter(
        (task: Task) => task.category === category
      );
      const completed = categoryTasks.filter((task: Task) => task.completed);
      const total = categoryTasks.length;
      return {
        category,
        completed: completed.length,
        total,
        percentage:
          total > 0 ? Math.round((completed.length / total) * 100) : 0,
      };
    });

    return {
      completed: completedTasks.length,
      total: totalTasks,
      percentage,
      categoryStats,
    };
  };

  const todayStats = calculateTodayStats();

  const getProductivityAdvice = () => {
    const { completed, total, percentage } = todayStats;

    if (total === 0)
      return "Сегодня у вас нет запланированных задач. Отличный день для отдыха!";
    if (percentage === 100)
      return "🎉 Потрясающе! Вы выполнили все задачи на сегодня!";
    if (percentage >= 80)
      return "💪 Отличная работа! Почти все задачи выполнены!";
    if (percentage >= 50)
      return "👍 Хороший прогресс! Продолжайте в том же духе!";
    if (percentage > 0) return "📝 Есть прогресс! Не сдавайтесь!";
    return "🎯 Время начинать! Первый шаг - самый важный!";
  };

  const statsContainerStyle = {
    background: "linear-gradient(135deg, #8A2BE2, #4B0082)",
    color: "white",
    padding: isMobile ? "20px" : "30px",
    borderRadius: isMobile ? "15px" : "20px",
    marginBottom: isMobile ? "20px" : "30px",
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
    width: `${todayStats.percentage}%`,
    borderRadius: "10px",
    transition: "width 0.5s ease",
  };

  return (
    <div style={statsContainerStyle}>
      <h3
        style={{
          margin: "0 0 15px 0",
          fontSize: isMobile ? "1.2rem" : "1.5rem",
        }}
      >
        📊 Сегодняшняя статистика
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: "15px",
        }}
      >
        <div style={{ textAlign: "center" as const }}>
          <div
            style={{
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              fontWeight: "bold",
            }}
          >
            {todayStats.completed}/{todayStats.total}
          </div>
          <div
            style={{ fontSize: isMobile ? "0.8rem" : "0.9rem", opacity: 0.9 }}
          >
            Задач выполнено
          </div>
        </div>

        <div style={{ textAlign: "center" as const }}>
          <div
            style={{
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              fontWeight: "bold",
            }}
          >
            {todayStats.percentage}%
          </div>
          <div
            style={{ fontSize: isMobile ? "0.8rem" : "0.9rem", opacity: 0.9 }}
          >
            Прогресс дня
          </div>
        </div>

        <div style={{ textAlign: "center" as const }}>
          <div
            style={{
              fontSize: isMobile ? "1.8rem" : "2.5rem",
              fontWeight: "bold",
            }}
          >
            {todayStats.total - todayStats.completed}
          </div>
          <div
            style={{ fontSize: isMobile ? "0.8rem" : "0.9rem", opacity: 0.9 }}
          >
            Осталось задач
          </div>
        </div>
      </div>

      <div style={progressBarStyle}>
        <div style={progressFillStyle}></div>
      </div>

      <div
        style={{
          fontSize: isMobile ? "0.8rem" : "0.9rem",
          textAlign: "center" as const,
          opacity: 0.9,
          marginTop: "10px",
          fontStyle: "italic",
        }}
      >
        {getProductivityAdvice()}
      </div>
    </div>
  );
};
