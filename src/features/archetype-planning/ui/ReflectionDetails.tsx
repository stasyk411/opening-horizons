// ВСТАВЬ ЭТОТ КОД В ReflectionDetails.tsx:

import React from "react";
import { Reflection } from "../../../shared/types";

interface ReflectionDetailsProps {
  selectedReflection: Reflection;
  settings: { archetype: string };
  isMobile?: boolean;
  onClose: () => void;
}

export const ReflectionDetails: React.FC<ReflectionDetailsProps> = ({
  selectedReflection,
  settings,
  isMobile = false,
  onClose,
}) => {
  const getQuestions = () => {
    const baseQuestions = {
      q1: "Что сегодня было действительно важным?",
      q2: "Что я сегодня могу себе простить?",
      q3: "Что я понял сегодня о себе?",
      q4: "Что стоит взять с собой в завтра?",
    };

    const archetypeQuestions: Record<string, Record<string, string>> = {
      productive: {
        q5: "Насколько эффективно я использовал время сегодня?",
        q6: "Какие важные задачи я завершил?",
      },
      balanced: {
        q5: "Как я балансировал между работой и отдыхом?",
        q6: "Что принесло мне радость сегодня?",
      },
      recovery: {
        q5: "Что помогло мне восстановить силы?",
        q6: "Как я позаботился о себе сегодня?",
      },
    };

    return {
      ...baseQuestions,
      ...(archetypeQuestions[settings.archetype] || {}),
    };
  };

  const questions = getQuestions();

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😔", "😐", "🙂", "😊", "🤩"];
    return emojis[Math.min(mood - 1, emojis.length - 1)] || "😐";
  };

  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      work: "💼 Работа",
      personal: "🌟 Личное",
      health: "🏃 Здоровье",
      learning: "📚 Обучение",
      social: "👥 Общение",
      family: "👪 Семья",
      other: "📦 Другое",
    };
    return names[category] || category;
  };

  const sectionTitleStyle = {
    fontSize: isMobile ? "1.3rem" : "1.8rem",
    marginBottom: isMobile ? "15px" : "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const cardStyle = {
    background: "white",
    borderRadius: isMobile ? "15px" : "20px",
    padding: isMobile ? "15px" : "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    marginBottom: isMobile ? "15px" : "20px",
  };

  const btnStyle = {
    padding: isMobile ? "12px 18px" : "15px 25px",
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    border: "none",
    borderRadius: isMobile ? "12px" : "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: isMobile ? "14px" : "16px",
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: isMobile ? "15px" : "20px",
        padding: isMobile ? "15px" : "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={sectionTitleStyle}>📊 Просмотр анализа</h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#666",
          }}
        >
          ✕
        </button>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
            flexWrap: "wrap" as const,
            gap: "15px",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
              {new Date(selectedReflection.date).toLocaleDateString("ru-RU", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>Настроение: {getMoodEmoji(selectedReflection.mood)}</span>
              <span style={{ color: "#666", fontSize: "0.9rem" }}>
                {new Date(selectedReflection.createdAt).toLocaleTimeString(
                  "ru-RU",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </div>
          </div>
        </div>

        {/* СТАТИСТИКА В МОДАЛЬНОМ ОКНЕ */}
        {selectedReflection.completedTasks !== undefined && (
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "25px",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.2rem" }}>
              📈 Статистика дня
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
                gap: "15px",
              }}
            >
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {selectedReflection.completedTasks}/
                  {selectedReflection.totalTasks}
                </div>
                <div>задач выполнено</div>
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {selectedReflection.productivityScore}%
                </div>
                <div>продуктивность</div>
              </div>
              {!isMobile && (
                <div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                    {selectedReflection.rating}/10
                  </div>
                  <div>оценка дня</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ответы на вопросы */}
        <div style={{ marginBottom: "25px" }}>
          <h4 style={{ color: "#8A2BE2", marginBottom: "15px" }}>
            🤔 Ответы на вопросы
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {Object.entries(questions).map(([key, question]) => (
              <div key={key}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    color: "#555",
                  }}
                >
                  {question}
                </div>
                <div
                  style={{
                    padding: "12px",
                    background: "#F8F8FF",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  {selectedReflection.answers[key] || "Нет ответа"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Заметки */}
        {selectedReflection.notes && (
          <div style={{ marginBottom: "25px" }}>
            <h4 style={{ color: "#8A2BE2", marginBottom: "15px" }}>
              📝 Заметки
            </h4>
            <div
              style={{
                padding: "15px",
                background: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #e9ecef",
                whiteSpace: "pre-wrap",
              }}
            >
              {selectedReflection.notes}
            </div>
          </div>
        )}

        {/* Инсайты */}
        {selectedReflection.insights &&
          selectedReflection.insights.length > 0 && (
            <div>
              <h4 style={{ color: "#8A2BE2", marginBottom: "15px" }}>
                💡 Ключевые инсайты
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {selectedReflection.insights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px",
                      background: "#f8fff8",
                      borderRadius: "8px",
                      border: "1px solid #e0f0e0",
                    }}
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      <button
        onClick={onClose}
        style={{
          ...btnStyle,
          width: "100%",
          marginTop: "20px",
        }}
      >
        ← Назад к истории
      </button>
    </div>
  );
};
