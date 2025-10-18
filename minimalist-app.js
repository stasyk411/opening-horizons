// minimalist-app.js - Функционал для Minimalist архитектуры
console.log("🎯 Minimalist App loaded");

class MinimalistApp {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        console.log("🔧 Initializing Minimalist App...");
        this.setupEventListeners();
        this.showPage('home');
    }

    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.minimal-nav .nav-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const pages = ['home', 'tasks', 'pomodoro', 'balance', 'settings'];
                this.showPage(pages[index]);
            });
        });

        // Добавление задач
        const addBtn = document.querySelector('.minimal-content .add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addTask());
        }

        // Таймер
        const timerBtn = document.querySelector('.timer-btn');
        if (timerBtn) {
            timerBtn.addEventListener('click', () => this.toggleTimer());
        }
    }

    showPage(page) {
        console.log("📄 Showing page:", page);
        this.currentPage = page;
        
        // Обновляем активную кнопку навигации
        document.querySelectorAll('.minimal-nav .nav-btn').forEach((btn, index) => {
            const pages = ['home', 'tasks', 'pomodoro', 'balance', 'settings'];
            btn.classList.toggle('active', pages[index] === page);
        });

        // Здесь можно добавить логику для каждого экрана
        switch(page) {
            case 'tasks':
                this.loadTasks();
                break;
            case 'pomodoro':
                this.initTimer();
                break;
            case 'balance':
                this.updateBalance();
                break;
        }
    }

    addTask() {
        const input = document.querySelector('.task-field');
        if (input && input.value.trim()) {
            alert(`✅ Задача добавлена: "${input.value}"`);
            input.value = '';
        }
    }

    initTimer() {
        console.log("⏰ Timer initialized");
        // Логика таймера будет добавлена позже
    }

    toggleTimer() {
        const timerBtn = document.querySelector('.timer-btn');
        const timerDisplay = document.querySelector('.timer-display');
        
        if (timerBtn.textContent === 'Старт') {
            timerBtn.textContent = 'Стоп';
            timerDisplay.textContent = '25:00';
            console.log("▶️ Timer started");
        } else {
            timerBtn.textContent = 'Старт';
            timerDisplay.textContent = '25:00';
            console.log("⏹️ Timer stopped");
        }
    }

    loadTasks() {
        console.log("📝 Loading tasks...");
        // Загрузка задач будет реализована
    }

    updateBalance() {
        console.log("⚖️ Updating balance...");
        // Обновление баланса будет реализовано
    }
}

// Автоматическая инициализация когда Minimalist архитектура активна
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем активна ли Minimalist архитектура
    const minimalistApp = document.getElementById('minimalist-app');
    if (minimalistApp && minimalistApp.style.display !== 'none') {
        window.minimalistApp = new MinimalistApp();
    }
});
