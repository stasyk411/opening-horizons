// app.js - Основной файл Feature-Based архитектуры
class App {
  constructor() {
    this.features = {};
    this.currentVersion = "react"; // По умолчанию React
  }

  async init() {
    console.log("🚀 Инициализация Feature-Based архитектуры...");
    await this.initFeatures();
    this.addArchitectureToggle();
    console.log(
      "✅ Feature-Based архитектура готова! Ctrl+F1 и Ctrl+F2 для переключения"
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
      if (e.ctrlKey && e.key === "F1") {
        e.preventDefault();
        this.toggleArchitecture("feature-based");
      }
      if (e.ctrlKey && e.key === "F2") {
        e.preventDefault();
        this.toggleArchitecture("minimalist");
      }
    });
  }

  toggleArchitecture(version) {
    // Безопасное скрытие элементов (если они существуют)
    this.safeHide("root");
    this.safeHide("feature-app");
    this.safeHide("minimalist-app");

    // Показываем выбранную версию
    if (version === "feature-based") {
      this.safeShow("feature-app");
      console.log("🎯 Включена FEATURE-BASED архитектура");
    } else if (version === "minimalist") {
      this.safeShow("minimalist-app");
      console.log("🎨 Включена MINIMALIST архитектура");
    } else {
      this.safeShow("root");
      console.log("🏠 Включена СТАРАЯ архитектура");
    }

    this.currentVersion = version;
  }

  safeHide(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = "none";
    }
  }

  safeShow(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = "block";
    }
  }
}

// Запускаем приложение когда DOM загружен
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
  window.app.init();
});
