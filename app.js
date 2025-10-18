// 📁 app.js - УПРОЩЕННАЯ РАБОЧАЯ ВЕРСИЯ

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
        const featureApp = document.getElementById('feature-app');
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
                                <p>🔥 Горячие клавиши: Ctrl+F1 - Feature, Ctrl+F2 - Minimalist</p>
                                
                                <div style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                    <div style="background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px;">
                                        <h3>📝 Быстрый список</h3>
                                        <ul style="text-align: left;">
                                            <li>✅ Фича навигации</li>
                                            <li>✅ Фича задач</li>
                                            <li>✅ Фича таймера</li>
                                            <li>✅ Фича баланса</li>
                                        </ul>
                                    </div>
                                    <div style="background: rgba(255,255,255,0.15); padding: 20px; border-radius: 10px;">
                                        <h3>⚡ Статус системы</h3>
                                        <ul style="text-align: left;">
                                            <li>🟢 Feature-Based: Активна</li>
                                            <li>🟢 Minimalist: Готова</li>
                                            <li>🟢 React: Готов</li>
                                            <li>🟢 Навигация: Работает</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
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
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                this.showPage(page);
            });
        });
    }
    
    showPage(page) {
        console.log("📄 Переключаем на страницу:", page);
        
        const content = document.getElementById('feature-content');
        if (!content) return;
        
        const pages = {
            home: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <h2>🏠 Главная панель</h2>
                    <p>Добро пожаловать в Feature-Based архитектуру!</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
                        <div style="background: rgba(76, 175, 80, 0.3); padding: 15px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 2em;">📝</div>
                            <strong>Задачи</strong>
                            <div>5 активных</div>
                        </div>
                        <div style="background: rgba(33, 150, 243, 0.3); padding: 15px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 2em;">⏰</div>
                            <strong>Таймер</strong>
                            <div>25:00</div>
                        </div>
                        <div style="background: rgba(156, 39, 176, 0.3); padding: 15px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 2em;">⚖️</div>
                            <strong>Баланс</strong>
                            <div>75%</div>
                        </div>
                    </div>
                </div>
            `,
            tasks: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <h2>📝 Управление задачами</h2>
                    
                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <input type="text" placeholder="Новая задача..." style="flex: 1; padding: 10px; border: none; border-radius: 8px;">
                        <button style="padding: 10px 20px; background: #4CAF50; border: none; color: white; border-radius: 8px;">Добавить</button>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <input type="checkbox">
                            <span>Протестировать Feature-Based архитектуру</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <input type="checkbox" checked>
                            <span style="text-decoration: line-through; opacity: 0.6;">Исправить переключение архитектур</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px;">
                            <input type="checkbox">
                            <span>Добавить навигацию между фичами</span>
                        </div>
                    </div>
                </div>
            `,
            timer: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); text-align: center;">
                    <h2>⏰ Таймер Помодоро</h2>
                    
                    <div style="font-size: 4em; font-weight: bold; margin: 30px 0;">25:00</div>
                    
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button style="padding: 12px 25px; background: #4CAF50; border: none; color: white; border-radius: 8px; font-size: 1.1em;">Старт</button>
                        <button style="padding: 12px 25px; background: #ff9800; border: none; color: white; border-radius: 8px; font-size: 1.1em;">Пауза</button>
                        <button style="padding: 12px 25px; background: #f44336; border: none; color: white; border-radius: 8px; font-size: 1.1em;">Сброс</button>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <p>Сессия: 1/4 • Перерыв: 5 минут</p>
                    </div>
                </div>
            `,
            balance: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <h2>⚖️ Баланс жизни</h2>
                    
                    ${['Здоровье', 'Карьера', 'Отношения', 'Развитие'].map(category => `
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: between; margin-bottom: 5px;">
                                <span>${category === 'Здоровье' ? '💪' : category === 'Карьера' ? '💼' : category === 'Отношения' ? '❤️' : '🎯'} ${category}</span>
                                <span>${Math.floor(Math.random() * 40) + 60}%</span>
                            </div>
                            <div style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; overflow: hidden;">
                                <div style="background: linear-gradient(90deg, #4CAF50, #8BC34A); height: 100%; width: ${Math.floor(Math.random() * 40) + 60}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `
        };
        
        content.innerHTML = pages[page] || pages.home;
    }
}

// 🏗️ ПРОСТОЙ МЕНЕДЖЕР АРХИТЕКТУР
class SimpleArchManager {
    constructor() {
        console.log("🏗️ SimpleArchManager запущен");
        this.currentArch = 'react';
        this.featureApp = null;
        this.init();
    }
    
    init() {
        this.setupHotkeys();
        console.log("✅ SimpleArchManager инициализирован");
    }
    
    setupHotkeys() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                if (e.key === 'F1') {
                    e.preventDefault();
                    console.log("🔥 F1 - АКТИВАЦИЯ FEATURE-BASED");
                    this.switchToFeatureBased();
                } else if (e.key === 'F2') {
                    e.preventDefault();
                    console.log("🔥 F2 - АКТИВАЦИЯ MINIMALIST");
                    this.switchToMinimalist();
                } else if (e.key === 'F3') {
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
        
        const featureApp = document.getElementById('feature-app');
        if (featureApp) {
            featureApp.style.display = 'block';
            this.currentArch = 'feature';
            
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
        
        const minimalistApp = document.getElementById('minimalist-app');
        if (minimalistApp) {
            minimalistApp.style.display = 'block';
            this.currentArch = 'minimalist';
        }
    }
    
    switchToReact() {
        console.log("🔄 Переключаемся на React");
        this.hideAllArchitectures();
        
        const root = document.getElementById('root');
        if (root) {
            root.style.display = 'block';
            this.currentArch = 'react';
        }
    }
    
    hideAllArchitectures() {
        const architectures = [
            document.getElementById('root'),
            document.getElementById('feature-app'), 
            document.getElementById('minimalist-app')
        ];
        
        architectures.forEach(arch => {
            if (arch) arch.style.display = 'none';
        });
    }
}

// 🚀 ЗАПУСК СИСТЕМЫ
console.log("🎯 ЗАПУСКАЕМ ПРИЛОЖЕНИЕ...");
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM ЗАГРУЖЕН!");
    window.simpleArchManager = new SimpleArchManager();
    console.log("✅ ПРИЛОЖЕНИЕ УСПЕШНО ЗАПУЩЕНО!");
    console.log("🎮 Управление: Ctrl+F1 (Feature), Ctrl+F2 (Minimalist), Ctrl+F3 (React)");
});

// Переопределяем старые функции если они есть
window.switchToFeatureBased = () => window.simpleArchManager?.switchToFeatureBased();
window.switchToMinimalist = () => window.simpleArchManager?.switchToMinimalist();
// 📁 app.js - ИСПРАВЛЕННАЯ ВЕРСИЯ (только fix для undefined)

// ... весь предыдущий код остается ...

setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.dataset.page;
            if (page) {  // ✅ ДОБАВЛЕНА ПРОВЕРКА
                this.showPage(page);
            }
        });
    });
}

// ... остальной код без изменений ...
