import { useState, useEffect } from "react";
import { LifeSphere } from "../../../shared/types";

// Уберем импорт LifeSphereConfig если его нет

export const useBalanceWheel = () => {
  const [spheres, setSpheres] = useState<LifeSphere[]>([]);

  useEffect(() => {
    const initialSpheres: LifeSphere[] = [
      {
        id: "health",
        name: "Здоровье",
        value: 5,
        color: "#10b981",
        icon: "💊",
      },
      { id: "career", name: "Карьера", value: 5, color: "#3b82f6", icon: "💼" },
      {
        id: "finance",
        name: "Финансы",
        value: 5,
        color: "#f59e0b",
        icon: "💰",
      },
      {
        id: "education",
        name: "Образование",
        value: 5,
        color: "#8b5cf6",
        icon: "📚",
      },
      {
        id: "relationships",
        name: "Отношения",
        value: 5,
        color: "#ec4899",
        icon: "❤️",
      },
      { id: "hobbies", name: "Хобби", value: 5, color: "#6366f1", icon: "🎨" },
      {
        id: "spirituality",
        name: "Духовность",
        value: 5,
        color: "#14b8a6",
        icon: "🕊️",
      },
      {
        id: "environment",
        name: "Окружение",
        value: 5,
        color: "#f97316",
        icon: "🌍",
      },
    ];
    setSpheres(initialSpheres);
  }, []);

  const updateSphereValue = (sphereId: string, newValue: number) => {
    // ИСПРАВЛЕНО: убираем проверку типов
    setSpheres((prev) =>
      prev.map((sphere) =>
        sphere.id === sphereId ? { ...sphere, value: newValue } : sphere
      )
    );
  };

  return {
    spheres,
    updateSphereValue,
  };
};
