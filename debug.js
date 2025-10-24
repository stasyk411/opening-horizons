// 📁 debug.js - ДИАГНОСТИЧЕСКИЙ СКРИПТ
console.log("🔍 ЗАПУСК ДИАГНОСТИКИ...");

// Проверяем элементы
console.log("📋 Проверяем элементы DOM:");
console.log("feature-app:", document.getElementById('feature-app'));
console.log("data-feature элементы:", document.querySelectorAll('[data-feature]'));

// Проверяем стили
const featureApp = document.getElementById('feature-app');
if (featureApp) {
    console.log("🎨 Стили feature-app:", {
        display: featureApp.style.display,
        visibility: featureApp.style.visibility,
        opacity: featureApp.style.opacity
    });
}

// Проверяем выполнение нашего кода
console.log("✅ Диагностический скрипт выполнен");
