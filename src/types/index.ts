// Создай файл: src/shared/types/index.ts

// Базовые типы для приложения
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  date?: string;
}

export interface UserSettings {
  theme: "light" | "dark";
  notifications: boolean;
}
export interface LifeSphere {
  id: string;
  name: string;
  color: string;
  value: number;
  icon?: string;
}
