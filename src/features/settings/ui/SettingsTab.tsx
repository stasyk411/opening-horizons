// 📝 ИСПРАВЛЕННЫЙ ФАЙЛ SettingsTab.tsx С ДИАГНОСТИКОЙ
import React from "react";
import { Settings } from "../../../types";
import { AuthSection } from "../../auth/ui/AuthSection";

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
  console.log("🔧 SettingsTab rendered");

  return (
    <div
      style={{
        padding: isMobile ? "10px" : "20px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: settings.darkTheme ? "white" : "#2F2F4F",
        }}
      >
        Настройки
      </h2>

      {/* АВТОРИЗАЦИЯ КАК ОТДЕЛЬНАЯ ФИЧА */}
      <AuthSection isMobile={isMobile} darkTheme={settings.darkTheme} />

      {/* СУЩЕСТВУЮЩИЕ СЕКЦИИ НАСТРОЕК */}
      <div
        style={{
          background: settings.darkTheme ? "#2a2a2a" : "white",
          borderRadius: "12px",
          padding: isMobile ? "15px" : "20px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            margin: "0 0 15px 0",
            color: settings.darkTheme ? "white" : "#2F2F4F",
          }}
        >
          🎨 Внешний вид
        </h3>
        {/* ... существующий код настроек ... */}
      </div>
    </div>
  );
};

export default SettingsTab;
