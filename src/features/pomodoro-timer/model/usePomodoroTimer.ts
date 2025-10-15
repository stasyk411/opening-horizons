import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../../../shared/lib/notifications";
import {
  PomodoroState,
  PomodoroSession,
  PomodoroSettings,
  PomodoroPhase,
  PomodoroStatus,
  PomodoroPreset,
} from "../../../shared/types/pomodoro";
import {
  defaultPomodoroSettings,
  createPomodoroSession,
  getNextPhase,
  formatTime,
  shouldTakeLongBreak,
} from "../../../shared/lib/pomodoro-timer";

// Ключ для localStorage
const POMODORO_STORAGE_KEY = "pomodoro-state";

export function usePomodoroTimer() {
  // Загрузка состояния из localStorage
  const loadState = (): PomodoroState => {
    try {
      const saved = localStorage.getItem(POMODORO_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading pomodoro state:", error);
    }

    // Дефолтное состояние
    return {
      currentSession: null,
      settings: defaultPomodoroSettings,
      stats: {
        completedToday: 0,
        completedThisWeek: 0,
        totalFocusTime: 0,
        dailyGoal: 8,
      },
      completedPomodoros: 0,
    };
  };

  const [state, setState] = useState<PomodoroState>(loadState);

  // Сохранение состояния в localStorage
  const saveState = useCallback((newState: PomodoroState) => {
    try {
      localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error("Error saving pomodoro state:", error);
    }
  }, []);

  // Обновление состояния с сохранением
  const updateState = useCallback(
    (updates: Partial<PomodoroState>) => {
      setState((prev) => {
        const newState = { ...prev, ...updates };
        saveState(newState);
        return newState;
      });
    },
    [saveState]
  );

  // Запуск сессии
  const startSession = useCallback(
    (phase: PomodoroPhase = "work") => {
      const session = createPomodoroSession(
        phase,
        state.settings.currentPreset,
        state.settings
      );
      const sessionWithStart: PomodoroSession = {
        ...session,
        status: "running",
        startTime: new Date(),
      };

      // 🔈 ВОСПРОИЗВЕДЕНИЕ ЗВУКА НАЧАЛА
      if (state.settings.audioEnabled !== false) {
        notificationService.notifySessionStart(phase, session.duration);
      }

      updateState({
        currentSession: sessionWithStart,
      });
    },
    [state.settings, updateState]
  );

  // Пауза сессии
  const pauseSession = useCallback(() => {
    if (state.currentSession?.status === "running") {
      updateState({
        currentSession: {
          ...state.currentSession,
          status: "paused",
        },
      });
    }
  }, [state.currentSession, updateState]);

  // Возобновление сессии
  const resumeSession = useCallback(() => {
    if (state.currentSession?.status === "paused") {
      updateState({
        currentSession: {
          ...state.currentSession,
          status: "running",
        },
      });
    }
  }, [state.currentSession, updateState]);

  // Завершение сессии
  const completeSession = useCallback(() => {
    if (state.currentSession) {
      const completedSession: PomodoroSession = {
        ...state.currentSession,
        status: "completed",
        endTime: new Date(),
        timeLeft: 0,
      };

      const wasWorkSession = state.currentSession.phase === "work";
      const newCompletedPomodoros = wasWorkSession
        ? state.completedPomodoros + 1
        : state.completedPomodoros;

      const newStats = wasWorkSession
        ? {
            ...state.stats,
            completedToday: state.stats.completedToday + 1,
            totalFocusTime:
              state.stats.totalFocusTime + state.currentSession.duration,
          }
        : state.stats;

      updateState({
        currentSession: null,
        stats: newStats,
        completedPomodoros: newCompletedPomodoros,
      });

      // 🔈 ВОСПРОИЗВЕДЕНИЕ ЗВУКА ОКОНЧАНИЯ
      if (state.settings.audioEnabled !== false) {
        const nextPhase = getNextPhase(
          state.currentSession.phase,
          newCompletedPomodoros,
          state.settings
        );
        notificationService.notifySessionComplete(
          state.currentSession.phase,
          nextPhase
        );
      }

      // Автостарт следующей сессии если включено
      if (wasWorkSession && state.settings.autoStartBreaks) {
        const nextPhase = getNextPhase(
          "work",
          newCompletedPomodoros,
          state.settings
        );
        setTimeout(() => startSession(nextPhase), 1000);
      } else if (!wasWorkSession && state.settings.autoStartPomodoros) {
        setTimeout(() => startSession("work"), 1000);
      }
    }
  }, [
    state.currentSession,
    state.completedPomodoros,
    state.stats,
    state.settings,
    updateState,
    startSession,
  ]);

  // Пропуск сессии
  const skipSession = useCallback(() => {
    completeSession();
  }, [completeSession]);

  // Обновление настроек
  const updateSettings = useCallback(
    (newSettings: Partial<PomodoroSettings>) => {
      updateState({
        settings: { ...state.settings, ...newSettings },
      });

      // Обновляем настройки звука в notificationService
      if (newSettings.audioEnabled !== undefined) {
        notificationService.setAudioEnabled(newSettings.audioEnabled);
      }
    },
    [state.settings, updateState]
  );

  // Сброс статистики
  const resetStats = useCallback(() => {
    updateState({
      stats: {
        completedToday: 0,
        completedThisWeek: 0,
        totalFocusTime: 0,
        dailyGoal: 8,
      },
      completedPomodoros: 0,
    });
  }, [updateState]);

  // Таймер
  useEffect(() => {
    if (state.currentSession?.status !== "running") return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.currentSession || prev.currentSession.status !== "running") {
          return prev;
        }

        const newTimeLeft = prev.currentSession.timeLeft - 1;

        if (newTimeLeft <= 0) {
          clearInterval(interval);
          // Завершаем сессию когда время вышло
          setTimeout(() => completeSession(), 100);
          return prev;
        }

        const updatedSession: PomodoroSession = {
          ...prev.currentSession,
          timeLeft: newTimeLeft,
        };

        const newState = { ...prev, currentSession: updatedSession };
        saveState(newState);
        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.currentSession?.status, completeSession, saveState]);

  return {
    state,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    skipSession,
    updateSettings,
    resetStats,
    formatTime,
  };
}
