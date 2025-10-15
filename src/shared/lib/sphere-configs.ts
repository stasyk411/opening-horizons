import { LifeSphere, LifeSphereConfig } from "../types";

export const SPHERE_CONFIGS: LifeSphereConfig[] = [
  {
    id: "health",
    name: "Здоровье",
    value: 5,
    color: "#10B981",
    icon: "💪",
    description: "Физическое и ментальное здоровье",
  },
  {
    id: "career",
    name: "Карьера",
    value: 5,
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
    value: 5,
    color: "#EC4899",
    icon: "👨‍👩‍👧‍👦",
    description: "Отношения с близкими и семьей",
  },
  {
    id: "development",
    name: "Развитие",
    value: 5,
    color: "#8B5CF6",
    icon: "📚",
    description: "Обучение, навыки и личностный рост",
  },
  {
    id: "hobby",
    name: "Хобби",
    value: 5,
    color: "#06B6D4",
    icon: "🎨",
    description: "Отдых, увлечения и творчество",
  },
];
