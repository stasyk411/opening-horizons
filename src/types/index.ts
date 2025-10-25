export interface Task {
  id: number;
  text: string;
  sphere: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  completed: boolean;
  createdAt: string;
}

export interface Goal {
  id: number;
  text: string;
  steps: GoalStep[];
  createdAt: string;
}

export interface GoalStep {
  id: number;
  text: string;
  completed: boolean;
}

export interface Reflection {
  id: number;
  date: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  question5: string;
  archetype: string;
  createdAt: string;
}

export interface Settings {
  archetype: string;
  darkTheme: boolean;
  notifications: boolean;
  autoSave: boolean;
  colorScheme: string;
}
