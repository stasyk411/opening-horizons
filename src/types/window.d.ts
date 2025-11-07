// types/window.d.ts
declare global {
  interface Window {
    unifiedDataManager: {
      // 🔥 ДОБАВЬ ЭТИ МЕТОДЫ:
      loadTasks(architecture: string): Promise<any[]>;
      saveTasks(architecture: string, tasks: any[]): Promise<void>;

      // Существующие методы:
      syncData(): Promise<void>;
      queueSync?(): void;
      dataHandlers?: Map<string, any>;
      currentArchitecture?: string;

      // 🔥 ДОБАВЬ КЭШ (если используется):
      cache?: Map<string, any>;
    };
  }
}

export {};
