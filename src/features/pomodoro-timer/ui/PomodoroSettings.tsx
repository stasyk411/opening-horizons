import React, { useState } from "react";
import {
  PomodoroSettings as PomodoroSettingsType,
  PomodoroPreset,
} from "../../../shared/types/pomodoro";
import { defaultPomodoroSettings } from "../../../shared/lib/pomodoro-timer";

interface PomodoroSettingsProps {
  settings: PomodoroSettingsType;
  onSettingsChange: (settings: PomodoroSettingsType) => void;
  onStart: () => void;
}

export const PomodoroSettings: React.FC<PomodoroSettingsProps> = ({
  settings,
  onSettingsChange,
  onStart,
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const presets = [
    {
      id: "ultraFocus" as PomodoroPreset,
      name: "🧠 Ультра-фокус",
      work: 15,
      break: 3,
    },
    { id: "sprint" as PomodoroPreset, name: "📈 Спринт", work: 25, break: 5 },
    {
      id: "classic" as PomodoroPreset,
      name: "⚖️ Классический",
      work: 45,
      break: 15,
    },
    {
      id: "deepWork" as PomodoroPreset,
      name: "🚀 Глубокая работа",
      work: 90,
      break: 20,
    },
    {
      id: "flowState" as PomodoroPreset,
      name: "🌊 Состояние потока",
      work: 120,
      break: 30,
    },
    {
      id: "custom" as PomodoroPreset,
      name: "⭐ Свои настройки",
      work: 25,
      break: 5,
    },
  ];

  const handlePresetSelect = (presetId: PomodoroPreset) => {
    const newSettings = {
      ...localSettings,
      currentPreset: presetId,
      presets: {
        ...localSettings.presets,
        custom: localSettings.presets.custom, // Сохраняем кастомные настройки
      },
    };

    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleCustomWorkChange = (value: number) => {
    const newSettings = {
      ...localSettings,
      presets: {
        ...localSettings.presets,
        custom: { ...localSettings.presets.custom, work: value },
      },
    };

    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleCustomBreakChange = (value: number) => {
    const newSettings = {
      ...localSettings,
      presets: {
        ...localSettings.presets,
        custom: { ...localSettings.presets.custom, break: value },
      },
    };

    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const getCurrentPreset = () => {
    return presets.find((preset) => preset.id === localSettings.currentPreset);
  };

  const currentPreset = getCurrentPreset();

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ⚙️ Настройка таймера
        </h2>
        <p className="text-gray-600">Выберите подходящий режим работы</p>
      </div>

      {/* Выбор шаблона */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📋 Выберите шаблон:
        </h3>
        <div className="space-y-2">
          {presets.map((preset) => (
            <label
              key={preset.id}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="radio"
                name="preset"
                value={preset.id}
                checked={localSettings.currentPreset === preset.id}
                onChange={() => handlePresetSelect(preset.id)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span
                className={`flex-1 py-2 px-3 rounded-lg border ${
                  localSettings.currentPreset === preset.id
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="font-medium">{preset.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({preset.work} мин / {preset.break} мин)
                </span>
                {preset.id === "sprint" && (
                  <span className="text-yellow-500 ml-1">★</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Кастомные настройки */}
      {localSettings.currentPreset === "custom" && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            ⭐ Кастомные настройки:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Работа (минуты):
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={localSettings.presets.custom.work}
                onChange={(e) => handleCustomWorkChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Перерыв (минуты):
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={localSettings.presets.custom.break}
                onChange={(e) =>
                  handleCustomBreakChange(Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Текущие настройки */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🎯 Текущие настройки:
        </h3>
        <div className="text-sm text-gray-700">
          <div>
            Режим: <span className="font-semibold">{currentPreset?.name}</span>
          </div>
          <div>
            Работа:{" "}
            <span className="font-semibold">
              {currentPreset?.work || localSettings.presets.custom.work} минут
            </span>
          </div>
          <div>
            Перерыв:{" "}
            <span className="font-semibold">
              {currentPreset?.break || localSettings.presets.custom.break} минут
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка старта */}
      <button
        onClick={onStart}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        ▶️ Начать с выбранными настройками
      </button>
    </div>
  );
};
