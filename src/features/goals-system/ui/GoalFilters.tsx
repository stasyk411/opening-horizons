// ВСТАВЬ ЭТОТ КОД В GoalFilters.tsx:

import React from "react";

interface GoalFiltersProps {
  currentFilter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  onAddGoal: () => void;
}

export const GoalFilters: React.FC<GoalFiltersProps> = ({
  currentFilter,
  onFilterChange,
  onAddGoal,
}) => {
  const filterButtonStyle = (isActive: boolean) => ({
    padding: "10px 20px",
    background: isActive ? "#8A2BE2" : "transparent",
    color: isActive ? "white" : "#8A2BE2",
    border: "2px solid #8A2BE2",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    transition: "all 0.3s ease",
    flex: 1,
  });

  const addButtonStyle = {
    padding: "12px 24px",
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
        alignItems: "center",
        flexWrap: "wrap" as const,
      }}
    >
      {/* Фильтры */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flex: 1,
          minWidth: "250px",
        }}
      >
        <button
          onClick={() => onFilterChange("all")}
          style={filterButtonStyle(currentFilter === "all")}
        >
          Все
        </button>
        <button
          onClick={() => onFilterChange("active")}
          style={filterButtonStyle(currentFilter === "active")}
        >
          Активные
        </button>
        <button
          onClick={() => onFilterChange("completed")}
          style={filterButtonStyle(currentFilter === "completed")}
        >
          Завершенные
        </button>
      </div>

      {/* Кнопка добавления */}
      <button
        onClick={onAddGoal}
        style={addButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 5px 15px rgba(138, 43, 226, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span>➕</span>
        Новая цель
      </button>
    </div>
  );
};
