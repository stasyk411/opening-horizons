import {
  PomodoroSession,
  PomodoroSettings,
  PomodoroPreset,
  PomodoroPhase,
  PomodoroStatus,
} from "../types/pomodoro";

// Дефолтные настройки на основе исследований
export const defaultPomodoroSettings: PomodoroSettings = {
  presets: {
    ultraFocus: { work: 15, break: 3 },
    sprint: { work: 25, break: 5 },
    classic: { work: 45, break: 15 },
    deepWork: { work: 90, break: 20 },
    flowState: { work: 120, break: 30 },
    custom: { work: 25, break: 5 },
  },
  currentPreset: "sprint",
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: false,
  audioEnabled: true, // ← ДОБАВЬ ЭТУ СТРОКУ
};

// Создание новой сессии
export function createPomodoroSession(
  phase: PomodoroPhase,
  preset: PomodoroPreset,
  settings: PomodoroSettings
): PomodoroSession {
  const duration = getPhaseDuration(phase, preset, settings);

  return {
    id: generateId(),
    phase,
    duration,
    timeLeft: duration * 60, // конвертируем в секунды
    status: "idle",
    startTime: null,
    endTime: null,
    preset,
  };
}

// Получение длительности фазы
export function getPhaseDuration(
  phase: PomodoroPhase,
  preset: PomodoroPreset,
  settings: PomodoroSettings
): number {
  const presetSettings = settings.presets[preset];

  switch (phase) {
    case "work":
      return presetSettings.work;
    case "shortBreak":
      return presetSettings.break;
    case "longBreak":
      return settings.longBreakDuration;
    default:
      return 25;
  }
}

// Генератор ID
function generateId(): string {
  return `pomodoro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Форматирование времени (минуты:секунды)
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Проверка нужен ли длинный перерыв
export function shouldTakeLongBreak(
  completedPomodoros: number,
  interval: number
): boolean {
  return completedPomodoros > 0 && completedPomodoros % interval === 0;
}

// Получение следующей фазы
export function getNextPhase(
  currentPhase: PomodoroPhase,
  completedPomodoros: number,
  settings: PomodoroSettings
): PomodoroPhase {
  if (currentPhase === "work") {
    return shouldTakeLongBreak(completedPomodoros, settings.longBreakInterval)
      ? "longBreak"
      : "shortBreak";
  } else {
    return "work";
  }
}
