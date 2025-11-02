import React, { useState, useEffect } from "react";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import {
  practiceCategories,
  categoryDescriptions,
  practices,
  Practice,
  PracticeStep,
} from "../data/practices";

interface EnhancedPomodoroProps {
  isMobile: boolean;
}

export const EnhancedPomodoro: React.FC<EnhancedPomodoroProps> = ({
  isMobile,
}) => {
  const {
    mode,
    isRunning,
    currentTime,
    currentPractice,
    currentStepIndex,
    currentStepTime,
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
  } = usePomodoroTimer(isMobile);

  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [showSteps, setShowSteps] = useState(false);

  // Стили
  const containerStyle = {
    background: "white",
    borderRadius: isMobile ? "15px" : "20px",
    padding: isMobile ? "15px" : "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
  };

  const sectionTitleStyle = {
    fontSize: isMobile ? "1.3rem" : "1.8rem",
    marginBottom: isMobile ? "15px" : "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const timerSectionStyle = {
    textAlign: "center" as const,
    padding: isMobile ? "20px" : "30px",
    borderRadius: "15px",
    marginBottom: "20px",
    transition: "all 0.5s ease",
    background:
      mode === "work"
        ? "linear-gradient(135deg, rgba(138, 43, 226, 0.1), rgba(75, 0, 130, 0.05))"
        : "linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(39, 174, 96, 0.05))",
    border: `2px solid ${mode === "work" ? "#8A2BE2" : "#2ecc71"}`,
  };

  const timerDisplayStyle = {
    fontSize: isMobile ? "3rem" : "4rem",
    fontWeight: 700,
    margin: "20px 0",
    fontFamily: "'Courier New', monospace",
    color: mode === "work" ? "#8A2BE2" : "#2ecc71",
    textShadow: "0 5px 15px rgba(0,0,0,0.1)",
  };

  const btnStyle = {
    padding: isMobile ? "12px 18px" : "15px 25px",
    background: "linear-gradient(to right, #8A2BE2, #4B0082)",
    color: "white",
    border: "none",
    borderRadius: isMobile ? "12px" : "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: isMobile ? "14px" : "16px",
    minHeight: "44px",
    justifyContent: "center" as const,
    whiteSpace: "nowrap" as const,
  };

  const secondaryBtnStyle = {
    ...btnStyle,
    background: "transparent",
    border: "2px solid #8A2BE2",
    color: "#8A2BE2",
  };

  const categoryBtnStyle = (isActive: boolean) => ({
    padding: isMobile ? "10px 15px" : "12px 20px",
    background: isActive
      ? "linear-gradient(to right, #8A2BE2, #4B0082)"
      : "rgba(138, 43, 226, 0.1)",
    color: isActive ? "white" : "#8A2BE2",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  });

  const practiceCardStyle = {
    background: "#F8F8FF",
    borderRadius: "12px",
    padding: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  };

  const settingsPanelStyle = {
    background: "#F8F8FF",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    border: "2px solid #8A2BE2",
  };

  const inputStyle = {
    padding: "10px",
    border: "2px solid #E0E0E0",
    borderRadius: "8px",
    fontSize: "16px",
    width: "80px",
    textAlign: "center" as const,
  };

  // Форматирование времени
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTotalTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Уведомления
  const showNotification = (title: string, message: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: message, icon: "/icon-192.png" });
    }
  };

  // Запрос разрешения на уведомления
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Уведомления при смене режима
  useEffect(() => {
    if (currentTime === 0) return;

    if (mode === "work" && currentTime === settings.workTime * 60 - 1) {
      showNotification(
        "🍅 Pomodoro",
        "Рабочая сессия началась! Сфокусируйтесь!"
      );
    } else if (
      mode === "practice" &&
      currentPractice &&
      currentTime === currentPractice.duration - 1
    ) {
      showNotification("🌿 Практика", `Начинается: ${currentPractice.name}`);
    }
  }, [currentTime, mode, currentPractice, settings.workTime]);

  // Шаги практики
  const getCurrentStep = (): PracticeStep | null => {
    if (!currentPractice || currentStepIndex >= currentPractice.steps.length)
      return null;
    return currentPractice.steps[currentStepIndex];
  };

  const getStepProgress = (): number => {
    if (!currentPractice || !getCurrentStep()) return 0;
    const currentStep = getCurrentStep()!;
    return (
      ((currentStep.duration - currentStepTime) / currentStep.duration) * 100
    );
  };

  return (
    <div style={containerStyle}>
      {/* Заголовок */}
      <h2 style={sectionTitleStyle}>
        <span>🍅</span>
        Умный Pomodoro Таймер
      </h2>

      {/* Настройки */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          style={secondaryBtnStyle}
          onClick={() => setShowSettings(!showSettings)}
        >
          <span>⚙️</span> Настройки
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            💼 {sessionCount} сессий
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            🌿 {techniquesUsed} практик
          </div>
        </div>
      </div>

      {showSettings && (
        <div style={settingsPanelStyle}>
          <h3 style={{ color: "#8A2BE2", marginBottom: "15px" }}>
            ⚙️ Настройки времени
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "15px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: 600,
                }}
              >
                🕐 Работа (минуты)
              </label>
              <input
                type="number"
                style={inputStyle}
                value={localSettings.workTime}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    workTime: parseInt(e.target.value) || 25,
                  }))
                }
                min="1"
                max="120"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: 600,
                }}
              >
                🔄 Отдых (секунды)
              </label>
              <input
                type="number"
                style={inputStyle}
                value={localSettings.breakTime}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    breakTime: parseInt(e.target.value) || 30,
                  }))
                }
                min="1"
                max="600"
              />
            </div>
          </div>
          <button
            style={{ ...btnStyle, marginTop: "15px" }}
            onClick={() => {
              applySettings(localSettings);
              setShowSettings(false);
            }}
          >
            💾 Применить настройки
          </button>
        </div>
      )}

      {/* Секция таймера */}
      <div style={timerSectionStyle}>
        <div
          style={{
            fontSize: isMobile ? "1.1rem" : "1.3rem",
            fontWeight: 600,
            marginBottom: "10px",
          }}
        >
          {mode === "work" ? "💼 Рабочая сессия" : "🌿 Практика восстановления"}
        </div>

        {currentPractice && (
          <div
            style={{
              fontSize: isMobile ? "0.9rem" : "1.1rem",
              marginBottom: "10px",
              color: "#2ecc71",
            }}
          >
            {currentPractice.emoji} {currentPractice.name}
          </div>
        )}

        <div style={timerDisplayStyle}>{formatTime(currentTime)}</div>

        {/* Прогресс бар основного таймера */}
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "4px",
            margin: "20px 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              backgroundColor: mode === "work" ? "#8A2BE2" : "#2ecc71",
              width: `${
                (1 -
                  currentTime /
                    (mode === "work"
                      ? settings.workTime * 60
                      : currentPractice?.duration || 1)) *
                100
              }%`,
              transition: "width 1s linear",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Шаги практики */}
        {mode === "practice" && currentPractice && (
          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                📋 Шаг {currentStepIndex + 1} из {currentPractice.steps.length}
              </div>
              <button
                style={{
                  ...secondaryBtnStyle,
                  padding: "5px 10px",
                  fontSize: "0.8rem",
                }}
                onClick={() => setShowSteps(!showSteps)}
              >
                {showSteps ? "▲" : "▼"} Шаги
              </button>
            </div>

            {getCurrentStep() && (
              <>
                <div
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "5px",
                    fontWeight: 600,
                  }}
                >
                  {getCurrentStep()!.name}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    marginBottom: "8px",
                    color: "#666",
                  }}
                >
                  {getCurrentStep()!.instruction}
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      backgroundColor: "#2ecc71",
                      width: `${getStepProgress()}%`,
                      transition: "width 1s linear",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Управление */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button style={btnStyle} onClick={toggleTimer}>
            <span>{isRunning ? "⏸" : "▶"}</span>
            {isRunning ? "Стоп" : "Старт"}
          </button>
          <button style={secondaryBtnStyle} onClick={resetTimer}>
            <span>↺</span>
            Сброс
          </button>
        </div>
      </div>

      {/* Детальные шаги практики */}
      {showSteps && mode === "practice" && currentPractice && (
        <div
          style={{
            background: "#F8F8FF",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "20px",
            border: "2px solid #2ecc71",
          }}
        >
          <h4 style={{ color: "#2ecc71", marginBottom: "10px" }}>
            📋 Шаги выполнения
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {currentPractice.steps.map((step, index) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  background:
                    index === currentStepIndex
                      ? "rgba(46, 204, 113, 0.2)"
                      : index < currentStepIndex
                      ? "rgba(46, 204, 113, 0.1)"
                      : "rgba(0,0,0,0.05)",
                  borderLeft: `4px solid ${
                    index === currentStepIndex
                      ? "#2ecc71"
                      : index < currentStepIndex
                      ? "#27ae60"
                      : "#bdc3c7"
                  }`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {step.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    ⏱️ {step.duration} сек
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#666",
                    marginTop: "4px",
                  }}
                >
                  {step.instruction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Практики восстановления */}
      <div style={{ marginTop: "30px" }}>
        <h3
          style={{
            ...sectionTitleStyle,
            fontSize: isMobile ? "1.2rem" : "1.5rem",
          }}
        >
          <span>🌿</span>
          Практики восстановления
        </h3>

        <div
          style={{
            background: "#F8F8FF",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "20px",
            borderLeft: "3px solid #8A2BE2",
          }}
        >
          {
            categoryDescriptions[
              currentCategory as keyof typeof categoryDescriptions
            ]
          }
        </div>

        {/* Категории */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          {Object.entries(practiceCategories).map(([key, label]) => (
            <button
              key={key}
              style={categoryBtnStyle(currentCategory === key)}
              onClick={() => showCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Сетка практик */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "12px",
          }}
        >
          {getFilteredPractices().map((practice) => (
            <div
              key={practice.id}
              style={practiceCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "#8A2BE2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "transparent";
              }}
              onClick={() => selectPractice(practice.id)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{practice.emoji}</span>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: isMobile ? "0.9rem" : "1rem",
                  }}
                >
                  {practice.name}
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.8,
                  marginBottom: "8px",
                }}
              >
                {practice.description}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  opacity: 0.7,
                }}
              >
                <span>
                  ⏱️ {Math.floor(practice.duration / 60)}:
                  {(practice.duration % 60).toString().padStart(2, "0")}
                </span>
                <span>🔄 {practice.steps.length} шагов</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
