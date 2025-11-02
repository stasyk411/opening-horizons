export interface Settings {
  archetype: string;
  darkTheme: boolean;
  notifications: boolean;
  autoSave: boolean;
  colorScheme: string;

  // 🔽 ДЕЛАЕМ PWA НАСТРОЙКИ ОПЦИОНАЛЬНЫМИ:
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
  // ДОБАВЛЯЕМ НОВЫЕ ПОЛЯ:
  startTime?: string;
  endTime?: string;
  repeat?: string;
  alarm?: string;
  archetype?: string; // ← ДОБАВЛЯЕМ АРХЕТИП
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
}

export interface GoalStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface Reflection {
  id: string;
  date: string;
  answers: Record<string, string>;
  mood: number;
  insights: string[];
  createdAt: string;

  // НОВЫЕ ПОЛЯ ДЛЯ АНАЛИТИКИ
  completedTasks?: number;
  totalTasks?: number;
  productivityScore?: number;
  notes?: string;
  rating?: number;
}

// УДАЛЯЕМ ДУБЛИРУЮЩЕЕСЯ ОБЪЯВЛЕНИЕ Settings В КОНЦЕ ФАЙЛА
