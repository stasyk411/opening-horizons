// Типы для системы архетипов настроения

export type Archetype = "fox" | "dolphin" | "owl";

export interface TimeBlock {
  id?: string; // Делаем опциональным для совместимости
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

// Конфигурация для каждого архетипа
export const ARCHETYPES: Record<Archetype, ArchetypeConfig> = {
  fox: {
    id: "fox",
    emoji: "🦊",
    title: "Лиса",
    description: "Энергичен и сфокусирован",
    energyWindows: {
      morning: "7:00-12:00 - Глубокая работа",
      afternoon: "12:00-18:00 - Административные задачи",
      evening: "18:00-21:00 - Планирование и отдых",
    },
    recommendations: [
      "Сфокусируйтесь на 2-3 сложных задачах утром",
      "Избегайте встреч в утренние часы",
      "Запланируйте физическую активность днем",
    ],
  },
  dolphin: {
    id: "dolphin",
    emoji: "🐬",
    title: "Дельфин",
    description: "Нужна гибкость и разнообразие",
    energyWindows: {
      morning: "9:00-12:00 - Первый пик энергии",
      afternoon: "12:00-17:00 - Спокойный режим",
      evening: "17:00-21:00 - Второй пик энергии",
    },
    recommendations: [
      "Чередуйте типы задач в течение дня",
      "Запланируйте встречи в пиковые часы",
      "Оставьте время для неожиданных дел",
    ],
  },
  owl: {
    id: "owl",
    emoji: "🦉",
    title: "Сова",
    description: "Творческий и вдумчивый",
    energyWindows: {
      morning: "10:00-13:00 - Разогрев легкими задачами",
      afternoon: "13:00-18:00 - Подготовительная работа",
      evening: "18:00-23:00 - Творчество и глубокая работа",
    },
    recommendations: [
      "Начните день с легких, разогревающих задач",
      "Оставьте сложную работу на вечер",
      "Запланируйте время для размышлений и идей",
    ],
  },
};
