export interface Goal {
  id: string;
  title: string;
  description?: string;
  sphere: string;
  progress: number; // 0-100
  createdAt: Date;
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

export interface CreateGoalData {
  title: string;
  description?: string;
  sphere: string;
  deadline?: Date;
  steps: Omit<GoalStep, "id" | "completed">[];
}
