// Типы для системы архетипов настроения

export type Archetype = "fox" | "dolphin" | "owl";

export interface TimeBlock {
  id?: string;
  time: string;
  label: string;
  type: "focus" | "work" | "break" | "meeting" | "wrapup";
  title?: string;
  description?: string;
}

export interface ArchetypeConfig {
  id: string;
  emoji: string;
  title: string;
  description: string;
  energyWindows: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  recommendations: string[];
  timeBlocks?: TimeBlock[];
  icon?: string;
  schedule?: string[]; // Добавляем для совместимости
}

export interface DailyState {
  date: string;
  archetype: Archetype;
  tasks: DailyTask[];
}

export interface DailyTask {
  id: string;
  title: string;
  timeWindow: "morning" | "afternoon" | "evening";
  completed: boolean;
  createdAt: Date;
  sphereId?: string;
  priority?: "low" | "medium" | "high";
}

export interface UserArchetype {
  type: Archetype;
  selectedAt: Date;
}
