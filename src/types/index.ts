interface Task {
  id: number;
  text: string;
  sphere: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  completed: boolean;
  createdAt: string;
}

interface Goal {
  id: number;
  text: string;
  steps: GoalStep[];
  createdAt: string;
}

interface GoalStep {
  id: number;
  text: string;
  completed: boolean;
}

interface Reflection {
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

interface Settings {
  archetype: string;
  darkTheme: boolean;
  notifications: boolean;
  autoSave: boolean;
  colorScheme: string;
}
