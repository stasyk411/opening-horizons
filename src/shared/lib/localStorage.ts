// Утилиты для работы с LocalStorage
export const StorageService = {
  // Сохранить данные
  set<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  // Загрузить данные
  get<T>(key: string, defaultValue: T): T {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData) as T;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  },

  // Удалить данные
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  // Очистить все данные приложения
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// Ключи для хранения данных
export const STORAGE_KEYS = {
  TASKS: "opening_horizons_tasks",
  GOALS: "opening_horizons_goals",
  ARCHETYPE: "opening_horizons_archetype",
  SPHERES: "opening_horizons_spheres",
  SETTINGS: "opening_horizons_settings",
} as const;
