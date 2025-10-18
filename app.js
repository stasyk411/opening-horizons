// app.js - Основной файл Feature-Based архитектуры
class App {
  constructor() {
    this.features = {};
    this.isNewArchitecture = false;
  }

  async init() {
    console.log("🚀 Инициализация Feature-Based архитектуры...");
    await this.initFeatures();
    this.addArchitectureToggle();
    console.log(
      "✅ Feature-Based архитектура готова! Ctrl+Shift+A для переключения"
    );
  }

  async initFeatures() {
    try {
      console.log("📁 Загрузка фич...");
      // Фичи будут загружены позже
    } catch (error) {
      console.error("❌ Ошибка загрузки фич:", error);
    }
  }

  addArchitectureToggle() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        this.toggleArchitecture();
      }
    });
  }

  toggleArchitecture() {
    this.isNewArchitecture = !this.isNewArchitecture;
    const oldApp = document.getElementById("root");
    const newApp = document.getElementById("feature-app");

    if (this.isNewArchitecture) {
      oldApp.style.display = "none";
      newApp.style.display = "block";
      console.log("🎯 Включена НОВАЯ архитектура");
    } else {
      oldApp.style.display = "block";
      newApp.style.display = "none";
      console.log("🏠 Включена СТАРАЯ архитектура");
    }
  }
}

// Запускаем приложение когда DOM загружен
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
  window.app.init();
});
