import React, { useState } from 'react';

  const SettingsTab = () => {
    const [importData, setImportData] = useState("");

    const exportData = () => {
      const data = {
        tasks,
        goals,
        reflections,
        settings,
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = `life-wheel-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();

      alert("? Данные экспортированы!");
    };

    const handleImport = () => {
      try {
        const data = JSON.parse(importData);

        if (data.tasks) saveTasks(data.tasks);
        if (data.goals) saveGoals(data.goals);
        if (data.reflections) saveReflections(data.reflections);
        if (data.settings) saveSettings(data.settings);

        setImportData("");
        alert("? Данные импортированы!");
      } catch (error) {
        alert("? Ошибка при импорте: неверный формат JSON");
      }
    };

    const resetData = () => {
      if (
        confirm(
          "Вы уверены, что хотите сбросить ВСЕ данные? Это действие нельзя отменить."
        )
      ) {
        localStorage.removeItem("life-wheel-tasks");
        localStorage.removeItem("life-wheel-goals");
        localStorage.removeItem("life-wheel-reflections");
        localStorage.removeItem("life-wheel-settings");
        setTasks([]);
        setGoals([]);
        setReflections([]);
        alert("? Данные сброшены!");
      }
    };

    return (
      <div
        style={{
          padding: isMobile ? "15px" : "20px",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <h2
          style={{
            color: "#8A2BE2",
            marginBottom: "20px",
            fontSize: isMobile ? "1.5em" : "2em",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Настройки
        </h2>

        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          {/* Внешний вид */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "20px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "15px" }}>
              Внешний вид
            </h3>

            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "white", fontSize: "14px" }}>
                  Темная тема
                </span>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "50px",
                    height: "24px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.darkTheme}
                    onChange={(e) =>
                      saveSettings({ ...settings, darkTheme: e.target.checked })
                    }
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.darkTheme ? "#8A2BE2" : "#ccc",
                      borderRadius: "24px",
                      transition: "0.4s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: '""',
                        height: "18px",
                        width: "18px",
                        left: settings.darkTheme ? "26px" : "3px",
                        bottom: "3px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        transition: "0.4s",
                      }}
                    ></span>
                  </span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "white", fontSize: "14px" }}>
                  Уведомления
                </span>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "50px",
                    height: "24px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) =>
                      saveSettings({
                        ...settings,
                        notifications: e.target.checked,
                      })
                    }
                    style={{ display: "none" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.notifications
                        ? "#8A2BE2"
                        : "#ccc",
                      borderRadius: "24px",
                      transition: "0.4s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        content: '""',
                        height: "18px",
                        width: "18px",
                        left: settings.notifications ? "26px" : "3px",
                        bottom: "3px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        transition: "0.4s",
                      }}
                    ></span>
                  </span>
                </label>
              </div>
            </div>

            {/* КНОПКА POMODORO */}
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setShowPomodoro(!showPomodoro)}
                style={{
                  padding: "12px",
                  background: "#8A2BE2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                {showPomodoro ? "? Скрыть Pomodoro" : "?? Показать Pomodoro"}
              </button>
            </div>
          </div>

          {/* Управление данными */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "20px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "15px" }}>
              Управление данными
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <button
                onClick={exportData}
                style={{
                  padding: "12px",
                  background: "#8A2BE2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ?? Экспорт данных
              </button>

              <div>
                <div
                  style={{
                    color: "white",
                    fontSize: "12px",
                    marginBottom: "5px",
                  }}
                >
                  Импорт данных (JSON):
                </div>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Вставьте JSON данные..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #8A2BE2",
                    borderRadius: "6px",
                    fontSize: "12px",
                    marginBottom: "8px",
                    resize: "vertical",
                    background: "white",
                    color: "#333",
                  }}
                />
                <button
                  onClick={handleImport}
                  style={{
                    padding: "8px 12px",
                    background: "#8A2BE2",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    width: "100%",
                  }}
                >
                  ?? Импорт данных
                </button>
              </div>

              <button
                onClick={resetData}
                style={{
                  padding: "12px",
                  background: "#FF4500",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ?? Сбросить все данные
              </button>
            </div>
          </div>
        </div>

        {/* Pomodoro Timer */}
        {showPomodoro && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PomodoroTimer />
          </div>
        )}
      </div>
    );
  };
