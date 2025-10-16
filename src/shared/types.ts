export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  sphere: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface LifeSphere {
  id: string;
  name: string;
  value: number;
  color: string;
}

export interface Archetype {
  id: "fox" | "dolphin" | "owl";
  name: string;
  description: string;
  color: string;
}
