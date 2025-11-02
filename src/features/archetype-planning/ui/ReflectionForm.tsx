// ВСТАВЬ ЭТОТ КОД В ReflectionForm.tsx:

import React from "react";
import { Reflection, Task } from "../../../shared/types";

interface ReflectionFormProps {
  currentReflection: Partial<Reflection>;
  tasks: Task[];
  settings: { archetype: string };
  isMobile: boolean;
  onAnswerChange: (questionKey: string, answer: string) => void;
  onMoodChange: (mood: number) => void;
  onRatingChange: (rating: number) => void;
  onNotesChange: (notes: string) => void;
  onDateChange: (date: string) => void;
  onAddInsight: () => void;
  onRemoveInsight: (index: number) => void;
  onSave: () => void;
}

export const ReflectionForm: React.FC<ReflectionFormProps> = ({
  currentReflection,
  tasks,
  settings,
  isMobile,
  onAnswerChange,
  onMoodChange,
  onRatingChange,
  onNotesChange,
  onDateChange,
  onAddInsight,
  onRemoveInsight,
  onSave,
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
    <div style={cardStyle}>
      {/* Дата и настроение */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            📅 Дата анализа
          </label>
          <input
            type="date"
            value={currentReflection.date}
            onChange={(e) => onDateChange(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            {getMoodEmoji(currentReflection.mood || 5)} Настроение
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="range"
              min="1"
              max="6"
              value={currentReflection.mood}
              onChange={(e) => onMoodChange(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span
              style={{
                fontWeight: "bold",
                color: "#8A2BE2",
                minWidth: "30px",
              }}
            >
              {currentReflection.mood}/6
            </span>
          </div>
        </div>
      </div>

      {/* Оценка дня */}
      <div style={{ marginBottom: "25px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          ⭐ Оценка дня (1-10)
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            flexWrap: "wrap" as const,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              onClick={() => onRatingChange(star)}
              style={{
                background: "none",
                border: "none",
                fontSize: isMobile ? "1.5rem" : "2rem",
                cursor: "pointer",
                transition: "transform 0.2s",
                transform:
                  (currentReflection.rating || 5) >= star
                    ? "scale(1.2)"
                    : "scale(1)",
              }}
            >
              {(currentReflection.rating || 5) >= star ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        {(currentReflection.rating || 5) > 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "10px",
              color: "#666",
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
          >
            Вы оценили день на {currentReflection.rating}/10
          </div>
        )}
      </div>

      {/* Вопросы */}
      <div style={{ marginBottom: "25px" }}>
        <h3
          style={{
            color: "#333",
            margin: "0 0 15px 0",
            fontSize: "1.2rem",
          }}
        >
          🤔 Вопросы для размышления
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {Object.entries(questions).map(([key, question]) => (
            <div key={key}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                {question}
              </label>
              <textarea
                value={currentReflection.answers?.[key] || ""}
                onChange={(e) => onAnswerChange(key, e.target.value)}
                placeholder="Ваш ответ..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Заметки */}
      <div style={{ marginBottom: "25px" }}>
        <h3
          style={{
            color: "#333",
            margin: "0 0 15px 0",
            fontSize: "1.2rem",
          }}
        >
          📝 Дополнительные заметки
        </h3>
        <textarea
          value={currentReflection.notes || ""}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Любые дополнительные мысли, наблюдения, идеи..."
          rows={4}
          style={{
            width: "100%",
            padding: "12px",
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            fontSize: "14px",
            resize: "vertical",
          }}
        />
      </div>

      {/* Ключевые инсайты */}
      <div style={{ marginBottom: "25px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h3
            style={{
              color: "#333",
              margin: 0,
              fontSize: "1.2rem",
            }}
          >
            💡 Ключевые инсайты
          </h3>
          <button
            onClick={onAddInsight}
            style={{
              padding: "8px 15px",
              background: "#8A2BE2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            + Добавить инсайт
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {currentReflection.insights?.map((insight, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 15px",
                background: "#f8f9fa",
                borderRadius: "6px",
                border: "1px solid #e9ecef",
              }}
            >
              <span>{insight}</span>
              <button
                onClick={() => onRemoveInsight(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff4444",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🗑️
              </button>
            </div>
          ))}
          {(!currentReflection.insights ||
            currentReflection.insights.length === 0) && (
            <p
              style={{
                color: "#999",
                textAlign: "center",
                fontStyle: "italic",
                margin: "10px 0",
                fontSize: "0.8rem",
                lineHeight: 1.3,
              }}
            >
              💡 Записывайте ключевые озарения дня.
              <br />
              Они помогают понять себя лучше.
            </p>
          )}
        </div>
      </div>

      {/* Кнопка сохранения */}
      <button
        onClick={onSave}
        disabled={
          !currentReflection.answers ||
          Object.keys(currentReflection.answers).length === 0
        }
        style={{
          width: "100%",
          padding: "15px",
          background:
            currentReflection.answers &&
            Object.keys(currentReflection.answers).length > 0
              ? "linear-gradient(to right, #8A2BE2, #4B0082)"
              : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor:
            currentReflection.answers &&
            Object.keys(currentReflection.answers).length > 0
              ? "pointer"
              : "not-allowed",
          transition: "background 0.3s ease",
        }}
      >
        💾 Сохранить анализ дня
      </button>
    </div>
  );
};
