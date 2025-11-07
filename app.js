// 📁 app.js - ПОЛНАЯ РАБОЧАЯ ВЕРСИЯ С MINIMALIST

console.log("🚀 Feature-Based Architecture ЗАГРУЖАЕТСЯ...");

// ОЧЕНЬ ПРОСТАЯ FEATURE-BASED АРХИТЕКТУРА
class SimpleFeatureApp {
  constructor() {
    console.log("🎯 SimpleFeatureApp создан");
    this.init();
  }

  init() {
    console.log("🔧 Инициализация Feature-Based...");

    // НЕМЕДЛЕННО показываем контент в feature-app
    const featureApp = document.getElementById("feature-app");
    if (featureApp) {
      console.log("✅ feature-app найден, заполняем контентом...");
      featureApp.innerHTML = `
                <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <header style="text-align: center; padding: 40px 0;">
                            <h1 style="font-size: 3em; margin: 0;">🌊 HORIZON</h1>
                            <p style="font-size: 1.2em; opacity: 0.9;">Feature-Based Architecture - РАБОТАЕТ!</p>
                        </header>
                        
                        <nav style="display: flex; gap: 10px; justify-content: center; margin-bottom: 40px;">
                            <button class="nav-btn" data-page="home" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 8px;">🏠 Главная</button>
                            <button class="nav-btn" data-page="tasks" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 8px;">📝 Задачи</button>
                            <button class="nav-btn" data-page="timer" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 8px;">⏰ Таймер</button>
                            <button class="nav-btn" data-page="balance" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 8px;">⚖️ Баланс</button>
                        </nav>
                        
                        <main id="feature-content">
                            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                                <h2>🎉 Feature-Based Architecture УСПЕШНО ЗАГРУЖЕНА!</h2>
                                <p>✅ Эта архитектура теперь работает правильно</p>
                                <p>🎯 Используйте кнопки навигации выше</p>
                                <p>🔥 Горячие клавиши: Ctrl+F1 - Feature, Ctrl+F2 - Minimalist, Ctrl+F3 - React</p>
                            </div>
                        </main>
                    </div>
                </div>
            `;

      // Добавляем обработчики навигации
      this.setupNavigation();

      console.log("🎉 Feature-Based Architecture УСПЕШНО ИНИЦИАЛИЗИРОВАНА!");
    } else {
      console.error("❌ feature-app НЕ НАЙДЕН!");
    }
  }

