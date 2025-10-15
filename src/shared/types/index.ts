export const LIFE_SPHERES = [
  "health",
  "development",
  "finance",
  "hobby",
  "family",
  "career",
] as const;
export type LifeSphere = (typeof LIFE_SPHERES)[number];
// Добавь этот интерфейс после объявления LifeSphere
export interface LifeSphereConfig {
  id: LifeSphere;
  name: string;
  value?: number;
  color: string;
  icon: string;
  description: string;
}
export interface Task {
  isCompleted?: boolean;
  text?: string;
  timeSlot?: string;
  withAlarm?: boolean;
  recurrence?: RecurrenceType;
  createdAt: string;
  completedAt?: string;
  id: string;
  title: string;
  completed: boolean;
  category?: string;
  time?: string;
  sphereId?: string;
  priority: "low" | "medium" | "high";
  date?: string;
}

export interface Goal {
  bigSteps?: GoalStep[];
  smallSteps?: GoalStep[];
  createdAt: string;
  completedAt?: string;
  id: string;
  title: string;
  description: string;
  completed: boolean;
  steps: GoalStep[];
}

export interface GoalStep {
  id: string;
  title: string;
  completed: boolean;
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
  sphere: LifeSphere;
  score: number;
}
