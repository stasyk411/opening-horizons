import { useState, useEffect, useRef, useCallback } from "react";
import { practices, Practice } from "../data/practices";

export interface PomodoroSettings {
  workTime: number;
  breakTime: number;
}

export interface UsePomodoroTimerReturn {
  mode: "work" | "practice";
  isRunning: boolean;
  currentTime: number;
  currentPractice: Practice | null;
  sessionCount: number;
  techniquesUsed: number;
  totalSeconds: number;
  settings: PomodoroSettings;
  currentCategory: string;

  toggleTimer: () => void;
  resetTimer: () => void;
  selectPractice: (practiceId: string) => void;
  showCategory: (category: string) => void;
  applySettings: (newSettings: PomodoroSettings) => void;
  getFilteredPractices: () => Practice[];
}

export const usePomodoroTimer = (isMobile: boolean): UsePomodoroTimerReturn => {
  const [mode, setMode] = useState<"work" | "practice">("work");
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [currentPractice, setCurrentPractice] = useState<Practice | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [techniquesUsed, setTechniquesUsed] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [settings, setSettings] = useState<PomodoroSettings>({
    workTime: 25,
    breakTime: 30,
  });
  const [currentCategory, setCurrentCategory] = useState("breathing");

  const intervalRef = useRef<NodeJS.Timeout>();
  const practiceQueueRef = useRef<Practice[]>([]);

  // Инициализация
  useEffect(() => {
    shufflePracticeQueue();
    const savedSettings = localStorage.getItem("pomodoro-settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      setCurrentTime(parsed.workTime * 60);
    }
  }, []);

  const shufflePracticeQueue = useCallback(() => {
    practiceQueueRef.current = [...practices].sort(() => Math.random() - 0.5);
  }, []);

  const getNextPractice = useCallback((): Practice => {
    if (practiceQueueRef.current.length === 0) {
      shufflePracticeQueue();
    }
    return practiceQueueRef.current.shift()!;
  }, [shufflePracticeQueue]);

  // ФИКС: Простой интервальный таймер вместо requestAnimationFrame
  useEffect(() => {
    if (isRunning) {
      console.log("▶️ Starting timer interval");
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev - 1;
          console.log("🕒 Time:", prev, "->", newTime);

          if (newTime <= 0) {
            console.log("⏰ Session completed!");
            completeSession();
            return 0;
          }

          return newTime;
        });

        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      console.log("⏸️ Stopping timer interval");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggleTimer = useCallback(() => {
    console.log("🔘 Toggle timer, current state:", isRunning, "->", !isRunning);
    setIsRunning((prev) => !prev);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    console.log("🔄 Resetting timer");
    setIsRunning(false);
    setMode("work");
    setCurrentTime(settings.workTime * 60);
    setCurrentPractice(null);
  }, [settings.workTime]);

  const completeSession = useCallback(() => {
    console.log("🎯 Completing session, mode:", mode);
    setIsRunning(false);

    if (mode === "work") {
      console.log("💼 Work -> Practice");
      setSessionCount((prev) => prev + 1);
      const nextPractice = getNextPractice();
      setCurrentPractice(nextPractice);
      setMode("practice");
      setCurrentTime(nextPractice.duration);
    } else {
      console.log("🌿 Practice -> Work");
      setSessionCount((prev) => prev + 1);
      setTechniquesUsed((prev) => prev + 1);
      setMode("work");
      setCurrentTime(settings.workTime * 60);
      setCurrentPractice(null);
    }
  }, [mode, settings.workTime, getNextPractice]);

  const selectPractice = useCallback((practiceId: string) => {
    console.log("🎯 Selecting practice:", practiceId);
    const practice = practices.find((p) => p.id === practiceId);
    if (practice) {
      setIsRunning(false);
      setCurrentPractice(practice);
      setMode("practice");
      setCurrentTime(practice.duration);
    }
  }, []);

  const showCategory = useCallback((category: string) => {
    setCurrentCategory(category);
  }, []);

  const applySettings = useCallback(
    (newSettings: PomodoroSettings) => {
      setSettings(newSettings);
      localStorage.setItem("pomodoro-settings", JSON.stringify(newSettings));
      if (mode === "work") {
        setCurrentTime(newSettings.workTime * 60);
      }
    },
    [mode]
  );

  const getFilteredPractices = useCallback(() => {
    return practices.filter(
      (practice) => practice.category === currentCategory
    );
  }, [currentCategory]);

  return {
    mode,
    isRunning,
    currentTime,
    currentPractice,
    sessionCount,
    techniquesUsed,
    totalSeconds,
    settings,
    currentCategory,
    toggleTimer,
    resetTimer,
    selectPractice,
    showCategory,
    applySettings,
    getFilteredPractices,
  };
};
