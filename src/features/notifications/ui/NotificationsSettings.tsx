import React from "react";
import { useNotifications } from "../model/useNotifications";

export const NotificationsSettings: React.FC = () => {
  const {
    isSupported,
    permission,
    settings,
    requestPermission,
    showTestNotification,
    updateSettings,
  } = useNotifications();

  if (!isSupported) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">🔔 Уведомления</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p>Браузер не поддерживает уведомления</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🔔 Настройки уведомлений</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Разрешения</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-medium">
              Статус:{" "}
              {permission === "granted" ? "✅ Разрешено" : "❌ Не разрешено"}
            </div>
          </div>
          {permission !== "granted" && (
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Разрешить
            </button>
          )}
        </div>

        {permission === "granted" && (
          <button
            onClick={showTestNotification}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Тестовое уведомление
          </button>
        )}
      </div>
    </div>
  );
};
