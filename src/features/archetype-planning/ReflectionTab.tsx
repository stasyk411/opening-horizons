import React, { useState } from 'react';
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
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  });

  const saveReflection = () => {
    if (!answers.question1.trim()) {
      alert("Пожалуйста, ответьте хотя бы на первый вопрос");
      return;
    }

    const newReflection: Reflection = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...answers,
      archetype: settings.archetype,
      createdAt: new Date().toISOString(),
    };

    saveReflections([...reflections, newReflection]);
    setAnswers({
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      question5: "",
    });
    alert("✅ Анализ сохранен!");
  };

  const deleteReflection = (reflectionId: number) => {
    if (confirm("Удалить анализ?")) {
      const updatedReflections = reflections.filter(
        (ref) => ref.id !== reflectionId
      );
      saveReflections(updatedReflections);
    }
  };

  return (
    <div
      style={{
        padding: isMobile ? "15px" : "20px",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <h2
        style={{
          color: "#8A2BE2",
          marginBottom: "20px",
          fontSize: isMobile ? "1.5em" : "2em",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        Вечерний Анализ
      </h2>

      {/* Форма анализа */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: isMobile ? "15px" : "25px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          marginBottom: "30px",
        }}
      >
        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "white",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            1. Что получилось особенно хорошо сегодня?
          </div>
          <textarea
            value={answers.question1}
            onChange={(e) =>
              setAnswers({ ...answers, question1: e.target.value })
            }
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #8A2BE2",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical",
              background: "white",
              color: "#333",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "white",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            2. Что можно было сделать лучше?
          </div>
          <textarea
            value={answers.question2}
            onChange={(e) =>
              setAnswers({ ...answers, question2: e.target.value })
            }
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #8A2BE2",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical",
              background: "white",
              color: "#333",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "white",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            3. Какие уроки я извлек?
          </div>
          <textarea
            value={answers.question3}
            onChange={(e) =>
              setAnswers({ ...answers, question3: e.target.value })
            }
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #8A2BE2",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical",
              background: "white",
              color: "#333",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "white",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            4. За что я благодарен сегодня?
          </div>
          <textarea
            value={answers.question4}
            onChange={(e) =>
              setAnswers({ ...answers, question4: e.target.value })
            }
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #8A2BE2",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical",
              background: "white",
              color: "#333",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "white",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            5. Какие цели на завтра?
          </div>
          <textarea
            value={answers.question5}
            onChange={(e) =>
              setAnswers({ ...answers, question5: e.target.value })
            }
            rows={3}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #8A2BE2",
              borderRadius: "8px",
              fontSize: "14px",
              resize: "vertical",
              background: "white",
              color: "#333",
            }}
          />
        </div>

        <button
          onClick={saveReflection}
          style={{
            background: "#8A2BE2",
            color: "white",
            padding: "12px 30px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            width: isMobile ? "100%" : "auto",
          }}
        >
          💾 Сохранить анализ
        </button>
      </div>

      {/* Список сохраненных анализов */}
      {reflections.length > 0 && (
        <div>
          <h3
            style={{
              color: "#8A2BE2",
              marginBottom: "15px",
              fontSize: isMobile ? "1.2em" : "1.5em",
            }}
          >
            История анализов
          </h3>
          {reflections
            .slice()
            .reverse()
            .map((reflection) => (
              <div
                key={reflection.id}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "14px",
                    }}
                  >
                    {reflection.date} ({reflection.archetype})
                  </div>
                  <button
                    onClick={() => deleteReflection(reflection.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ff6b6b",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    🗑️
                  </button>
                </div>
                {reflection.question1 && (
                  <div style={{ marginBottom: "8px" }}>
                    <strong>✅ Хорошо:</strong> {reflection.question1}
                  </div>
                )}
                {reflection.question2 && (
                  <div style={{ marginBottom: "8px" }}>
                    <strong>📈 Улучшить:</strong> {reflection.question2}
                  </div>
                )}
                {reflection.question3 && (
                  <div style={{ marginBottom: "8px" }}>
                    <strong>🎓 Уроки:</strong> {reflection.question3}
                  </div>
                )}
                {reflection.question4 && (
                  <div style={{ marginBottom: "8px" }}>
                    <strong>🙏 Благодарность:</strong> {reflection.question4}
                  </div>
                )}
                {reflection.question5 && (
                  <div style={{ marginBottom: "8px" }}>
                    <strong>🎯 Цели:</strong> {reflection.question5}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;
