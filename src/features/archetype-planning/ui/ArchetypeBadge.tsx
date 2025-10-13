import React from "react";
import { Archetype } from "../../../shared/types/archetypes";

interface ArchetypeBadgeProps {
  archetype: Archetype | null;
  onArchetypeChange: (archetype: Archetype) => void;
}

export const ArchetypeBadge: React.FC<ArchetypeBadgeProps> = ({
  archetype,
  onArchetypeChange,
}) => {
  const archetypes = {
    fox: {
      icon: "🦊",
      label: "Лиса",
      color: "bg-orange-100 text-orange-800",
      description: "Ранняя пташка",
    },
    dolphin: {
      icon: "🐬",
      label: "Дельфин",
      color: "bg-blue-100 text-blue-800",
      description: "Гибкий график",
    },
    owl: {
      icon: "🦉",
      label: "Сова",
      color: "bg-purple-100 text-purple-800",
      description: "Ночной режим",
    },
  };

  if (!archetype) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg text-sm">
        <span>Выбери стиль дня →</span>
        <select
          onChange={(e) => onArchetypeChange(e.target.value as Archetype)}
          className="border rounded px-2 py-1"
        >
          <option value="">Стиль...</option>
          <option value="fox">🦊 Лиса</option>
          <option value="dolphin">🐬 Дельфин</option>
          <option value="owl">🦉 Сова</option>
        </select>
      </div>
    );
  }

  const current = archetypes[archetype];

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-2 px-3 py-1 rounded-full ${current.color} border`}
      >
        <span className="text-sm">{current.icon}</span>
        <span className="text-sm font-medium">{current.label}</span>
        <span className="text-xs opacity-75">({current.description})</span>
      </div>

      <select
        value={archetype}
        onChange={(e) => onArchetypeChange(e.target.value as Archetype)}
        className="text-sm border rounded px-2 py-1"
      >
        <option value="fox">🦊 Лиса</option>
        <option value="dolphin">🐬 Дельфин</option>
        <option value="owl">🦉 Сова</option>
      </select>
    </div>
  );
};
