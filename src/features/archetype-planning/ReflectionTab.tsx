import React, { useState } from "react";
import { Reflection } from "../../types";

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
  isMobile,
}) => {
  const [currentReflection, setCurrentReflection] = useState<
    Partial<Reflection>
  >({
    date: new Date().toISOString().split("T")[0],
    mood: 5,
    answers: {},
    insights: [],
  });
  const [showHistory, setShowHistory] = useState(false);
  const [selectedReflection, setSelectedReflection] =
    useState<Reflection | null>(null);

  // Вопросы для анализа в зависимости от архетипа (как в макете)
  const getQuestions = () => {
    const baseQuestions = {
      q1: "Что сегодня получилось лучше всего?",
      q2: "Что можно было сделать лучше?",
      q3: "Какие уроки я извлек из сегодняшнего дня?",
      q4: "За что я благодарен сегодня?",
    };

    // Архетипы как в макете: ПРОДУКТИВНЫЙ, СБАЛАНСИРОВАННЫЙ, ВОССТАНАВЛИВАЮЩИЙ
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

  const handleAnswerChange = (questionKey: string, answer: string) => {
    setCurrentReflection((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionKey]: answer,
      },
    }));
  };

  const handleMoodChange = (mood: number) => {
    setCurrentReflection((prev) => ({ ...prev, mood }));
  };

  const addInsight = () => {
    const insight = prompt(
      `💡 Добавьте ключевое озарение дня\n\nИнсайт - это важное понимание, которое меняет ваш подход.\n\nПримеры:\n• "Утром работаю эффективнее"\n• "Соцсети отнимают много времени"\n• "Короткие перерывы повышают продуктивность"\n\nВаш инсайт:`
    );

    if (insight && insight.trim()) {
      setCurrentReflection((prev) => ({
        ...prev,
        insights: [...(prev.insights || []), insight.trim()],
      }));
    }
  };

  const removeInsight = (index: number) => {
    setCurrentReflection((prev) => ({
      ...prev,
      insights: prev.insights?.filter((_, i) => i !== index) || [],
    }));
  };

  const saveReflection = () => {
    if (
      !currentReflection.answers ||
      Object.keys(currentReflection.answers).length === 0
    ) {
      alert("Пожалуйста, ответьте хотя бы на один вопрос");
      return;
    }

    const newReflection: Reflection = {
      id: Date.now().toString(),
      date: currentReflection.date || new Date().toISOString(),
      answers: currentReflection.answers || {},
      mood: currentReflection.mood || 5,
      insights: currentReflection.insights || [],
      createdAt: new Date().toISOString(),
    };

    const updatedReflections = [...reflections, newReflection];
    saveReflections(updatedReflections);

    // Сброс формы
    setCurrentReflection({
      date: new Date().toISOString().split("T")[0],
      mood: 5,
      answers: {},
      insights: [],
    });

    alert("Анализ сохранен! 📝");
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😔", "😐", "🙂", "😊", "🤩"];
    return emojis[Math.min(mood - 1, emojis.length - 1)] || "😐";
  };

  const getRecentReflections = () => {
    return reflections
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const openReflectionDetails = (reflection: Reflection) => {
    setSelectedReflection(reflection);
  };

  const closeReflectionDetails = () => {
    setSelectedReflection(null);
  };

  const getArchetypeDisplayName = (archetype: string) => {
    const names: Record<string, string> = {
      productive: "📈 ПРОДУКТИВНЫЙ",
      balanced: "⚖️ СБАЛАНСИРОВАННЫЙ",
      recovery: "🔄 ВОССТАНАВЛИВАЮЩИЙ",
    };
    return names[archetype] || archetype;
  };

  // Стили из макета
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

  // Модальное окно для просмотра анализа
  if (selectedReflection) {
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
            onClick={closeReflectionDetails}
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
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
          onClick={closeReflectionDetails}
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
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: isMobile ? "15px" : "20px",
        padding: isMobile ? "15px" : "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={sectionTitleStyle}>📝 Вечерний Анализ</h2>

      {/* Переключение между формой и историей */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap" as const,
        }}
      >
        <button
          onClick={() => setShowHistory(false)}
          style={{
            padding: "12px 20px",
            background: !showHistory ? "#8A2BE2" : "transparent",
            color: !showHistory ? "white" : "#8A2BE2",
            border: "2px solid #8A2BE2",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            flex: 1,
            minWidth: "120px",
          }}
        >
          📋 Новый анализ
        </button>
        <button
          onClick={() => setShowHistory(true)}
          style={{
            padding: "12px 20px",
            background: showHistory ? "#8A2BE2" : "transparent",
            color: showHistory ? "white" : "#8A2BE2",
            border: "2px solid #8A2BE2",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            flex: 1,
            minWidth: "120px",
          }}
        >
          📊 История ({reflections.length})
        </button>
      </div>

      {!showHistory ? (
        /* ФОРМА АНАЛИЗА */
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
                onChange={(e) =>
                  setCurrentReflection((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={currentReflection.mood}
                  onChange={(e) => handleMoodChange(Number(e.target.value))}
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

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
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
                    onChange={(e) => handleAnswerChange(key, e.target.value)}
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
                onClick={addInsight}
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

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
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
                    onClick={() => removeInsight(index)}
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
            onClick={saveReflection}
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
                  ? "#8A2BE2"
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
      ) : (
        /* ИСТОРИЯ АНАЛИЗОВ */
        <div style={cardStyle}>
          <h3
            style={{
              color: "#333",
              margin: "0 0 20px 0",
              fontSize: "1.3rem",
            }}
          >
            📊 История анализов
          </h3>

          {reflections.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#666",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📝</div>
              <h4 style={{ margin: "0 0 10px 0" }}>
                Пока нет сохраненных анализов
              </h4>
              <p>Начните с создания первого анализа дня!</p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {getRecentReflections().map((reflection) => (
                <div
                  key={reflection.id}
                  style={{
                    padding: "15px",
                    border: "1px solid #e9ecef",
                    borderRadius: "8px",
                    background: "#f8f9fa",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => openReflectionDetails(reflection)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e9ecef";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f8f9fa";
                    e.currentTarget.style.transform = "translateY(0)";
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
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: "block", marginBottom: "5px" }}>
                        {new Date(reflection.date).toLocaleDateString("ru-RU", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </strong>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "5px",
                          flexWrap: "wrap" as const,
                        }}
                      >
                        <span>Настроение: {getMoodEmoji(reflection.mood)}</span>
                        <span
                          style={{
                            color: "#666",
                            fontSize: "12px",
                          }}
                        >
                          {new Date(reflection.createdAt).toLocaleTimeString(
                            "ru-RU",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        background:
                          "linear-gradient(to right, #8A2BE2, #4B0082)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                      }}
                    >
                      {getArchetypeDisplayName(settings.archetype)}
                    </div>
                  </div>

                  {reflection.insights && reflection.insights.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <strong>💡 Инсайты:</strong>
                      <div style={{ margin: "5px 0 0 0" }}>
                        {reflection.insights
                          .slice(0, 2)
                          .map((insight, index) => (
                            <div
                              key={index}
                              style={{
                                fontSize: "14px",
                                marginBottom: "2px",
                                opacity: 0.8,
                              }}
                            >
                              • {insight}
                            </div>
                          ))}
                        {reflection.insights.length > 2 && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginTop: "5px",
                            }}
                          >
                            + еще {reflection.insights.length - 2} инсайтов...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "10px",
                      fontSize: "12px",
                      color: "#8A2BE2",
                      fontWeight: "bold",
                    }}
                  >
                    Нажмите для просмотра →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { ReflectionTab };
