import React from 'react';
import { Settings } from '../../types';

interface SettingsTabProps {
  settings: Settings;
  saveSettings: (settings: Settings) => void;
  isMobile: boolean;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  saveSettings,
  isMobile
}) => {
  return (
    <div style={{ padding: isMobile ? '15px' : '20px' }}>
      <h2 style={{ color: '#8A2BE2', marginBottom: '20px' }}>
        ⚙️ Настройки
      </h2>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px' 
      }}>
        <p>Архетип: {settings.archetype}</p>
        <p>Темная тема: {settings.darkTheme ? 'Вкл' : 'Выкл'}</p>
        <p>Уведомления: {settings.notifications ? 'Вкл' : 'Выкл'}</p>
        <p>Автосохранение: {settings.autoSave ? 'Вкл' : 'Выкл'}</p>
      </div>
    </div>
  );
};

export { SettingsTab };
