import React from "react";

interface ArchetypeSectionProps {
  archetype: string;
  setArchetype: (archetype: string) => void;
  isMobile?: boolean;
}

export const ArchetypeSection: React.FC<ArchetypeSectionProps> = ({
  archetype,
  setArchetype,
  isMobile = false,
}) => {
  const archetypeSectionStyle = {
    marginBottom: isMobile ? "20px" : "30px",
    padding: isMobile ? "15px" : "25px",
    background: "#F8F8FF",
    borderRadius: isMobile ? "15px" : "20px",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  const archetypeSelectorStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
    gap: isMobile ? "15px" : "20px",
    marginTop: isMobile ? "15px" : "20px",
    width: "100%",
  };

  const archetypeOptionStyle = (isActive: boolean) => ({
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: isMobile ? "15px 10px" : "25px 15px",
    borderRadius: isMobile ? "15px" : "20px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    textAlign: "center" as const,
    border: isActive ? "2px solid #8A2BE2" : "2px solid transparent",
    background: isActive
      ? "linear-gradient(to bottom, rgba(138, 43, 226, 0.05), rgba(75, 0, 130, 0.05))"
      : "white",
    width: "100%",
    minHeight: isMobile ? "140px" : "auto",
  });

  const archetypeBadgeStyle = {
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: isMobile ? "0.7rem" : "0.8rem",
    fontWeight: "bold",
    marginBottom: "10px",
    textTransform: "uppercase" as const,
  };

  return (
    <div style={archetypeSectionStyle}>
      <h3
        style={{
          margin: "0 0 8px 0",
          fontSize: isMobile ? "1.1rem" : "1.3rem",
        }}
      >
        Выберите тип дня
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: isMobile ? "0.8rem" : "1rem",
          color: "#666",
          lineHeight: 1.4,
        }}
      >
        Выберите архетип, который лучше всего соответствует вашему состоянию и
        задачам на сегодня
      </p>

      <div style={archetypeSelectorStyle}>
        <div
          style={archetypeOptionStyle(archetype === "productive")}
          onClick={() => setArchetype("productive")}
        >
          <div style={archetypeBadgeStyle}>📈 ПРОДУКТИВНЫЙ</div>
          <span
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              marginBottom: isMobile ? "8px" : "15px",
            }}
          >
            📈
          </span>
          <div
            style={{
              fontSize: isMobile ? "0.75rem" : "0.9rem",
              opacity: 0.9,
              marginBottom: isMobile ? "8px" : "15px",
              lineHeight: 1.4,
            }}
          >
            Сфокусируйтесь на важных задачах и достижении целей. Идеально для
            рабочих дней и проектов.
          </div>
        </div>

        <div
          style={archetypeOptionStyle(archetype === "balanced")}
          onClick={() => setArchetype("balanced")}
        >
          <div style={archetypeBadgeStyle}>⚖️ СБАЛАНСИРОВАННЫЙ</div>
          <span
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              marginBottom: isMobile ? "8px" : "15px",
            }}
          >
            ⚖️
          </span>
          <div
            style={{
              fontSize: isMobile ? "0.75rem" : "0.9rem",
              opacity: 0.9,
              marginBottom: isMobile ? "8px" : "15px",
              lineHeight: 1.4,
            }}
          >
            Равномерное распределение энергии между работой, отдыхом и личными
            делами.
          </div>
        </div>

        <div
          style={archetypeOptionStyle(archetype === "recovery")}
          onClick={() => setArchetype("recovery")}
        >
          <div style={archetypeBadgeStyle}>🔄 ВОССТАНАВЛИВАЮЩИЙ</div>
          <span
            style={{
              fontSize: isMobile ? "2rem" : "3.5rem",
              marginBottom: isMobile ? "8px" : "15px",
            }}
          >
            🔄
          </span>
          <div
            style={{
              fontSize: isMobile ? "0.75rem" : "0.9rem",
              opacity: 0.9,
              marginBottom: isMobile ? "8px" : "15px",
              lineHeight: 1.4,
            }}
          >
            День для отдыха, восстановления сил и заботы о себе. Минимум
            обязательств.
          </div>
        </div>
      </div>
    </div>
  );
};
