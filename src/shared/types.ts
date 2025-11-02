export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  sphere: string;
  category: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  userId: string;

  // ДОБАВЛЯЕМ НОВЫЕ ПОЛЯ ДЛЯ PLANNINGTAB
  startTime?: string;
  endTime?: string;
  repeat?: string;
  alarm?: string;
  archetype?: string;
  timeEstimate?: number;
  date?: string;
}

export interface LifeSphere {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: string;
}

export interface Archetype {
  id: "fox" | "dolphin" | "owl";
  name: string;
  description: string;
  color: string;
}

export type LifeSphereConfig = {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
};

export interface Goal {
  id: string;
  title: string;
  description?: string;
  sphere: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  isCompleted: boolean;
  steps: GoalStep[];
}

export interface GoalStep {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  deadline?: Date;
}

export type DailyReview = {
  id: string;
  date: string;
  mood: number;
  notes: string;
  achievements: string[];
  challenges: string[];
};

export type WheelState = {
  sphere: string;
  value: number;
  lastUpdated: Date;
};

export type Mood = "very_bad" | "bad" | "neutral" | "good" | "very_good";

export interface Reflection {
  id: string;
  date: string;
  mood: number;
  answers: Record<string, string>;
  insights: string[];
  createdAt: string;

  // ДОПОЛНИТЕЛЬНЫЕ ПОЛЯ ДЛЯ АНАЛИТИКИ
  completedTasks?: number;
  totalTasks?: number;
  productivityScore?: number;
  notes?: string;
  rating?: number;
}
