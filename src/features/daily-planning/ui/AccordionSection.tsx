// ВСТАВЬ ЭТОТ КОД В src/features/daily-planning/ui/AccordionSection.tsx

import React from "react";

interface AccordionSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isMobile?: boolean;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
  isMobile = false,
}) => {
  const sectionTitleStyle = {
    fontSize: isMobile ? "1.3rem" : "1.8rem",
    marginBottom: isMobile ? "15px" : "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <div style={{ marginBottom: isMobile ? "20px" : "30px" }}>
      <div
        style={{
          ...sectionTitleStyle,
          cursor: "pointer",
          userSelect: "none" as const,
          padding: isMobile ? "12px 16px" : "16px 20px",
          background: "linear-gradient(135deg, #8A2BE2, #4B0082)",
          color: "white",
          borderRadius: "12px",
          marginBottom: "10px",
        }}
        onClick={onToggle}
      >
        <span style={{ marginRight: "10px" }}>{isExpanded ? "▼" : "▶"}</span>
        {title}
      </div>
      {isExpanded && (
        <div
          style={{
            padding: isMobile ? "15px" : "20px",
            background: "#F8F8FF",
            borderRadius: "12px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
