// Unified Data Manager - Менеджер синхронизации данных между архитектурами
class UnifiedDataManager {
    constructor() {
        console.log("🔄 Unified Data Manager инициализирован");
        this.currentArchitecture = 'react'; // react, feature, minimalist
        this.dataHandlers = new Map();
        this.syncEnabled = true;
        this.init();
    }

    init() {
        console.log("🎯 Инициализация Unified Data Manager...");
        this.setupEventListeners();
        this.setupDataHandlers();
    }

    // Регистрация обработчиков данных для каждой архитектуры
    setupDataHandlers() {
        // React Architecture Handler (Firebase)
        this.dataHandlers.set('react', {
            loadTasks: async () => {
                console.log("📥 React: Загрузка задач из Firebase");
                // Здесь будет интеграция с useFirebaseTasks
                return [];
            },
            saveTasks: async (tasks) => {
                console.log("📤 React: Сохранение задач в Firebase", tasks.length);
                // Здесь будет интеграция с Firebase
            },
            getTasks: () => {
                // Получение задач из React состояния
                return window.reactTasks || [];
            }
        });

        // Feature-Based Architecture Handler (LocalStorage)
        this.dataHandlers.set('feature', {
            loadTasks: async () => {
                console.log("📥 Feature: Загрузка задач из LocalStorage");
                const saved = localStorage.getItem("feature-tasks");
                return saved ? JSON.parse(saved) : [];
            },
            saveTasks: async (tasks) => {
                console.log("📤 Feature: Сохранение задач в LocalStorage", tasks.length);
                localStorage.setItem("feature-tasks", JSON.stringify(tasks));
            },
            getTasks: () => {
                // Получение текущих задач из Feature-Based состояния
                return window.featureTasks || [];
            }
        });

        // Minimalist Architecture Handler (LocalStorage)
        this.dataHandlers.set('minimalist', {
            loadTasks: async () => {
                console.log("📥 Minimalist: Загрузка задач из LocalStorage");
                const saved = localStorage.getItem("minimalist-tasks");
                return saved ? JSON.parse(saved) : [];
            },
            saveTasks: async (tasks) => {
                console.log("📤 Minimalist: Сохранение задач в LocalStorage", tasks.length);
                localStorage.setItem("minimalist-tasks", JSON.stringify(tasks));
            },
            getTasks: () => {
                // Получение текущих задач из Minimalist состояния
                return window.minimalistTasks || [];
            }
        });
    }

    // Настройка слушателей событий
    setupEventListeners() {
        // Слушаем события смены архитектуры
        document.addEventListener('architectureChanged', (event) => {
            this.currentArchitecture = event.detail.architecture;
            console.log("🏗️ Архитектура изменена на:", this.currentArchitecture);
            this.syncData();
        });

        // Слушаем события изменения данных
        document.addEventListener('dataChanged', (event) => {
            if (this.syncEnabled) {
                console.log("🔄 Обнаружено изменение данных, запускаем синхронизацию...");
                this.syncData();
            }
        });
    }

    // Основной метод синхронизации данных
    async syncData() {
        if (!this.syncEnabled) return;

        console.log("🔄 Запуск синхронизации данных между архитектурами...");

        try {
            // Получаем задачи из текущей активной архитектуры
            const currentHandler = this.dataHandlers.get(this.currentArchitecture);
            if (!currentHandler) {
                console.error("❌ Обработчик для текущей архитектуры не найден");
                return;
            }

            const currentTasks = await currentHandler.loadTasks();
            console.log("📊 Загружено задач из", this.currentArchitecture + ":", currentTasks.length);

            // Синхронизируем с другими архитектурами
            for (const [arch, handler] of this.dataHandlers.entries()) {
                if (arch !== this.currentArchitecture) {
                    console.log("🔄 Синхронизация с", arch + "...");
                    await handler.saveTasks(this.transformTasks(currentTasks, arch));
                }
            }

            console.log("✅ Синхронизация данных завершена успешно!");

        } catch (error) {
            console.error("❌ Ошибка при синхронизации данных:", error);
        }
    }

    // Трансформация задач между разными форматами архитектур
    transformTasks(tasks, targetArchitecture) {
        console.log("🔄 Трансформация задач для", targetArchitecture);

        return tasks.map(task => {
            // Базовые поля, общие для всех архитектур
            const baseTask = {
                id: task.id || Date.now().toString(),
                title: task.title || 'Без названия',
                completed: task.completed || false,
                createdAt: task.createdAt || new Date().toISOString()
            };

            // Специфичные преобразования для каждой архитектуры
            switch (targetArchitecture) {
                case 'react':
                    return {
                        ...baseTask,
                        description: task.description || '',
                        sphere: task.area || task.sphere || 'general',
                        category: task.category || 'default',
                        priority: task.priority || 'medium',
                        updatedAt: new Date().toISOString(),
                        userId: task.userId || 'default-user'
                    };

                case 'feature':
                    return {
                        ...baseTask,
                        area: task.sphere || task.area || 'general'
                    };

                case 'minimalist':
                    return {
                        ...baseTask,
                        // Minimalist использует минимальную структуру
                        area: task.sphere || task.area || 'general'
                    };

                default:
                    return baseTask;
            }
        });
    }

    // Ручной запуск синхронизации
    async manualSync() {
        console.log("🔄 Ручной запуск синхронизации...");
        await this.syncData();
    }

    // Включение/выключение синхронизации
    setSyncEnabled(enabled) {
        this.syncEnabled = enabled;
        console.log("🔧 Синхронизация", enabled ? 'включена' : 'выключена');
    }

    // Получение статуса синхронизации
    getStatus() {
        return {
            currentArchitecture: this.currentArchitecture,
            syncEnabled: this.syncEnabled,
            dataHandlers: Array.from(this.dataHandlers.keys())
        };
    }
}

// Создаем глобальный экземпляр менеджера данных
window.unifiedDataManager = new UnifiedDataManager();

export default UnifiedDataManager;
