// ВСТАВЬ ЭТОТ КОД В InsightsSection.tsx:

import React from "react";
import { Reflection } from "../../../shared/types";

interface InsightsSectionProps {
  currentReflection: Partial<Reflection>;
  isMobile?: boolean;
  onAddInsight: () => void;
  onRemoveInsight: (index: number) => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  currentReflection,
  isMobile = false,
  onAddInsight,
  onRemoveInsight,
}) => {
  const cardStyle = {
    background: "white",
    borderRadius: isMobile ? "15px" : "20px",
    padding: isMobile ? "15px" : "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    marginBottom: isMobile ? "15px" : "20px",
  };

  return (
    <div style={cardStyle}>
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
  );
};
