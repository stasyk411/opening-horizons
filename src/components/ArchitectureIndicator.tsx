import React from "react";

export interface ArchitectureIndicatorProps {
  architecture: string;
  show: boolean;
}

export const ArchitectureIndicator: React.FC<ArchitectureIndicatorProps> = ({
  architecture,
  show,
}) => {
  if (!show) return null;

  const getArchitectureInfo = (arch: string) => {
    switch (arch) {
      case "feature":
        return { name: "Feature-Based", color: "#8A2BE2", emoji: "🏗️" };
      case "react":
        return { name: "React", color: "#61DAFB", emoji: "⚛️" };
      case "minimalist":
        return { name: "Minimalist", color: "#32CD32", emoji: "🎯" };
      default:
        return { name: "Unknown", color: "#666", emoji: "❓" };
    }
  };

  const info = getArchitectureInfo(architecture);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: info.color,
        color: "white",
        padding: "8px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        zIndex: 1001,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
      title={`Текущая архитектура: ${info.name}. Переключение: Ctrl+F1/F2/F3`}
      data-testid="architecture-indicator"
    >
      <span>{info.emoji}</span>
      {info.name}
    </div>
  );
};

export default ArchitectureIndicator;
