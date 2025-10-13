export type Archetype = "fox" | "dolphin" | "owl";

export interface ArchetypeConfig {
  id: Archetype;
  icon: string;
  title: string;
  description: string;
  schedule: string[];
}

export interface TimeBlock {
  time: string;
  label: string;
  type: "focus" | "work" | "break" | "meeting" | "wrapup";
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  sphere: string;
  timeBlock?: string;
  isGoal?: boolean;
  steps?: TaskStep[];
}

export interface TaskStep {
  id: string;
  title: string;
  completed: boolean;
  order: number;
}
