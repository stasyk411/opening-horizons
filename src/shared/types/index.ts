// 🔽 ИСПРАВЛЯЕМ LIFESPHERE - ДЕЛАЕМ ЕГО ИНТЕРФЕЙСОМ
export interface LifeSphere {
  id: string;
  name: string;
  value?: number;
  color: string;
  icon: string;
  description?: string;
}

// УДАЛЯЕМ СТАРЫЕ ОБЪЯВЛЕНИЯ:
// export const LIFE_SPHERES = [ ... ];
// export type LifeSphere = (typeof LIFE_SPHERES)[number];

export interface LifeSphereConfig {
  id: string; // ← ИСПРАВЛЕНО: string вместо LifeSphere
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

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  date: string;
  timeEstimate?: number;
  category?: string;
  createdAt: string;
  updatedAt?: string;
  startTime?: string;
  endTime?: string;
  repeat?: string;
  alarm?: string;
  archetype?: string;
}

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
  sphere: string; // ← ИСПРАВЛЕНО: string вместо LifeSphere
  score: number;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  sphere?: string;
  deadline?: string;
  steps?: Array<{ title: string; deadline?: string }>;
}

