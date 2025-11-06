// 🚀 ENHANCED UNIFIED DATA MANAGER - Улучшенный менеджер синхронизации
class UnifiedDataManager {
  constructor() {
    console.log("🔄 Enhanced Unified Data Manager инициализирован");
    this.currentArchitecture = "react";
    this.dataHandlers = new Map();
    this.syncEnabled = true;
    this.cache = new Map();
    this.syncQueue = [];
    this.isSyncing = false;
    this.errorCount = 0;
    this.maxRetries = 3;

    this.init();
  }

  init() {
    console.log("🎯 Инициализация Enhanced Unified Data Manager...");
    this.setupEventListeners();
    this.setupDataHandlers();
    this.setupCacheCleanup();

    // 🔥 ВАЖНОЕ ИСПРАВЛЕНИЕ: Отправляем событие когда готов
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent("unifiedDataManagerReady"));
      console.log("✅ Unified Data Manager полностью инициализирован и готов");
    }, 100);
  }

  // 🔧 НАСТРОЙКА ОБРАБОТЧИКОВ ДАННЫХ С ВАЛИДАЦИЕЙ
  setupDataHandlers() {
    // 🔥 ИСПРАВЛЕННЫЕ СХЕМЫ ВАЛИДАЦИИ
    const schemas = {
      react: ["id", "title", "completed", "createdAt"],
      feature: ["id", "title", "area", "completed", "createdAt"],
      minimalist: ["id", "title", "completed", "createdAt", "area"],
    };

    // React Architecture Handler
    this.dataHandlers.set("react", {
      loadTasks: async () => {
        console.log("📥 React: Загрузка задач из Firebase");
        try {
          const tasks = (await this.loadFromCache("react-tasks")) || [];
          return this.validateData(tasks, schemas.react, "react");
        } catch (error) {
          console.error("❌ React: Ошибка загрузки:", error);
          return [];
        }
      },
      saveTasks: async (tasks) => {
        console.log("📤 React: Сохранение задач в Firebase", tasks.length);
        const validatedTasks = this.validateData(tasks, schemas.react, "react");
        await this.saveToCache("react-tasks", validatedTasks);
        // Здесь будет интеграция с Firebase
      },
      getTasks: () => {
        return window.reactTasks || [];
      },
    });

    // Feature-Based Architecture Handler
    this.dataHandlers.set("feature", {
      loadTasks: async () => {
        console.log("📥 Feature: Загрузка задач из LocalStorage");
        try {
          const saved = localStorage.getItem("feature-tasks");
          const tasks = saved ? JSON.parse(saved) : [];
          return this.validateData(tasks, schemas.feature, "feature");
        } catch (error) {
          console.error("❌ Feature: Ошибка загрузки:", error);
          return [];
        }
      },
      saveTasks: async (tasks) => {
        console.log(
          "📤 Feature: Сохранение задач в LocalStorage",
          tasks.length
        );
        try {
          const validatedTasks = this.validateData(
            tasks,
            schemas.feature,
            "feature"
          );
          localStorage.setItem("feature-tasks", JSON.stringify(validatedTasks));
          await this.saveToCache("feature-tasks", validatedTasks);
        } catch (error) {
          console.error("❌ Feature: Ошибка сохранения:", error);
          throw error;
        }
      },
      getTasks: () => {
        return window.featureTasks || [];
      },
    });

    // Minimalist Architecture Handler
    this.dataHandlers.set("minimalist", {
      loadTasks: async () => {
        console.log("📥 Minimalist: Загрузка задач из LocalStorage");
        try {
          const saved = localStorage.getItem("minimalist-tasks");
          const tasks = saved ? JSON.parse(saved) : [];
          return this.validateData(tasks, schemas.minimalist, "minimalist");
        } catch (error) {
          console.error("❌ Minimalist: Ошибка загрузки:", error);
          return [];
        }
      },
      saveTasks: async (tasks) => {
        console.log(
          "📤 Minimalist: Сохранение задач в LocalStorage",
          tasks.length
        );
        try {
          const validatedTasks = this.validateData(
            tasks,
            schemas.minimalist,
            "minimalist"
          );
          localStorage.setItem(
            "minimalist-tasks",
            JSON.stringify(validatedTasks)
          );
          await this.saveToCache("minimalist-tasks", validatedTasks);
        } catch (error) {
          console.error("❌ Minimalist: Ошибка сохранения:", error);
          throw error;
        }
      },
      getTasks: () => {
        return window.minimalistTasks || [];
      },
    });
  }

  // ✅ УЛУЧШЕННАЯ ВАЛИДАЦИЯ ДАННЫХ
  validateData(data, schema, architecture) {
    if (!Array.isArray(data)) {
      console.warn(`⚠️ ${architecture}: Данные не являются массивом`);
      return [];
    }

    return data.filter((task) => {
      // 🔥 ВАЖНОЕ ИСПРАВЛЕНИЕ: Проверяем только ОБЯЗАТЕЛЬНЫЕ поля
      const requiredFields = ["id", "title", "completed", "createdAt"];
      const hasRequiredFields = requiredFields.every((field) =>
        task.hasOwnProperty(field)
      );

      if (!hasRequiredFields) {
        console.warn(
          `⚠️ ${architecture}: Задача с ID ${task.id} не имеет обязательных полей`,
          task
        );
        return false;
      }

      // 🔥 ДОПОЛНИТЕЛЬНО: Логируем проблемные задачи для отладки
      const missingFields = requiredFields.filter(
        (field) => !task.hasOwnProperty(field)
      );
      if (missingFields.length > 0) {
        console.warn(
          `⚠️ ${architecture}: Задача ${task.id} отсутствуют поля:`,
          missingFields
        );
      }

      return true;
    });
  }

  // 💾 КЭШИРОВАНИЕ ДАННЫХ
  async saveToCache(key, data) {
    const cacheItem = {
      data: data,
      timestamp: Date.now(),
      version: "1.0",
    };
    this.cache.set(key, cacheItem);
    console.log(`💾 Кэш обновлен для: ${key} (${data.length} записей)`);
  }

  async loadFromCache(key) {
    const cacheItem = this.cache.get(key);
    if (cacheItem && Date.now() - cacheItem.timestamp < 30000) {
      // 30 секунд
      console.log(`💾 Данные загружены из кэша: ${key}`);
      return cacheItem.data;
    }
    return null;
  }

  // 🧹 ОЧИСТКА КЭША
  setupCacheCleanup() {
    // Очищаем кэш каждые 5 минут
    setInterval(() => {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp > 300000) {
          // 5 минут
          this.cache.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 Очищен кэш: ${cleanedCount} записей`);
      }
    }, 300000);
  }

  // 🎯 НАСТРОЙКА СЛУШАТЕЛЕЙ СОБЫТИЙ
  setupEventListeners() {
    // Событие смены архитектуры
    document.addEventListener("architectureChanged", (event) => {
      this.currentArchitecture = event.detail.architecture;
      console.log("🏗️ Архитектура изменена на:", this.currentArchitecture);

      // 🔥 ВАЖНОЕ ИСПРАВЛЕНИЕ: Запускаем синхронизацию ПРИ КАЖДОМ переключении
      this.queueSync();
    });

    // Событие изменения данных
    document.addEventListener("dataChanged", (event) => {
      if (this.syncEnabled) {
        console.log(
          "🔄 Обнаружено изменение данных, добавляем в очередь синхронизации..."
        );
        this.queueSync();
      }
    });

    // Событие онлайн/оффлайн
    window.addEventListener("online", () => {
      console.log("🌐 Соединение восстановлено, запускаем синхронизацию...");
      this.queueSync();
    });

    window.addEventListener("offline", () => {
      console.log("📴 Соединение потеряно, синхронизация приостановлена");
    });
  }

  // 🔄 УПРАВЛЕНИЕ ОЧЕРЕДЬЮ СИНХРОНИЗАЦИИ
  queueSync() {
    if (this.syncQueue.length === 0) {
      this.syncQueue.push(Date.now());
      this.processSyncQueue();
    } else {
      this.syncQueue.push(Date.now());
    }
  }

  async processSyncQueue() {
    if (this.isSyncing || this.syncQueue.length === 0) return;

    this.isSyncing = true;
    const syncTime = this.syncQueue.shift();

    try {
      await this.performSyncWithRetry();
      console.log("✅ Синхронизация из очереди завершена");
    } catch (error) {
      console.error("❌ Ошибка синхронизации из очереди:", error);
      // Возвращаем задачу в очередь для повторной попытки
      this.syncQueue.unshift(syncTime);
    } finally {
      this.isSyncing = false;

      // Обрабатываем следующую задачу в очереди
      if (this.syncQueue.length > 0) {
        setTimeout(() => this.processSyncQueue(), 1000);
      }
    }
  }

  // 🔄 СИНХРОНИЗАЦИЯ С ПОВТОРНЫМИ ПОПЫТКАМИ
  async performSyncWithRetry(retryCount = 0) {
    try {
      await this.syncData();
      this.errorCount = 0; // Сбрасываем счетчик ошибок при успехе
    } catch (error) {
      this.errorCount++;

      if (retryCount < this.maxRetries) {
        console.log(
          `🔄 Повторная попытка синхронизации... (${retryCount + 1}/${
            this.maxRetries
          })`
        );
        await this.delay(1000 * (retryCount + 1)); // Экспоненциальная задержка
        return this.performSyncWithRetry(retryCount + 1);
      } else {
        console.error(
          `❌ Синхронизация не удалась после ${this.maxRetries} попыток`
        );
        throw error;
      }
    }
  }

  // ⏰ ЗАДЕРЖКА
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 🎯 ОСНОВНОЙ МЕТОД СИНХРОНИЗАЦИИ
  async syncData() {
    if (!this.syncEnabled) {
      console.log("⏸️ Синхронизация отключена");
      return;
    }

    console.log("🔄 Запуск синхронизации данных между архитектурами...");

    try {
      // Получаем задачи из текущей активной архитектуры
      const currentHandler = this.dataHandlers.get(this.currentArchitecture);
      if (!currentHandler) {
        throw new Error(
          `Обработчик для архитектуры ${this.currentArchitecture} не найден`
        );
      }

      const currentTasks = await currentHandler.loadTasks();
      console.log(
        "📊 Загружено задач из",
        this.currentArchitecture + ":",
        currentTasks.length,
        currentTasks
      );

      // Синхронизируем с другими архитектурами
      const syncPromises = [];

      for (const [arch, handler] of this.dataHandlers.entries()) {
        if (arch !== this.currentArchitecture) {
          console.log("🔄 Синхронизация с", arch + "...");

          // 🔥 КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Сохраняем исходные задачи
          // Вместо трансформации, которая теряет данные
          console.log(`📋 Сохраняем ${currentTasks.length} задач для ${arch}`);
          syncPromises.push(handler.saveTasks(currentTasks));
        }
      }

      await Promise.all(syncPromises);
      console.log("✅ Синхронизация данных завершена успешно!");

      // Отправляем событие успешной синхронизации
      document.dispatchEvent(
        new CustomEvent("syncCompleted", {
          detail: {
            source: this.currentArchitecture,
            taskCount: currentTasks.length,
            timestamp: new Date().toISOString(),
          },
        })
      );
    } catch (error) {
      console.error("❌ Ошибка при синхронизации данных:", error);

      // Отправляем событие ошибки синхронизации
      document.dispatchEvent(
        new CustomEvent("syncError", {
          detail: {
            error: error.message,
            architecture: this.currentArchitecture,
            timestamp: new Date().toISOString(),
          },
        })
      );

      throw error;
    }
  }

  // 🔄 УЛУЧШЕННАЯ ТРАНСФОРМАЦИЯ ЗАДАЧ МЕЖДУ АРХИТЕКТУРАМИ
  transformTasks(tasks, targetArchitecture) {
    console.log(
      `🔄 Трансформация ${tasks.length} задач для ${targetArchitecture}`
    );

    // 🔥 ВАЖНОЕ ИСПРАВЛЕНИЕ: Возвращаем задачи как есть
    // Временное решение - отключаем трансформацию чтобы не терять данные
    return tasks;
  }

  // 🎮 РУЧНОЕ УПРАВЛЕНИЕ
  async manualSync() {
    console.log("🔄 Ручной запуск синхронизации...");
    await this.syncData();
  }

  setSyncEnabled(enabled) {
    this.syncEnabled = enabled;
    console.log("🔧 Синхронизация", enabled ? "включена" : "выключена");
  }

  // 📊 СТАТУС И ДИАГНОСТИКА
  getStatus() {
    return {
      currentArchitecture: this.currentArchitecture,
      syncEnabled: this.syncEnabled,
      dataHandlers: Array.from(this.dataHandlers.keys()),
      cacheSize: this.cache.size,
      syncQueueLength: this.syncQueue.length,
      isSyncing: this.isSyncing,
      errorCount: this.errorCount,
    };
  }

  // 🧪 ДИАГНОСТИЧЕСКИЕ МЕТОДЫ
  clearCache() {
    this.cache.clear();
    console.log("🧹 Кэш полностью очищен");
  }

  getCacheStats() {
    const stats = {};
    for (const [key, value] of this.cache.entries()) {
      stats[key] = {
        entries: value.data.length,
        age: Date.now() - value.timestamp,
        version: value.version,
      };
    }
    return stats;
  }
}

// 🚀 СОЗДАЕМ ГЛОБАЛЬНЫЙ ЭКЗЕМПЛЯР
window.unifiedDataManager = new UnifiedDataManager();

// ✅ ЭКСПОРТ ДЛЯ TypeScript
export default UnifiedDataManager;
