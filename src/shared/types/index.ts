// 🔽 ИСПРАВЛЯЕМ LIFESPHERE - ДЕЛАЕМ ЕГО ИНТЕРФЕЙСОМ
export interface LifeSphere {
  id: string;
  name: string;
  value?: number;
  color: string;
  icon: string;
  description?: string;
}

export interface LifeSphereConfig {
  id: string;
  name: string;
  value?: number;
  color: string;
  icon: string;
  description: string;
}

export interface Settings {
  archetype: string;
  darkTheme: boolean;
  notifications: boolean;
  autoSave: boolean;
  colorScheme: string;
  pwaSettings?: {
    offlineMode: boolean;
    pushNotifications: boolean;
  };
}

// 🎯 ЕДИНАЯ СТРУКТУРА TASK ДЛЯ ВСЕГО ПРИЛОЖЕНИЯ
export interface Task {
  // ОСНОВНЫЕ ПОЛЯ
  id: string; // 🔥 ИСПРАВЛЕНО: был string | number
  title: string;
  completed: boolean;
  createdAt: string;

  // ДАТЫ И ВРЕМЯ
  date?: string;
  updatedAt?: string;
  startTime?: string;
  endTime?: string;

  // КАТЕГОРИЗАЦИЯ (совместимость со всеми архитектурами)
  category?: string;
  area?: string;
  archetype?: string;

  // ПРИОРИТЕТ И ОПИСАНИЕ
  priority?: "low" | "medium" | "high";
  description?: string;

  // ДОПОЛНИТЕЛЬНЫЕ ПОЛЯ
  timeEstimate?: number;
  repeat?: string;
  alarm?: string;
}

// 🎯 ТИПЫ ДЛЯ ЦЕЛЕЙ (GOALS)
export interface Goal {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  deadline?: string;
  priority: "low" | "medium" | "high";
  category: string;
  steps: GoalStep[];
  createdAt: string;
  sphere?: string;
  progress?: number;
  isCompleted?: boolean;
  updatedAt?: string;
}

export interface GoalStep {
  id: string;
  title: string;
  completed: boolean;
  order?: number;
  deadline?: string;
}

// 🎯 ТИПЫ ДЛЯ РЕФЛЕКСИЙ (REFLECTIONS)
export interface Reflection {
  id: string;
  date: string;
  answers: Record<string, string>;
  mood: number;
  insights: string[];
  createdAt: string;
  completedTasks?: number;
  totalTasks?: number;
  productivityScore?: number;
  notes?: string;
  rating?: number;
}

export interface DailyReview {
  id: string;
  date: string;
  mood: Mood;
  notes: string;
  achievements: string[];
}

export type Mood = "excellent" | "good" | "neutral" | "bad" | "terrible";
export type Priority = "low" | "medium" | "high";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface WheelState {
  sphere: string;
  score: number;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  sphere?: string;
  deadline?: string;
  steps?: Array<{ title: string; deadline?: string }>;
}
