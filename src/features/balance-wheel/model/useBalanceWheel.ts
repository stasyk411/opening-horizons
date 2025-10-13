import { useState } from "react";
import { LifeSphere } from "../../../shared/types";

// Обновленные сферы жизни (6 основных)
const defaultSpheres: LifeSphere[] = [
  {
    id: "health",
    name: "Здоровье",
    value: 7,
    color: "#10B981",
    icon: "💪",
    description: "Физическое и ментальное здоровье",
  },
  {
    id: "career",
    name: "Карьера",
    value: 6,
    color: "#3B82F6",
    icon: "💼",
    description: "Работа и профессиональное развитие",
  },
  {
    id: "finance",
    name: "Финансы",
    value: 5,
    color: "#F59E0B",
    icon: "💰",
    description: "Доходы, расходы и финансовое планирование",
  },
  {
    id: "family",
    name: "Семья",
    value: 8,
    color: "#EC4899",
    icon: "👨‍👩‍👧‍👦",
    description: "Отношения с близкими и семьей",
  },
  {
    id: "development",
    name: "Развитие",
    value: 6,
    color: "#8B5CF6",
    icon: "📚",
    description: "Обучение, навыки и личностный рост",
  },
  {
    id: "hobbies",
    name: "Хобби",
    value: 4,
    color: "#06B6D4",
    icon: "🎨",
    description: "Отдых, увлечения и творчество",
  },
];

export const useBalanceWheel = () => {
  const [spheres, setSpheres] = useState<LifeSphere[]>(defaultSpheres);

  const updateSphereValue = (sphereId: string, newValue: number) => {
    setSpheres((prev) =>
      prev.map((sphere) =>
        sphere.id === sphereId ? { ...sphere, value: newValue } : sphere
      )
    );
  };

  const resetToDefault = () => {
    setSpheres(defaultSpheres);
  };

  return {
    spheres,
    updateSphereValue,
    resetToDefault,
  };
};
