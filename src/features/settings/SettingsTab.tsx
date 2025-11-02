import React, { useState, useEffect } from "react";
import { Settings } from "../../types";

interface SettingsTabProps {
  settings: Settings;
  saveSettings: (settings: Settings) => void;
  isMobile: boolean;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  saveSettings,
  isMobile,
}) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [userName, setUserName] = useState("Пользователь");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [language, setLanguage] = useState("Русский");
  const [timezone, setTimezone] = useState("Москва (UTC+3)");

  // Применяем настройки темы сразу при изменении
  useEffect(() => {
    document.body.style.background = localSettings.darkTheme
      ? "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)"
      : "linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)";

    document.body.style.color = localSettings.darkTheme ? "white" : "#2F2F4F";
  }, [localSettings.darkTheme]);

  // Стили из макета
  const sectionTitleStyle = {
    fontSize: isMobile ? "1.3rem" : "1.8rem",
    marginBottom: isMobile ? "15px" : "25px",
    color: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const settingsContainerStyle = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : "repeat(auto-fill, minmax(300px, 1fr))",
    gap: isMobile ? "15px" : "25px",
  };

  const settingsCardStyle = {
    background: "white",
    borderRadius: isMobile ? "15px" : "20px",
    padding: isMobile ? "15px" : "25px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transition: "all 0.4s ease",
  };

  const settingsTitleStyle = {
    fontSize: isMobile ? "1.1rem" : "1.4rem",
    marginBottom: isMobile ? "15px" : "20px",
    color: "#8A2BE2",
  };

  const settingsOptionStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "12px 0" : "15px 0",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
  };

  const settingsLabelStyle = {
    fontWeight: 600,
    fontSize: isMobile ? "0.9rem" : "1rem",
  };

  // Toggle switch стили как в макете
  const toggleStyle = {
    position: "relative" as const,
    display: "inline-block",
    width: "50px",
    height: "24px",
  };

  const sliderStyle = {
    position: "absolute" as const,
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ccc",
    transition: "0.4s",
    borderRadius: "24px",
  };

  const sliderBeforeStyle = (checked: boolean) => ({
    position: "absolute" as const,
    content: '""',
    height: "16px",
    width: "16px",
    left: "4px",
    bottom: "4px",
    backgroundColor: "white",
    transition: "0.4s",
    borderRadius: "50%",
    transform: checked ? "translateX(26px)" : "translateX(0)",
  });

  const colorPickerStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  };

  const colorOptionStyle = (isActive: boolean, color: string) => ({
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    cursor: "pointer",
    border: isActive ? "2px solid #2F2F4F" : "2px solid transparent",
    backgroundColor: color,
  });

  const btnStyle = {
    padding: isMobile ? "10px 15px" : "12px 20px",
    background: "transparent",
    border: "2px solid #8A2BE2",
    color: "#8A2BE2",
    borderRadius: isMobile ? "10px" : "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: isMobile ? "12px" : "14px",
  };

  const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #F8F8FF",
    borderRadius: "8px",
    fontSize: isMobile ? "12px" : "14px",
    width: isMobile ? "120px" : "150px",
    background: "white",
  };

  const selectStyle = {
    padding: "8px 12px",
    border: "1px solid #F8F8FF",
    borderRadius: "8px",
    fontSize: isMobile ? "12px" : "14px",
    width: isMobile ? "120px" : "150px",
    background: "white",
  };

  const handleSettingChange = (key: keyof Settings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleColorChange = (color: string) => {
    handleSettingChange("colorScheme", color);
    // Здесь можно добавить логику применения цветовой схемы
    console.log("Цветовая схема изменена на:", color);
  };

  const handleExportData = () => {
    const data = {
      settings: localSettings,
      userName,
      userEmail,
      language,
      timezone,
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

    alert("Данные успешно экспортированы! 📤");
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);

            // Восстанавливаем настройки
            if (data.settings) {
              setLocalSettings(data.settings);
              saveSettings(data.settings);
            }

            if (data.userName) setUserName(data.userName);
            if (data.userEmail) setUserEmail(data.userEmail);
            if (data.language) setLanguage(data.language);
            if (data.timezone) setTimezone(data.timezone);

            alert("Данные успешно импортированы! 📥");
          } catch (error) {
            alert("Ошибка при импорте данных. Проверьте файл.");
          }
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  const handleResetData = () => {
    if (
      confirm(
        "ВНИМАНИЕ! Вы уверены, что хотите сбросить ВСЕ данные? Это действие нельзя отменить."
      )
    ) {
      // Очищаем localStorage
      localStorage.removeItem("life-wheel-tasks");
      localStorage.removeItem("life-wheel-goals");
      localStorage.removeItem("life-wheel-reflections");
      localStorage.removeItem("life-wheel-settings");

      // Сбрасываем настройки по умолчанию
      const defaultSettings: Settings = {
        archetype: "",
        darkTheme: false,
        notifications: true,
        autoSave: true,
        colorScheme: "purple",
        pwaSettings: {
          offlineMode: true,
          pushNotifications: true,
        },
      };

      setLocalSettings(defaultSettings);
      saveSettings(defaultSettings);
      setUserName("Пользователь");
      setUserEmail("user@example.com");
      setLanguage("Русский");
      setTimezone("Москва (UTC+3)");

      alert("Все данные сброшены! Приложение будет перезагружено.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  const handleSaveProfile = () => {
    // Здесь можно добавить логику сохранения профиля
    alert("Настройки профиля сохранены! ✅");
  };

  const handleTestNotification = () => {
    if (localSettings.notifications) {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Колесо Жизни", {
            body: "Это тестовое уведомление! 🔔",
            icon: "/vite.svg",
          });
        } else if (Notification.permission === "default") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Колесо Жизни", {
                body: "Это тестовое уведомление! 🔔",
                icon: "/vite.svg",
              });
            }
          });
        }
      } else {
        alert("Ваш браузер не поддерживает уведомления");
      }
    } else {
      alert("Включите уведомления в настройках");
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: isMobile ? "15px" : "20px",
        padding: isMobile ? "15px" : "30px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={sectionTitleStyle}>⚙️ Настройки</h2>
      <div style={settingsContainerStyle}>
        {/* Карточка внешнего вида */}
        <div style={settingsCardStyle}>
          <div style={settingsTitleStyle}>Внешний вид</div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Темная тема</div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={localSettings.darkTheme}
                onChange={(e) =>
                  handleSettingChange("darkTheme", e.target.checked)
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  ...sliderStyle,
                  backgroundColor: localSettings.darkTheme ? "#8A2BE2" : "#ccc",
                }}
              >
                <span style={sliderBeforeStyle(localSettings.darkTheme)} />
              </span>
            </label>
          </div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Цветовая схема</div>
            <div style={colorPickerStyle}>
              <div
                style={colorOptionStyle(
                  localSettings.colorScheme === "purple",
                  "#8A2BE2"
                )}
                onClick={() => handleColorChange("purple")}
                title="Фиолетовая"
              />
              <div
                style={colorOptionStyle(
                  localSettings.colorScheme === "teal",
                  "#4ECDC4"
                )}
                onClick={() => handleColorChange("teal")}
                title="Бирюзовая"
              />
              <div
                style={colorOptionStyle(
                  localSettings.colorScheme === "red",
                  "#FF6B6B"
                )}
                onClick={() => handleColorChange("red")}
                title="Красная"
              />
              <div
                style={colorOptionStyle(
                  localSettings.colorScheme === "blue",
                  "#45B7D1"
                )}
                onClick={() => handleColorChange("blue")}
                title="Синяя"
              />
            </div>
          </div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Уведомления</div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={localSettings.notifications}
                onChange={(e) =>
                  handleSettingChange("notifications", e.target.checked)
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  ...sliderStyle,
                  backgroundColor: localSettings.notifications
                    ? "#8A2BE2"
                    : "#ccc",
                }}
              >
                <span style={sliderBeforeStyle(localSettings.notifications)} />
              </span>
            </label>
          </div>

          <div style={{ ...settingsOptionStyle, borderBottom: "none" }}>
            <div style={settingsLabelStyle}>Тест уведомлений</div>
            <button style={btnStyle} onClick={handleTestNotification}>
              <span>🔔</span> Тест
            </button>
          </div>
        </div>

        {/* Карточка PWA настроек */}
        <div style={settingsCardStyle}>
          <div style={settingsTitleStyle}>
            <span>📱</span> PWA Настройки
          </div>

          <div style={settingsOptionStyle}>
            <span style={settingsLabelStyle}>Оффлайн режим</span>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={localSettings.pwaSettings?.offlineMode ?? true}
                onChange={(e) => {
                  const newPwaSettings = {
                    offlineMode: e.target.checked,
                    pushNotifications:
                      localSettings.pwaSettings?.pushNotifications ?? true,
                  };
                  const newSettings = {
                    ...localSettings,
                    pwaSettings: newPwaSettings,
                  };
                  setLocalSettings(newSettings);
                  saveSettings(newSettings);
                }}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  ...sliderStyle,
                  backgroundColor:
                    localSettings.pwaSettings?.offlineMode ?? true
                      ? "#8A2BE2"
                      : "#ccc",
                }}
              >
                <span
                  style={sliderBeforeStyle(
                    localSettings.pwaSettings?.offlineMode ?? true
                  )}
                />
              </span>
            </label>
          </div>

          <div style={{ ...settingsOptionStyle, borderBottom: "none" }}>
            <span style={settingsLabelStyle}>Pomodoro уведомления</span>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={localSettings.pwaSettings?.pushNotifications ?? true}
                onChange={(e) => {
                  const newPwaSettings = {
                    offlineMode: localSettings.pwaSettings?.offlineMode ?? true,
                    pushNotifications: e.target.checked,
                  };
                  const newSettings = {
                    ...localSettings,
                    pwaSettings: newPwaSettings,
                  };
                  setLocalSettings(newSettings);
                  saveSettings(newSettings);
                }}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  ...sliderStyle,
                  backgroundColor:
                    localSettings.pwaSettings?.pushNotifications ?? true
                      ? "#8A2BE2"
                      : "#ccc",
                }}
              >
                <span
                  style={sliderBeforeStyle(
                    localSettings.pwaSettings?.pushNotifications ?? true
                  )}
                />
              </span>
            </label>
          </div>
        </div>

        {/* Карточка управления данными */}
        <div style={settingsCardStyle}>
          <div style={settingsTitleStyle}>Управление данными</div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Автосохранение</div>
            <label style={toggleStyle}>
              <input
                type="checkbox"
                checked={localSettings.autoSave}
                onChange={(e) =>
                  handleSettingChange("autoSave", e.target.checked)
                }
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  ...sliderStyle,
                  backgroundColor: localSettings.autoSave ? "#8A2BE2" : "#ccc",
                }}
              >
                <span style={sliderBeforeStyle(localSettings.autoSave)} />
              </span>
            </label>
          </div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Экспорт данных</div>
            <button style={btnStyle} onClick={handleExportData}>
              <span>📤</span> Экспорт
            </button>
          </div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Импорт данных</div>
            <button style={btnStyle} onClick={handleImportData}>
              <span>📥</span> Импорт
            </button>
          </div>

          <div style={{ ...settingsOptionStyle, borderBottom: "none" }}>
            <div style={settingsLabelStyle}>Сброс данных</div>
            <button
              style={{
                ...btnStyle,
                background: "#FF4500",
                borderColor: "#FF4500",
                color: "white",
              }}
              onClick={handleResetData}
            >
              <span>🔄</span> Сбросить
            </button>
          </div>
        </div>

        {/* Карточка учетной записи */}
        <div style={settingsCardStyle}>
          <div style={settingsTitleStyle}>Учетная запись</div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Имя пользователя</div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Email</div>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Язык</div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={selectStyle}
            >
              <option>Русский</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>

          <div style={settingsOptionStyle}>
            <div style={settingsLabelStyle}>Часовой пояс</div>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              style={selectStyle}
            >
              <option>Москва (UTC+3)</option>
              <option>Киев (UTC+2)</option>
              <option>Лондон (UTC+1)</option>
              <option>Нью-Йорк (UTC-5)</option>
              <option>Токио (UTC+9)</option>
            </select>
          </div>

          <div
            style={{
              ...settingsOptionStyle,
              borderBottom: "none",
              marginTop: "15px",
            }}
          >
            <button
              style={{
                ...btnStyle,
                background: "#8A2BE2",
                borderColor: "#8A2BE2",
                color: "white",
                width: "100%",
                justifyContent: "center",
              }}
              onClick={handleSaveProfile}
            >
              <span>💾</span> Сохранить профиль
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SettingsTab };
