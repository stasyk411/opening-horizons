import React, { useState } from "react";
import { usePomodoroTimer } from "../model/usePomodoroTimer";
import { PomodoroSettings } from "./PomodoroSettings";

export const PomodoroTimer: React.FC = () => {
  const {
    state,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    skipSession,
    updateSettings,
    formatTime,
  } = usePomodoroTimer();

  const [showSettings, setShowSettings] = useState(!state.currentSession);

  const { currentSession, stats, completedPomodoros, settings } = state;

  // Функции для работы с настройками
  const handleSettingsChange = (newSettings: any) => {
    updateSettings(newSettings);
  };

  const handleStartWithSettings = () => {
    setShowSettings(false);
    startSession("work");
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  // Если показываем настройки
  if (showSettings) {
    return (
      <PomodoroSettings
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onStart={handleStartWithSettings}
      />
    );
  }

  // Остальной код компонента (как был ранее)...
  const getPhaseName = (phase: string) => {
    switch (phase) {
      case "work":
        return "Рабочий период";
      case "shortBreak":
        return "Короткий перерыв";
      case "longBreak":
        return "Длинный перерыв";
      default:
        return "Готов к работе";
    }
  };

  const getPhaseEmoji = (phase: string) => {
    switch (phase) {
      case "work":
        return "🔴";
      case "shortBreak":
        return "🟢";
      case "longBreak":
        return "🟡";
      default:
        return "⚪";
    }
  };

  const getNextPhaseName = () => {
    if (!currentSession) return "Рабочий период";

    if (currentSession.phase === "work") {
      return completedPomodoros % 4 === 3
        ? "Длинный перерыв"
        : "Короткий перерыв";
    } else {
      return "Рабочий период";
    }
  };

  if (!currentSession) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🍅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Pomodoro Таймер
          </h2>
          <p className="text-gray-600 mb-6">Готов к работе!</p>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span>✅ Завершено сегодня:</span>
              <span className="font-semibold">{stats.completedToday}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>🎯 Цель на день:</span>
              <span className="font-semibold">{stats.dailyGoal}</span>
            </div>
          </div>

          <button
            onClick={handleShowSettings}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-3"
          >
            ⚙️ Настроить таймер
          </button>

          <button
            onClick={() => startSession("work")}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            ▶️ Быстрый старт
          </button>
        </div>
      </div>
    );
  }

  const progress =
    ((currentSession.duration * 60 - currentSession.timeLeft) /
      (currentSession.duration * 60)) *
    100;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="text-center">
        {/* Заголовок и статус */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">
            {getPhaseEmoji(currentSession.phase)}
          </span>
          <h2 className="text-xl font-bold text-gray-800">
            {getPhaseName(currentSession.phase)}
          </h2>
        </div>

        {/* Таймер */}
        <div className="text-6xl font-mono font-bold text-gray-800 mb-4">
          {formatTime(currentSession.timeLeft)}
        </div>

        {/* Прогресс бар */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold">✅ Завершено</div>
            <div>
              {stats.completedToday}/{stats.dailyGoal}
            </div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold">🎯 Следующее</div>
            <div>{getNextPhaseName()}</div>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="flex gap-3 justify-center mb-3">
          {currentSession.status === "running" ? (
            <button
              onClick={pauseSession}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ⏸️ Пауза
            </button>
          ) : (
            <button
              onClick={resumeSession}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ▶️ Продолжить
            </button>
          )}

          <button
            onClick={skipSession}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            ⏭️ Пропустить
          </button>
        </div>

        {/* Кнопка настроек */}
        <button
          onClick={handleShowSettings}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          ⚙️ Изменить настройки
        </button>

        {/* Дополнительная информация */}
        <div className="mt-4 text-xs text-gray-500">
          <div>Режим: {currentSession.preset}</div>
          <div>Длительность: {currentSession.duration} мин</div>
        </div>
      </div>
    </div>
  );
};
