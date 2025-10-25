import React, { useState, useEffect } from 'react';

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            alert(
              `?? ${mode === "work" ? "Рабочая сессия" : "Перерыв"} завершена!`
            );
            const newMode = mode === "work" ? "break" : "work";
            setMode(newMode);
            return newMode === "work" ? 25 * 60 : 5 * 60;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      style={{
        background: "#f8f8ff",
        padding: "12px",
        borderRadius: "12px",
        border: "2px solid #8A2BE2",
        minWidth: "180px",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "14px" }}>
          ?? {mode === "work" ? "Работа" : "Перерыв"}
        </span>
        <div
          style={{
            fontWeight: "bold",
            fontFamily: "monospace",
            fontSize: "16px",
          }}
        >
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setIsRunning(true)}
          style={{
            padding: "6px 8px",
            border: "none",
            borderRadius: "6px",
            background: "#8A2BE2",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ??
        </button>
        <button
          onClick={() => setIsRunning(false)}
          style={{
            padding: "6px 8px",
            border: "none",
            borderRadius: "6px",
            background: "#8A2BE2",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ??
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(mode === "work" ? 25 * 60 : 5 * 60);
          }}
          style={{
            padding: "6px 8px",
            border: "none",
            borderRadius: "6px",
            background: "#8A2BE2",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ??
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            const newMode = mode === "work" ? "break" : "work";
            setMode(newMode);
            setTimeLeft(newMode === "work" ? 25 * 60 : 5 * 60);
          }}
          style={{
            padding: "6px 8px",
            border: "none",
            borderRadius: "6px",
            background: "#8A2BE2",
            color: "white",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
};
