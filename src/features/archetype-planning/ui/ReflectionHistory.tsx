// ВСТАВЬ ЭТОТ КОД В ReflectionHistory.tsx:

import React from "react";
import { Reflection } from "../../../shared/types";

interface ReflectionHistoryProps {
  reflections: Reflection[];
  settings: { archetype: string };
  isMobile?: boolean;
  onOpenDetails: (reflection: Reflection) => void;
}

export const ReflectionHistory: React.FC<ReflectionHistoryProps> = ({
  reflections,
  settings,
  isMobile = false,
  onOpenDetails,
}) => {
  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😔", "😐", "🙂", "😊", "🤩"];
    return emojis[Math.min(mood - 1, emojis.length - 1)] || "😐";
  };

  const getArchetypeDisplayName = (archetype: string) => {
    const names: Record<string, string> = {
      productive: "📈 ПРОДУКТИВНЫЙ",
      balanced: "⚖️ СБАЛАНСИРОВАННЫЙ",
      recovery: "🔄 ВОССТАНАВЛИВАЮЩИЙ",
    };
    return names[archetype] || archetype;
  };

  const getRecentReflections = () => {
    return reflections
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const cardStyle = {
    background: "white",
    borderRadius: isMobile ? "15px" : "20px",
    padding: isMobile ? "15px" : "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    marginBottom: isMobile ? "15px" : "20px",
  };

  return (
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
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
              onClick={() => onOpenDetails(reflection)}
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

                  {/* СТАТИСТИКА В ИСТОРИИ */}
                  {reflection.completedTasks !== undefined && (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "5px",
                        fontSize: "0.9rem",
                        color: "#666",
                        flexWrap: "wrap" as const,
                      }}
                    >
                      <span>
                        ✅ {reflection.completedTasks}/{reflection.totalTasks}
                      </span>
                      <span>📊 {reflection.productivityScore}%</span>
                      <span>⭐ {reflection.rating}/10</span>
                    </div>
                  )}

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
                    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
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
                    {reflection.insights.slice(0, 2).map((insight, index) => (
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
  );
};
