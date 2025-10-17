export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  sphere: string;
  category: string; // ← ДОБАВИТЬ ЭТУ СТРОКУ
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface LifeSphere {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: string; // ← ДОБАВИТЬ ЭТУ СТРОКУ
}

export interface Archetype {
  id: "fox" | "dolphin" | "owl";
  name: string;
  description: string;
  color: string;
}

// Добавить эти типы в конец файла
export type LifeSphereConfig = {
  id: string; // Исправлено: было LifeSphere, должно быть string
  name: string;
  icon: string;
  color: string;
  description: string;
};

export type Goal = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DailyReview = {
  id: string;
  date: string;
  mood: number;
  notes: string;
  achievements: string[];
  challenges: string[];
};

export type WheelState = {
  sphere: string; // Исправлено: было LifeSphere, должно быть string
  value: number;
  lastUpdated: Date;
};

export type Mood = "very_bad" | "bad" | "neutral" | "good" | "very_good";
