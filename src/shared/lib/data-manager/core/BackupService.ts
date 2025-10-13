// src/shared/lib/indexedDB/database.ts
import { openDB, DBSchema, IDBPDatabase } from "idb";
import {
  Task,
  Goal,
  DailyReview,
  WheelState,
  LifeSphere,
} from "../../../types";

interface OpeningHorizonsDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: { "by-date": string; "by-sphere": LifeSphere; "by-goal": string };
  };
  goals: {
    key: string;
    value: Goal;
  };
  reviews: {
    key: string;
    value: DailyReview;
    indexes: { "by-date": string };
  };
  wheel: {
    key: LifeSphere;
    value: WheelState;
  };
}

class DatabaseManager {
  private db: IDBPDatabase<OpeningHorizonsDB> | null = null;
  private readonly DB_NAME = "OpeningHorizonsDB";
  private readonly DB_VERSION = 2;

  async init(): Promise<void> {
    this.db = await openDB<OpeningHorizonsDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Создаем все store с самого начала - простой подход
        if (!db.objectStoreNames.contains("tasks")) {
          const taskStore = db.createObjectStore("tasks", { keyPath: "id" });
          taskStore.createIndex("by-date", "date");
          taskStore.createIndex("by-sphere", "sphere");
          taskStore.createIndex("by-goal", "goalId");
        }

        if (!db.objectStoreNames.contains("goals")) {
          db.createObjectStore("goals", { keyPath: "id" });
        }

        if (!db.objectStoreNames.contains("reviews")) {
          const reviewStore = db.createObjectStore("reviews", {
            keyPath: "id",
          });
          reviewStore.createIndex("by-date", "date");
        }

        if (!db.objectStoreNames.contains("wheel")) {
          db.createObjectStore("wheel", { keyPath: "sphere" });
        }
      },
    });
  }

  // Базовые методы для демонстрации
  async testConnection(): Promise<boolean> {
    await this.init();
    return this.db !== null;
  }

  async getDb() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  // ДОБАВЛЯЕМ МЕТОДЫ ДЛЯ ЭКСПОРТА/ИМПОРТА
  async exportData(): Promise<string> {
    if (!this.db) {
      await this.init();
    }

    // Временная заглушка - возвращаем пустые данные
    const data = {
      tasks: [],
      goals: [],
      reviews: [],
      wheel: [],
      exportDate: new Date().toISOString(),
      version: this.DB_VERSION,
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    // Временная заглушка - просто парсим данные
    const data = JSON.parse(jsonData);
    console.log("Импортируемые данные:", data);

    // Здесь будет логика импорта в базу данных
    // Пока просто логируем
  }
}

// Только один экспорт!
export const dbManager = new DatabaseManager();
