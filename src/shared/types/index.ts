// Сначала импортируем типы из archetypes
import { Archetype } from "./archetypes";

// Затем реэкспортируем все из archetypes
export * from "./archetypes";

// Базовые типы (которые у тебя уже есть)
export interface LifeSphere {
  id: string;
  name: string;
  color: string;
  value: number;
  icon: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  date?: string;
  sphereId?: string; // Добавил привязку к сфере
}

export interface UserSettings {
  theme: "light" | "dark";
  notifications: boolean;
  archetype?: Archetype; // Теперь Archetype импортирован
}
