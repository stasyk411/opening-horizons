// Unified Data Manager - центральный хаб для управления данными across архитектур
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  architectures: ArchData[];
}

export interface ArchData {
  id: string;
  projectId: string;
  type: string;
  data: any;
}

export interface ArchitectureHandler {
  readonly architectureType: string;
  saveProject(projectData: ProjectData): Promise<void>;
  loadProject(projectId: string): Promise<ProjectData | null>;
  updateArchitecture(archData: ArchData): Promise<void>;
  validateData(data: any): boolean;
}

// Базовый обработчик с fallback на localStorage
class FallbackHandler implements ArchitectureHandler {
  readonly architectureType = "fallback";

  async saveProject(projectData: ProjectData): Promise<void> {
    const key = `project_${projectData.id}`;
    localStorage.setItem(key, JSON.stringify(projectData));
  }

  async loadProject(projectId: string): Promise<ProjectData | null> {
    const key = `project_${projectId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async updateArchitecture(archData: ArchData): Promise<void> {
    const project = await this.loadProject(archData.projectId);
    if (project) {
      const index = project.architectures.findIndex(
        (arch) => arch.id === archData.id
      );
      if (index >= 0) {
        project.architectures[index] = archData;
      } else {
        project.architectures.push(archData);
      }
      await this.saveProject(project);
    }
  }

  validateData(data: any): boolean {
    return data && typeof data.id === "string";
  }
}

// Обработчик для Feature-Based архитектуры
export class FeatureBasedHandler implements ArchitectureHandler {
  readonly architectureType = "feature";

  async saveProject(projectData: ProjectData): Promise<void> {
    console.log(`[FeatureBasedHandler] Saving project: ${projectData.id}`);
    const key = `feature_project_${projectData.id}`;
    localStorage.setItem(key, JSON.stringify(projectData));
  }

  async loadProject(projectId: string): Promise<ProjectData | null> {
    console.log(`[FeatureBasedHandler] Loading project: ${projectId}`);
    const key = `feature_project_${projectId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async updateArchitecture(archData: ArchData): Promise<void> {
    console.log(`[FeatureBasedHandler] Updating architecture: ${archData.id}`);
    const projectKey = `feature_project_${archData.projectId}`;
    const existingData = localStorage.getItem(projectKey);

    if (existingData) {
      const projectData: ProjectData = JSON.parse(existingData);
      const index = projectData.architectures.findIndex(
        (arch) => arch.id === archData.id
      );
      if (index >= 0) {
        projectData.architectures[index] = archData;
      } else {
        projectData.architectures.push(archData);
      }
      localStorage.setItem(projectKey, JSON.stringify(projectData));
    }
  }

  validateData(data: any): boolean {
    return (
      data && typeof data.id === "string" && Array.isArray(data.architectures)
    );
  }

  // Специфичные методы для Feature-Based архитектуры
  async loadTasks(projectId: string): Promise<Task[]> {
    const project = await this.loadProject(projectId);
    return (
      project?.architectures.find((arch) => arch.type === "tasks")?.data || []
    );
  }

  async saveTasks(projectId: string, tasks: Task[]): Promise<void> {
    const project = (await this.loadProject(projectId)) || {
      id: projectId,
      name: "Default Project",
      architectures: [],
    };

    const taskArchIndex = project.architectures.findIndex(
      (arch) => arch.type === "tasks"
    );
    const taskArch: ArchData = {
      id: `tasks_${projectId}`,
      projectId,
      type: "tasks",
      data: tasks,
    };

    if (taskArchIndex >= 0) {
      project.architectures[taskArchIndex] = taskArch;
    } else {
      project.architectures.push(taskArch);
    }

    await this.saveProject(project);
  }
}

// Обработчик для Minimalist архитектуры
export class MinimalistHandler implements ArchitectureHandler {
  readonly architectureType = "minimalist";

  async saveProject(projectData: ProjectData): Promise<void> {
    console.log(`[MinimalistHandler] Saving project: ${projectData.id}`);
    const key = `minimalist_project_${projectData.id}`;
    localStorage.setItem(key, JSON.stringify(projectData));
  }

  async loadProject(projectId: string): Promise<ProjectData | null> {
    console.log(`[MinimalistHandler] Loading project: ${projectId}`);
    const key = `minimalist_project_${projectId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async updateArchitecture(archData: ArchData): Promise<void> {
    console.log(`[MinimalistHandler] Updating architecture: ${archData.id}`);
    // Minimalist подход - только основные данные
    const projectKey = `minimalist_project_${archData.projectId}`;
    const existingData = localStorage.getItem(projectKey);

    if (existingData) {
      const projectData: ProjectData = JSON.parse(existingData);
      // Minimalist: сохраняем только последнюю архитектуру
      projectData.architectures = [archData];
      localStorage.setItem(projectKey, JSON.stringify(projectData));
    }
  }

  validateData(data: any): boolean {
    // Minimalist валидация - только базовые поля
    return data && typeof data.id === "string";
  }

  async loadTasks(projectId: string): Promise<Task[]> {
    const project = await this.loadProject(projectId);
    return project?.architectures[0]?.data || [];
  }

  async saveTasks(projectId: string, tasks: Task[]): Promise<void> {
    const archData: ArchData = {
      id: `minimalist_${projectId}`,
      projectId,
      type: "minimalist_tasks",
      data: tasks,
    };

    const project: ProjectData = {
      id: projectId,
      name: "Minimalist Project",
      architectures: [archData],
    };

    await this.saveProject(project);
  }
}

// Главный класс Unified Data Manager
export class UnifiedDataManager {
  private static instance: UnifiedDataManager;
  private architectureHandlers: Map<string, ArchitectureHandler> = new Map();
  private fallbackHandler: ArchitectureHandler = new FallbackHandler();

  private constructor() {
    this.initHandlers();
    this.setupGlobalInstance();
  }

  public static getInstance(): UnifiedDataManager {
    if (!UnifiedDataManager.instance) {
      UnifiedDataManager.instance = new UnifiedDataManager();
    }
    return UnifiedDataManager.instance;
  }

  private initHandlers(): void {
    // Регистрируем обработчики для всех архитектур
    this.registerHandler(new FeatureBasedHandler());
    this.registerHandler(new MinimalistHandler());

    console.log(
      "✅ Unified Data Manager инициализирован с обработчиками:",
      Array.from(this.architectureHandlers.keys())
    );
  }

  private setupGlobalInstance(): void {
    // Делаем менеджер доступным глобально для тестов и отладки
    (window as any).unifiedDataManager = {
      dataHandlers: this.architectureHandlers,
      queueSync: this.queueSync.bind(this),
      getHandler: this.getHandler.bind(this),
    };

    // Отправляем событие о готовности
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent("unifiedDataManagerReady"));
    }, 100);
  }

  public registerHandler(handler: ArchitectureHandler): void {
    this.architectureHandlers.set(handler.architectureType, handler);
    console.log(
      `✅ Зарегистрирован обработчик для архитектуры: ${handler.architectureType}`
    );
  }

  public getHandler(architecture: string): ArchitectureHandler {
    return this.architectureHandlers.get(architecture) || this.fallbackHandler;
  }

  public async queueSync(): Promise<void> {
    console.log("🔄 Unified Data Manager: запуск синхронизации...");

    try {
      // Здесь будет логика синхронизации между архитектурами
      await this.syncAllArchitectures();

      document.dispatchEvent(new CustomEvent("syncCompleted"));
      console.log("✅ Синхронизация завершена");
    } catch (error) {
      console.error("❌ Ошибка синхронизации:", error);
    }
  }

  private async syncAllArchitectures(): Promise<void> {
    // Базовая логика синхронизации
    // В реальном приложении здесь будет сложная логика преобразования данных
    console.log("🔄 Синхронизация данных между архитектурами...");
    await new Promise((resolve) => setTimeout(resolve, 100)); // Имитация работы
  }

  // Публичные методы для работы с задачами
  public async loadTasks(
    architecture: string,
    projectId: string = "default"
  ): Promise<Task[]> {
    const handler = this.getHandler(architecture);

    if (handler.architectureType === "feature" && "loadTasks" in handler) {
      return await (handler as FeatureBasedHandler).loadTasks(projectId);
    } else if (
      handler.architectureType === "minimalist" &&
      "loadTasks" in handler
    ) {
      return await (handler as MinimalistHandler).loadTasks(projectId);
    } else {
      // Fallback на localStorage
      const data = localStorage.getItem("life-wheel-tasks");
      return data ? JSON.parse(data) : [];
    }
  }

  public async saveTasks(
    architecture: string,
    tasks: Task[],
    projectId: string = "default"
  ): Promise<void> {
    const handler = this.getHandler(architecture);

    if (handler.architectureType === "feature" && "saveTasks" in handler) {
      await (handler as FeatureBasedHandler).saveTasks(projectId, tasks);
    } else if (
      handler.architectureType === "minimalist" &&
      "saveTasks" in handler
    ) {
      await (handler as MinimalistHandler).saveTasks(projectId, tasks);
    } else {
      // Fallback на localStorage
      localStorage.setItem("life-wheel-tasks", JSON.stringify(tasks));
    }

    // Запускаем синхронизацию после сохранения
    this.queueSync();
  }
}

// Создаем глобальный экземпляр при импорте
export const unifiedDataManager = UnifiedDataManager.getInstance();
