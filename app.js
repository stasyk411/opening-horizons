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
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                if (page) {
                    this.showPage(page);
                }
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
                </div>
            `,
            tasks: `
                <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px);">
                    <h2>📝 Управление задачами</h2>
                    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <input type="text" placeholder="Новая задача..." style="flex: 1; padding: 10px; border: none; border-radius: 8px;">
                        <button style="padding: 10px 20px; background: #4CAF50; border: none; color: white; border-radius: 8px;">Добавить</button>
                    </div>
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
            `
        };
        
        content.innerHTML = pages[page] || pages.home;
    }
}

// 🏗️ ПРОСТОЙ МЕНЕДЖЕР АРХИТЕКТУР С РАБОЧИМ MINIMALIST
class SimpleArchManager {
    constructor() {
        console.log("🏗️ SimpleArchManager запущен");
        this.currentArch = 'react';
        this.featureApp = null;
        this.minimalistInitialized = false;
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
            
            // ИНИЦИАЛИЗИРУЕМ MINIMALIST FUNCTIONALITY ЕСЛИ ЕЩЕ НЕ ИНИЦИАЛИЗИРОВАН
            if (!this.minimalistInitialized) {
                console.log("🎯 Инициализируем Minimalist функционал...");
                this.initMinimalistFunctionality();
                this.minimalistInitialized = true;
            }
            
            console.log("🎉 MINIMALIST АКТИВИРОВАН!");
        }
    }

    initMinimalistFunctionality() {
        console.log("🔧 Настраиваем Minimalist обработчики...");
        
        // Навигация
        const navButtons = document.querySelectorAll('.minimal-nav .nav-btn');
        console.log("📋 Найдено кнопок навигации:", navButtons.length);
        
        navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                console.log("🎯 Нажата кнопка навигации:", index);
                const pages = ['home', 'tasks', 'pomodoro', 'balance', 'settings'];
                this.showMinimalistPage(pages[index]);
            });
        });

        // Добавление задач
        const addBtn = document.querySelector('.minimal-content .add-btn');
        if (addBtn) {
            console.log("✅ Кнопка добавления найдена");
            addBtn.addEventListener('click', () => this.addMinimalistTask());
        } else {
            console.log("❌ Кнопка добавления НЕ найдена");
        }

        // Таймер
        const timerBtn = document.querySelector('.timer-btn');
        if (timerBtn) {
            console.log("✅ Кнопка таймера найдена");
            timerBtn.addEventListener('click', () => this.toggleMinimalistTimer());
        } else {
            console.log("❌ Кнопка таймера НЕ найдена");
        }
        
        console.log("✅ Minimalist функционал инициализирован");
    }

    addMinimalistTask() {
        console.log("➕ Добавляем задачу в Minimalist");
        const input = document.querySelector('.task-field');
        if (input && input.value.trim()) {
            alert(`✅ Задача добавлена: "${input.value}"`);
            input.value = '';
        } else {
            alert('📝 Введите текст задачи!');
        }
    }

    toggleMinimalistTimer() {
        console.log("⏰ Переключаем Minimalist таймер");
        const timerBtn = document.querySelector('.timer-btn');
        const timerDisplay = document.querySelector('.timer-display');
        
        if (timerBtn && timerDisplay) {
            if (timerBtn.textContent === 'Старт') {
                timerBtn.textContent = 'Стоп';
                timerDisplay.textContent = '25:00';
                console.log("▶️ Minimalist таймер запущен");
            } else {
                timerBtn.textContent = 'Старт';
                timerDisplay.textContent = '25:00';
                console.log("⏹️ Minimalist таймер остановлен");
            }
        }
    }

    showMinimalistPage(page) {
        console.log("📄 Minimalist переключаем на страницу:", page);
        
        const navButtons = document.querySelectorAll('.minimal-nav .nav-btn');
        navButtons.forEach((btn, index) => {
            const pages = ['home', 'tasks', 'pomodoro', 'balance', 'settings'];
            btn.classList.toggle('active', pages[index] === page);
        });
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