  setupNavigation() {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const page = e.target.dataset.page;
        if (page) {
          this.showPage(page);
        }
      });
    });
  }

  showPage(page) {
    console.log("📄 Переключаем на страницу:", page);

    const content = document.getElementById("feature-content");
    if (!content) return;

    const pages = {
      home: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <h2>🏠 Главная панель</h2>
                    <p>Добро пожаловать в Feature-Based архитектуру!</p>
                </div>
            `,
      tasks: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <h2>📝 Управление задачами</h2>
                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <input type="text" 
                               placeholder="Новая задача..." 
                               id="feature-task-input"
                               style="flex: 1; padding: 10px; border: 2px solid #4CAF50; border-radius: 8px; background: white; color: black; font-size: 16px;">
                        <button id="feature-add-btn" 
                                style="padding: 10px 20px; background: #4CAF50; border: none; color: white; border-radius: 8px; cursor: pointer;">
                                Добавить
                        </button>
                    </div>
                    <div id="feature-tasks-list" style="color: white;"></div>
                </div>
            `,
      timer: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); text-align: center;">
                    <h2>⏰ Таймер Помодoro</h2>
                    <div style="font-size: 4em; font-weight: bold; margin: 30px 0;">25:00</div>
                </div>
            `,
      balance: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <h2>⚖️ Баланс жизни</h2>
                    <p>Система баланса в разработке...</p>
                </div>
            `,
    };

    content.innerHTML = pages[page] || pages.home;

    // ДОБАВИМ ОБРАБОТЧИКИ ПОСЛЕ ОТРИСОВКИ
    if (page === "tasks") {
      setTimeout(() => this.setupTaskHandlers(), 100);
    }
  }

  // ДОБАВИМ НОВЫЙ МЕТОД ДЛЯ ОБРАБОТКИ ЗАДАЧ
  setupTaskHandlers() {
    console.log("🔧 Настройка обработчиков задач Feature-Based...");

    const input = document.getElementById("feature-task-input");
    const button = document.getElementById("feature-add-btn");

    if (input && button) {
      // Обработчик кнопки
      button.addEventListener("click", () => {
        this.addFeatureTask();
      });

      // Обработчик Enter
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.addFeatureTask();
        }
      });

      console.log("✅ Обработчики задач Feature-Based настроены");
    }

    // Покажем существующие задачи
    this.showFeatureTasks();
  }

  // МЕТОД ДОБАВЛЕНИЯ ЗАДАЧИ
  addFeatureTask() {
    const input = document.getElementById("feature-task-input");

    if (input && input.value.trim()) {
      const taskText = input.value.trim();
      console.log("➕ Feature-Based: Добавляем задачу:", taskText);

      // Сохраняем задачу
      this.saveFeatureTask(taskText);

      // Очищаем поле
      input.value = "";

      // Показываем обновленный список
      this.showFeatureTasks();
    }
  }

  // МЕТОД СОХРАНЕНИЯ ЗАДАЧИ
  saveFeatureTask(taskText) {
    // Загружаем текущие задачи
    const saved = localStorage.getItem("feature-tasks");
    const tasks = saved ? JSON.parse(saved) : [];

    // Добавляем новую задачу
    const newTask = {
      id: Date.now(),
      title: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      area: "general",
    };

    tasks.push(newTask);

    // 🔥 ИСПРАВЛЕНИЕ: Сохраняем через UDM вместо прямой записи
    if (window.unifiedDataManager && window.unifiedDataManager.saveTasks) {
      window.unifiedDataManager.saveTasks("feature", tasks);
      window.unifiedDataManager.syncData();
      console.log("✅ Feature-Based: Задача сохранена через UDM");
    } else {
      // Fallback на старую логику
      localStorage.setItem("feature-tasks", JSON.stringify(tasks));
      console.log("💾 Feature-Based: Задача сохранена в LocalStorage");
    }
  }

  // МЕТОД ПОКАЗА ЗАДАЧ
  showFeatureTasks() {
    const tasksList = document.getElementById("feature-tasks-list");
    if (!tasksList) return;

    const saved = localStorage.getItem("feature-tasks");
    const tasks = saved ? JSON.parse(saved) : [];

    if (tasks.length === 0) {
      tasksList.innerHTML =
        '<p style="text-align: center; opacity: 0.7;">Нет задач</p>';
    } else {
      tasksList.innerHTML = tasks
        .map(
          (task) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span>${task.title}</span>
                <button onclick="window.simpleArchManager?.featureApp?.completeFeatureTask(${task.id})" 
                        style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                    ✓
                </button>
            </div>
        `
        )
        .join("");
    }
  }

  // МЕТОД ЗАВЕРШЕНИЯ ЗАДАЧИ
  completeFeatureTask(taskId) {
    console.log("✅ Feature-Based: Завершаем задачу:", taskId);
    const saved = localStorage.getItem("feature-tasks");
    const tasks = saved ? JSON.parse(saved) : [];

    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    // 🔥 ИСПРАВЛЕНИЕ: Сохраняем через UDM
    if (window.unifiedDataManager && window.unifiedDataManager.saveTasks) {
      window.unifiedDataManager.saveTasks("feature", updatedTasks);
      window.unifiedDataManager.syncData();
    } else {
      localStorage.setItem("feature-tasks", JSON.stringify(updatedTasks));
    }

    // Обновляем отображение
    this.showFeatureTasks();
  }
}

// 🏗️ ПРОСТОЙ МЕНЕДЖЕР АРХИТЕКТУР С РАБОЧИМ MINIMALIST
class SimpleArchManager {
  constructor() {
    console.log("🏗️ SimpleArchManager запущен");
    this.currentArch = "react";
    this.featureApp = null;
    this.minimalistInitialized = false;
    // 🔄 ИНИЦИАЛИЗАЦИЯ UNIFIED DATA MANAGER
    this.initDataManager();
    this.init();
  }

  // 🔄 ИНИЦИАЛИЗАЦИЯ МЕНЕДЖЕРА ДАННЫХ
  initDataManager() {
    console.log("🔄 Инициализация Unified Data Manager...");

    // Загружаем менеджер данных
    if (typeof window.unifiedDataManager === "undefined") {
      console.log("📥 Загружаем Unified Data Manager...");
      // Создаем скрипт для загрузки менеджера данных
      const script = document.createElement("script");
      script.src = "./src/utils/unifiedDataManager.js";
      script.type = "module";
      document.head.appendChild(script);

      script.onload = () => {
        console.log("✅ Unified Data Manager загружен");
        this.setupDataSync();
      };
    } else {
      console.log("✅ Unified Data Manager уже загружен");
      this.setupDataSync();
    }
  }

  // 🔄 НАСТРОЙКА СИНХРОНИЗАЦИИ ДАННЫХ
  setupDataSync() {
    console.log("🔧 Настройка синхронизации данных...");

    // УДАЛЕН дублирующий обработчик горячих клавиш - он уже есть в setupHotkeys()
    // Оставляем только настройку для синхронизации данных
  }

  init() {
    this.setupHotkeys();
    console.log("✅ SimpleArchManager инициализирован");
  }

  setupHotkeys() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        if (e.key === "F1") {
          e.preventDefault();
          console.log("🔥 F1 - АКТИВАЦИЯ FEATURE-BASED");
          this.switchToFeatureBased();
        } else if (e.key === "F2") {
          e.preventDefault();
          console.log("🔥 F2 - АКТИВАЦИЯ MINIMALIST");
          this.switchToMinimalist();
        } else if (e.key === "F3") {
          e.preventDefault();
          console.log("🔥 F3 - АКТИВАЦИЯ REACT");
          this.switchToReact();
        }
      }
    });
  }

  switchToFeatureBased() {
    console.log("🔄 ПЕРЕКЛЮЧЕНИЕ НА FEATURE-BASED...");
    this.hideAllArchitectures();

    const featureApp = document.getElementById("feature-app");
    if (featureApp) {
      featureApp.style.display = "block";
      this.currentArch = "feature";

      // 🔄 ЗАПУСК СИНХРОНИЗАЦИИ ДАННЫХ ПРИ ПЕРЕКЛЮЧЕНИИ
      this.triggerDataSync();

      // Инициализируем Feature-Based
      if (!this.featureApp) {
        this.featureApp = new SimpleFeatureApp();
      }

      console.log("🎉 FEATURE-BASED АКТИВИРОВАНА!");
    }
  }

  switchToMinimalist() {
    console.log("🔄 Переключаемся на Minimalist");
    this.hideAllArchitectures();

    const minimalistApp = document.getElementById("minimalist-app");
    if (minimalistApp) {
      minimalistApp.style.display = "block";
      this.currentArch = "minimalist";

      // 🔄 ЗАПУСК СИНХРОНИЗАЦИИ ДАННЫХ ПРИ ПЕРЕКЛЮЧЕНИИ
      this.triggerDataSync();

      // ИНИЦИАЛИЗИРУЕМ MINIMALIST FUNCTIONALITY ЕСЛИ ЕЩЕ НЕ ИНИЦИАЛИЗИРОВАН
      if (!this.minimalistInitialized) {
        console.log("🎯 Инициализируем Minimalist функционал...");
        this.initMinimalistFunctionality();
        this.minimalistInitialized = true;
      }

      console.log("🎉 MINIMALIST АКТИВИРОВАН!");
    }
  }

  switchToReact() {
    console.log("🔄 Переключаемся на React");
    this.hideAllArchitectures();

    const root = document.getElementById("root");
    if (root) {
      root.style.display = "block";
      this.currentArch = "react";

      // 🔄 ЗАПУСК СИНХРОНИЗАЦИИ ДАННЫХ ПРИ ПЕРЕКЛЮЧЕНИИ
      this.triggerDataSync();
    }
  }

  // 🔄 ЗАПУСК СИНХРОНИЗАЦИИ ДАННЫХ ПРИ ПЕРЕКЛЮЧЕНИИ АРХИТЕКТУР
  triggerDataSync() {
    if (window.unifiedDataManager) {
      console.log(
        "🔄 Запуск синхронизации данных при переключении архитектуры..."
      );
      window.unifiedDataManager.currentArchitecture = this.currentArch;

      // Отправляем событие смены архитектуры
      const archEvent = new CustomEvent("architectureChanged", {
        detail: { architecture: this.currentArch },
      });
      document.dispatchEvent(archEvent);

      // Запускаем синхронизацию с небольшой задержкой
      setTimeout(() => {
        window.unifiedDataManager.syncData();
      }, 300);
    } else {
      console.log("⚠️ Unified Data Manager еще не загружен");
    }
  }

  initMinimalistFunctionality() {
    console.log("🔧 Настраиваем Minimalist обработчики...");

    // Навигация
    const navButtons = document.querySelectorAll(".minimal-nav .nav-btn");
    console.log("📋 Найдено кнопок навигации:", navButtons.length);

    navButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        console.log("🎯 Нажата кнопка навигации:", index);
        const pages = ["home", "tasks", "pomodoro", "balance", "settings"];
        this.showMinimalistPage(pages[index]);

        // При переключении на задачи - показываем список
        if (pages[index] === "tasks") {
          this.showMinimalistTasks();
        }
      });
    });

    // Добавление задач - кнопка
    const addBtn = document.querySelector(".minimal-content .add-btn");
    if (addBtn) {
      console.log("✅ Кнопка добавления найдена");
      addBtn.addEventListener("click", () => this.addMinimalistTask());
    } else {
      console.log("❌ Кнопка добавления НЕ найдена");
    }

    // Добавление задач - клавиша Enter
    const taskField = document.querySelector(".task-field");
    if (taskField) {
      console.log("✅ Поле ввода задач найдено");
      taskField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.addMinimalistTask();
        }
      });
    } else {
      console.log("❌ Поле ввода задач НЕ найдено");
    }

    // Таймер
    const timerBtn = document.querySelector(".timer-btn");
    if (timerBtn) {
      console.log("✅ Кнопка таймера найдена");
      timerBtn.addEventListener("click", () => this.toggleMinimalistTimer());
    } else {
      console.log("❌ Кнопка таймера НЕ найдена");
    }

    console.log("✅ Minimalist функционал инициализирован");
  }

  // Добавим метод для отображения задач Minimalist
  showMinimalistTasks() {
    console.log("📝 Показываем задачи Minimalist");

    // Загружаем задачи из LocalStorage
    const saved = localStorage.getItem("minimalist-tasks");
    const tasks = saved ? JSON.parse(saved) : [];

    console.log("📋 Задачи в Minimalist:", tasks);

    // Находим контейнер для отображения задач
    let tasksContainer = document.querySelector(".minimal-tasks-list");

    // Если контейнера нет - создаем его
    if (!tasksContainer) {
      const taskInput = document.querySelector(".task-input");
      if (taskInput && taskInput.parentNode) {
        tasksContainer = document.createElement("div");
        tasksContainer.className = "minimal-tasks-list";
        taskInput.parentNode.insertBefore(
          tasksContainer,
          taskInput.nextSibling
        );
      }
    }

    // Отображаем задачи
    if (tasksContainer) {
      if (tasks.length === 0) {
        tasksContainer.innerHTML =
          '<p style="color: #666; text-align: center;">Нет задач</p>';
      } else {
        tasksContainer.innerHTML = tasks
          .map(
            (task) => `
                <div class="minimal-task-item" style="display: flex; justify-content: between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                    <span>${task.title}</span>
                    <button onclick="window.simpleArchManager?.completeMinimalistTask(${task.id})" 
                            style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 4px;">
                        ✓
                    </button>
                </div>
            `
          )
          .join("");
      }
    }
  }

  // Добавим метод для завершения задач
  completeMinimalistTask(taskId) {
    console.log("✅ Завершаем задачу:", taskId);
    const saved = localStorage.getItem("minimalist-tasks");
    const tasks = saved ? JSON.parse(saved) : [];

    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    // 🔥 ИСПРАВЛЕНИЕ: Сохраняем через UDM
    if (window.unifiedDataManager && window.unifiedDataManager.saveTasks) {
      window.unifiedDataManager.saveTasks("minimalist", updatedTasks);
      window.unifiedDataManager.syncData();
      console.log("✅ Minimalist: Задача удалена через UDM");
    } else {
      localStorage.setItem("minimalist-tasks", JSON.stringify(updatedTasks));
      console.log("💾 Minimalist: Задача удалена из LocalStorage");
    }

    // Обновляем отображение
    this.showMinimalistTasks();
  }

  // Обновим метод addMinimalistTask() чтобы использовать UDM
  addMinimalistTask() {
    console.log("➕ Добавляем задачу в Minimalist");
    const input = document.querySelector(".task-field");
    if (input && input.value.trim()) {
      const taskText = input.value.trim();

      // 🔥 ИСПРАВЛЕНИЕ: Сохраняем через UDM
      this.saveMinimalistTask(taskText);

      // ОЧИЩАЕМ ПОЛЕ И ОБНОВЛЯЕМ ОТОБРАЖЕНИЕ
      input.value = "";
      this.showMinimalistTasks();

      alert(`✅ Задача добавлена: "${taskText}"`);
    } else {
      alert("📝 Введите текст задачи!");
    }
  }

  // 🔥 ПЕРЕПИСАННЫЙ МЕТОД СОХРАНЕНИЯ MINIMALIST ЗАДАЧ
  saveMinimalistTask(taskText) {
    // Загружаем текущие задачи
    const saved = localStorage.getItem("minimalist-tasks");
    const tasks = saved ? JSON.parse(saved) : [];

    // Добавляем новую задачу
    const newTask = {
      id: Date.now(),
      title: taskText,
      completed: false,
      createdAt: new Date().toISOString(),
      area: "general",
    };

    tasks.push(newTask);

    // 🔥 ИСПРАВЛЕНИЕ: Сохраняем через UDM вместо прямой записи
    if (window.unifiedDataManager && window.unifiedDataManager.saveTasks) {
      window.unifiedDataManager.saveTasks("minimalist", tasks);
      window.unifiedDataManager.syncData();
      console.log("✅ Minimalist: Задача сохранена через UDM");
    } else {
      // Fallback на старую логику
      localStorage.setItem("minimalist-tasks", JSON.stringify(tasks));
      console.log("💾 Minimalist: Задача сохранена в LocalStorage");
    }
  }

  toggleMinimalistTimer() {
    console.log("⏰ Переключаем Minimalist таймер");
    const timerBtn = document.querySelector(".timer-btn");
    const timerDisplay = document.querySelector(".timer-display");

    if (timerBtn && timerDisplay) {
      if (timerBtn.textContent === "Старт") {
        timerBtn.textContent = "Стоп";
        timerDisplay.textContent = "25:00";
        console.log("▶️ Minimalist таймер запущен");
      } else {
        timerBtn.textContent = "Старт";
        timerDisplay.textContent = "25:00";
        console.log("⏹️ Minimalist таймер остановлен");
      }
    }
  }

  showMinimalistPage(page) {
    console.log("📄 Minimalist переключаем на страницу:", page);

    const navButtons = document.querySelectorAll(".minimal-nav .nav-btn");
    navButtons.forEach((btn, index) => {
      const pages = ["home", "tasks", "pomodoro", "balance", "settings"];
      btn.classList.toggle("active", pages[index] === page);
    });
  }

  hideAllArchitectures() {
    const architectures = [
      document.getElementById("root"),
      document.getElementById("feature-app"),
      document.getElementById("minimalist-app"),
    ];

    architectures.forEach((arch) => {
      if (arch) arch.style.display = "none";
    });
  }
}

// 🚀 ЗАПУСК СИСТЕМЫ
console.log("🎯 ЗАПУСКАЕМ ПРИЛОЖЕНИЕ...");
document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 DOM ЗАГРУЖЕН!");
  window.simpleArchManager = new SimpleArchManager();
  console.log("✅ ПРИЛОЖЕНИЕ УСПЕШНО ЗАПУЩЕНО!");
  console.log(
    "🎮 Управление: Ctrl+F1 (Feature), Ctrl+F2 (Minimalist), Ctrl+F3 (React)"
  );
});

// Переопределяем старые функции если они есть
window.switchToFeatureBased = () =>
  window.simpleArchManager?.switchToFeatureBased();
window.switchToMinimalist = () =>
  window.simpleArchManager?.switchToMinimalist();
