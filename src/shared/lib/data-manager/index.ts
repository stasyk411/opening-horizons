import { openDB, DBSchema, IDBPDatabase } from "idb";
import {
  Task,
  Goal,
  DailyReview,
  WheelState,
  LifeSphere,
  Mood,
} from "../../types";

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

class DataManager {
  private db: IDBPDatabase<OpeningHorizonsDB> | null = null;
  private readonly DB_NAME = "OpeningHorizonsDB";
  private readonly DB_VERSION = 2; // Увеличиваем версию для новых индексов

  async init(): Promise<void> {
    this.db = await openDB<OpeningHorizonsDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db, oldVersion) {
        // Миграции для обновления версий
        if (oldVersion < 1) {
          // Tasks store
          const taskStore = db.createObjectStore("tasks", { keyPath: "id" });
          taskStore.createIndex("by-date", "date");
          taskStore.createIndex("by-sphere", "sphere");

          // Goals store
          db.createObjectStore("goals", { keyPath: "id" });

          // Reviews store
          const reviewStore = db.createObjectStore("reviews", {
            keyPath: "id",
          });
          reviewStore.createIndex("by-date", "date");

          // Wheel state store
          db.createObjectStore("wheel", { keyPath: "sphere" });
        }

        if (oldVersion < 2) {
          // Добавляем индекс для задач по цели
          const transaction = db.transaction("tasks", "readwrite");
          const taskStore = transaction.objectStore("tasks");
          if (!taskStore.indexNames.contains("by-goal")) {
            taskStore.createIndex("by-goal", "goalId");
          }
        }
      },
    });
  }

  // ==================== TASK METHODS ====================

  async getTasks(date?: string): Promise<Task[]> {
    await this.ensureDB();
    if (date) {
      return this.db!.getAllFromIndex("tasks", "by-date", date);
    }
    return this.db!.getAll("tasks");
  }

  async getTasksByGoal(goalId: string): Promise<Task[]> {
    await this.ensureDB();
    return this.db!.getAllFromIndex("tasks", "by-goal", goalId);
  }

  async addTask(task: Omit<Task, "id">): Promise<void> {
    await this.ensureDB();
    const taskWithId: Task = {
      ...task,
      id: this.generateId(),
    };
    await this.db!.add("tasks", taskWithId);
  }

  async updateTask(task: Task): Promise<void> {
    await this.ensureDB();
    await this.db!.put("tasks", task);
  }

  async toggleTask(id: string): Promise<void> {
    await this.ensureDB();
    const task = await this.db!.get("tasks", id);
    if (!task) return;

    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    await this.db!.put("tasks", updatedTask);

    // Автоматическое создание следующей повторяющейся задачи
    if (updatedTask.isCompleted && task.recurrence !== "none") {
      const nextDate = this.calculateNextRecurrence(task.date, task.recurrence);
      const nextTask: Omit<Task, "id"> = {
        ...task,
        date: nextDate,
        isCompleted: false,
      };
      await this.addTask(nextTask);
    }
  }

  async moveTaskToCove(id: string): Promise<void> {
    await this.ensureDB();
    const task = await this.db!.get("tasks", id);
    if (!task) return;

    const updatedTask = { ...task, date: null };
    await this.db!.put("tasks", updatedTask);
  }

  async deleteTask(id: string): Promise<void> {
    await this.ensureDB();
    await this.db!.delete("tasks", id);
  }

  // ==================== GOAL METHODS ====================

  async getGoals(): Promise<Goal[]> {
    await this.ensureDB();
    return this.db!.getAll("goals");
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    await this.ensureDB();
    return this.db!.get("goals", id);
  }

  async addGoal(goal: Omit<Goal, "id">): Promise<string> {
    await this.ensureDB();
    const goalWithId: Goal = {
      ...goal,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };
    await this.db!.add("goals", goalWithId);
    return goalWithId.id;
  }

  async updateGoal(goal: Goal): Promise<void> {
    await this.ensureDB();
    await this.db!.put("goals", goal);
  }

  async deleteGoal(goalId: string): Promise<void> {
    await this.ensureDB();

    // Удаляем все задачи, связанные с этой целью
    const tasks = await this.getTasksByGoal(goalId);
    const transaction = this.db!.transaction(["tasks", "goals"], "readwrite");

    for (const task of tasks) {
      await transaction.objectStore("tasks").delete(task.id);
    }

    await transaction.objectStore("goals").delete(goalId);
    await transaction.done;
  }

  async calculateGoalProgress(goalId: string): Promise<number> {
    const tasks = await this.getTasksByGoal(goalId);
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter((task) => task.isCompleted);
    return (completedTasks.length / tasks.length) * 100;
  }

  // ==================== REVIEW METHODS ====================

  async saveDailyReview(review: Omit<DailyReview, "id">): Promise<void> {
    await this.ensureDB();
    const reviewWithId: DailyReview = {
      ...review,
      id: this.generateId(),
    };
    await this.db!.add("reviews", reviewWithId);
  }

  async getTodayReview(): Promise<DailyReview | undefined> {
    await this.ensureDB();
    const today = new Date().toISOString().split("T")[0];
    const reviews = await this.db!.getAllFromIndex("reviews", "by-date");
    return reviews.find((review) => review.date.startsWith(today));
  }

  async getReviews(): Promise<DailyReview[]> {
    await this.ensureDB();
    return this.db!.getAll("reviews");
  }

  async deleteReview(id: string): Promise<void> {
    await this.ensureDB();
    await this.db!.delete("reviews", id);
  }

  // ==================== WHEEL METHODS ====================

  async updateWheelMood(sphere: LifeSphere, mood: Mood): Promise<void> {
    await this.ensureDB();
    const state: WheelState = {
      sphere,
      mood,
      lastUpdated: new Date().toISOString(),
    };
    await this.db!.put("wheel", state);
  }

  async getWheelState(): Promise<WheelState[]> {
    await this.ensureDB();
    return this.db!.getAll("wheel");
  }

  async getWheelStateBySphere(
    sphere: LifeSphere
  ): Promise<WheelState | undefined> {
    await this.ensureDB();
    return this.db!.get("wheel", sphere);
  }

  // ==================== UTILITY METHODS ====================

  async clearAllData(): Promise<void> {
    await this.ensureDB();
    const transaction = this.db!.transaction(
      ["tasks", "goals", "reviews", "wheel"],
      "readwrite"
    );

    await transaction.objectStore("tasks").clear();
    await transaction.objectStore("goals").clear();
    await transaction.objectStore("reviews").clear();
    await transaction.objectStore("wheel").clear();

    await transaction.done;
  }

  async exportData(): Promise<string> {
    await this.ensureDB();
    const data = {
      tasks: await this.getTasks(),
      goals: await this.getGoals(),
      reviews: await this.getReviews(),
      wheel: await this.getWheelState(),
      exportDate: new Date().toISOString(),
      version: this.DB_VERSION,
    };
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    await this.ensureDB();
    const data = JSON.parse(jsonData);

    const transaction = this.db!.transaction(
      ["tasks", "goals", "reviews", "wheel"],
      "readwrite"
    );

    if (data.tasks) {
      for (const task of data.tasks) {
        await transaction.objectStore("tasks").put(task);
      }
    }

    if (data.goals) {
      for (const goal of data.goals) {
        await transaction.objectStore("goals").put(goal);
      }
    }

    if (data.reviews) {
      for (const review of data.reviews) {
        await transaction.objectStore("reviews").put(review);
      }
    }

    if (data.wheel) {
      for (const wheelState of data.wheel) {
        await transaction.objectStore("wheel").put(wheelState);
      }
    }

    await transaction.done;
  }

  // ==================== PRIVATE METHODS ====================

  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateNextRecurrence(
    currentDate: string | null,
    recurrence: RecurrenceType
  ): string {
    const date = currentDate ? new Date(currentDate) : new Date();

    switch (recurrence) {
      case "daily":
        date.setDate(date.getDate() + 1);
        break;
      case "weekly":
        date.setDate(date.getDate() + 7);
        break;
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        return currentDate || new Date().toISOString();
    }

    return date.toISOString().split("T")[0];
  }

  // ==================== STATISTICS METHODS ====================

  async getTaskStatistics(): Promise<{
    total: number;
    completed: number;
    bySphere: Record<LifeSphere, number>;
    byPriority: Record<string, number>;
  }> {
    const tasks = await this.getTasks();
    const bySphere: Record<LifeSphere, number> = {
      health: 0,
      development: 0,
      finance: 0,
      hobby: 0,
      family: 0,
      career: 0,
    };

    const byPriority: Record<string, number> = {
      high: 0,
      medium: 0,
      low: 0,
      none: 0,
    };

    tasks.forEach((task) => {
      bySphere[task.sphere]++;
      byPriority[task.priority]++;
    });

    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.isCompleted).length,
      bySphere,
      byPriority,
    };
  }

  async getGoalsWithProgress(): Promise<(Goal & { progress: number })[]> {
    const goals = await this.getGoals();
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const progress = await this.calculateGoalProgress(goal.id);
        return { ...goal, progress };
      })
    );
    return goalsWithProgress;
  }
}

export const dataManager = new DataManager();
