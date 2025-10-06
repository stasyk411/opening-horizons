export type Mood = "happy" | "neutral" | "sad" | "critical";
export type Archetype = "fox" | "dolphin" | "owl";
export type Priority = "high" | "medium" | "low" | "none";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";
export type LifeSphere =
  | "health"
  | "development"
  | "finance"
  | "hobby"
  | "family"
  | "career";

export interface Task {
  id: string;
  text: string;
  sphere: LifeSphere;
  date: string | null;
  timeSlot?: { start: string; end: string };
  priority: Priority;
  withAlarm: boolean;
  alarmTime?: string;
  recurrence: RecurrenceType;
  isCompleted: boolean;
  goalId?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  bigSteps: string[];
  smallSteps: string[];
  createdAt: string;
}

export interface DailyReview {
  id: string;
  date: string;
  answers: string[];
  archetype: Archetype;
}

export interface WheelState {
  sphere: LifeSphere;
  mood: Mood;
  lastUpdated: string;
}
