export type PomodoroPhase = "work" | "shortBreak" | "longBreak";
export type PomodoroStatus = "idle" | "running" | "paused" | "completed";
export type PomodoroPreset =
  | "ultraFocus"
  | "sprint"
  | "classic"
  | "deepWork"
  | "flowState"
  | "custom";

export interface PomodoroSession {
  id: string;
  phase: PomodoroPhase;
  duration: number; // в минутах
  timeLeft: number; // в секундах
  status: PomodoroStatus;
  startTime: Date | null;
  endTime: Date | null;
  preset: PomodoroPreset;
}

export interface PomodoroSettings {
  presets: {
    ultraFocus: { work: number; break: number };
    sprint: { work: number; break: number };
    classic: { work: number; break: number };
    deepWork: { work: number; break: number };
    flowState: { work: number; break: number };
    custom: { work: number; break: number };
  };
  currentPreset: PomodoroPreset;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  audioEnabled?: boolean; // ← ДОБАВЬ ЭТУ СТРОКУ ДЛЯ ЗВУКА
}

export interface PomodoroStats {
  completedToday: number;
  completedThisWeek: number;
  totalFocusTime: number;
  dailyGoal: number;
}

export interface PomodoroState {
  currentSession: PomodoroSession | null;
  settings: PomodoroSettings;
  stats: PomodoroStats;
  completedPomodoros: number;
}
