import React, { useState, useEffect, useCallback } from "react";

interface PomodoroTimerProps {
  isMobile: boolean;
  settings: any;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isMobile,
  settings,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 минут в секундах
  const [isActive, setIsActive] = useState<boolean>(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [cycles, setCycles] = useState<number>(0);

  // Стили из макета
  const sectionTitleStyle = {
    fontSize: isMobile ? "1.5rem" : "1.8rem",
    marginBottom: "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const timerContainerStyle = {
    background: "white",
    borderRadius: "20px",
    padding: isMobile ? "20px" : "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  };

  const timerCircleStyle = {
    width: isMobile ? "250px" : "300px",
    height: isMobile ? "250px" : "300px",
    borderRadius: "50%",
    background:
      mode === "work"
        ? "linear-gradient(135deg, #FF6B6B, #FF8E8E)"
        : "linear-gradient(135deg, #4ECDC4, #88D9D9)",
    margin: "0 auto 30px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    position: "relative" as const,
  };

  const timeTextStyle = {
    fontSize: isMobile ? "3rem" : "4rem",
    fontWeight: "bold",
    margin: 0,
  };

  const modeTextStyle = {
    fontSize: "1.2rem",
    margin: "10px 0 0 0",
    opacity: 0.9,
  };

  const btnStyle = {
    padding: "15px 25px",
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    border: "none",
    borderRadius: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "1rem",
    margin: "0 10px",
  };

  const controlsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap" as const,
  };

  const statsStyle = {
    display: "flex",
    justifyContent: "space-around",
    background: "#F8F8FF",
    padding: "20px",
    borderRadius: "15px",
    marginTop: "30px",
  };

  const statItemStyle = {
    textAlign: "center" as const,
  };

  const statValueStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#8A2BE2",
    margin: "0 0 5px 0",
  };

  const statLabelStyle = {
    fontSize: "0.9rem",
    color: "#696969",
    margin: 0,
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
  }, [mode]);

  const switchMode = useCallback(() => {
    if (mode === "work") {
      setMode("break");
      setTimeLeft(5 * 60); // 5 минут перерыв
      setCycles((prev) => prev + 1);
    } else {
      setMode("work");
      setTimeLeft(25 * 60); // 25 минут работы
    }
    setIsActive(false);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Таймер завершен
      switchMode();
      // Можно добавить звуковое уведомление
      if (settings.notifications) {
        new Audio("/notification.mp3").play().catch(() => {
          // Fallback для браузеров без поддержки audio
          console.log("Таймер завершен!");
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, switchMode, settings.notifications]);

  return (
    <div style={timerContainerStyle}>
      <h2 style={sectionTitleStyle}>🍅 Pomodoro Таймер</h2>

      <div style={timerCircleStyle}>
        <h1 style={timeTextStyle}>{formatTime(timeLeft)}</h1>
        <p style={modeTextStyle}>
          {mode === "work" ? "⏰ Время работы" : "☕ Перерыв"}
        </p>
      </div>

      <div style={controlsStyle}>
        <button
          style={{
            ...btnStyle,
            background: isActive
              ? "linear-gradient(to right, #FF6B6B, #FF8E8E)"
              : "linear-gradient(to right, #32CD32, #90EE90)",
          }}
          onClick={() => setIsActive(!isActive)}
        >
          <span>{isActive ? "⏸️" : "▶️"}</span>
          {isActive ? "Пауза" : "Старт"}
        </button>

        <button
          style={{
            ...btnStyle,
            background: "linear-gradient(to right, #9370DB, #BA55D3)",
          }}
          onClick={resetTimer}
        >
          <span>🔄</span>
          Сброс
        </button>

        <button
          style={{
            ...btnStyle,
            background: "linear-gradient(to right, #4ECDC4, #88D9D9)",
          }}
          onClick={switchMode}
        >
          <span>⏭️</span>
          Пропустить
        </button>
      </div>

      {/* Статистика */}
      <div style={statsStyle}>
        <div style={statItemStyle}>
          <div style={statValueStyle}>{cycles}</div>
          <div style={statLabelStyle}>Завершенных циклов</div>
        </div>
        <div style={statItemStyle}>
          <div style={statValueStyle}>
            {mode === "work" ? "25:00" : "05:00"}
          </div>
          <div style={statLabelStyle}>
            {mode === "work" ? "Время работы" : "Время перерыва"}
          </div>
        </div>
        <div style={statItemStyle}>
          <div style={statValueStyle}>
            {Math.floor(
              (timeLeft / (mode === "work" ? 25 * 60 : 5 * 60)) * 100
            )}
            %
          </div>
          <div style={statLabelStyle}>Прогресс</div>
        </div>
      </div>

      {/* Инструкция */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#F8F8FF",
          borderRadius: "15px",
          textAlign: "left" as const,
        }}
      >
        <h3 style={{ color: "#8A2BE2", marginBottom: "15px" }}>
          🎯 Метод Pomodoro
        </h3>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "#666" }}>
          <li>25 минут работы → 5 минут перерыва</li>
          <li>После 4 циклов - длинный перерыв (15-30 минут)</li>
          <li>Фокусируйтесь на одной задаче за раз</li>
          <li>Избегайте отвлечений во время работы</li>
        </ul>
      </div>
    </div>
  );
};

export { PomodoroTimer };
