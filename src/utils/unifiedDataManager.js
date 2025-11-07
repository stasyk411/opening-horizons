// 🚀 ENHANCED UNIFIED DATA MANAGER
class UnifiedDataManager {
  constructor() {
    console.log("🔄 Enhanced UDM инициализирован");
    this.cache = new Map();
  }

  async saveTasks(architecture, tasks) {
    console.log(
      `📤 ${architecture}: Сохранение задач в LocalStorage`,
      tasks.length
    );
    const key = `${architecture}-tasks`;
    localStorage.setItem(key, JSON.stringify(tasks));
    this.cache.set(key, tasks);
    return Promise.resolve();
  }

  async loadTasks(architecture) {
    const key = `${architecture}-tasks`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    const data = localStorage.getItem(key);
    const tasks = data ? JSON.parse(data) : [];
    console.log(
      `📥 ${architecture}: Загрузка задач из LocalStorage`,
      tasks.length
    );
    this.cache.set(key, tasks);
    return tasks;
  }

  async syncData() {
    console.log("🔄 Улучшенная синхронизация данных...");

    try {
      // Загружаем данные из ВСЕХ архитектур
      const featureTasks = await this.loadTasks("feature");
      const minimalistTasks = await this.loadTasks("minimalist");
      const reactTasks = await this.loadTasks("react");

      console.log(
        `📊 Feature: ${featureTasks.length}, Minimalist: ${minimalistTasks.length}, React: ${reactTasks.length}`
      );

      // 🔥 УЛУЧШЕННАЯ ЛОГИКА: объединяем задачи из всех источников
      const allTasks = [...featureTasks, ...minimalistTasks, ...reactTasks];

      // Убираем дубликаты по ID
      const uniqueTasks = allTasks.filter(
        (task, index, array) =>
          array.findIndex((t) => t.id === task.id) === index
      );

      console.log(`🎯 Объединено ${uniqueTasks.length} уникальных задач`);

      // 🔥 СОХРАНЯЕМ ВО ВСЕ АРХИТЕКТУРЫ
      if (uniqueTasks.length > 0) {
        await this.saveTasks("feature", uniqueTasks);
        await this.saveTasks("minimalist", uniqueTasks);
        await this.saveTasks("react", uniqueTasks);
      }

      console.log("✅ Улучшенная синхронизация завершена");
    } catch (error) {
      console.error("❌ Ошибка синхронизации:", error);
    }
  }
}

// Глобальный экземпляр
window.unifiedDataManager = new UnifiedDataManager();
console.log("✅ Enhanced UDM готов");
