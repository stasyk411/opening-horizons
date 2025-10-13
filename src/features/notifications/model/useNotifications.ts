import { useState, useEffect, useCallback } from "react";
import { notificationService } from "./notificationService";

export interface NotificationSettings {
  enabled: boolean;
  pendingReminders: boolean;
  progressUpdates: boolean;
}

export const useNotifications = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    pendingReminders: true,
    progressUpdates: true,
  });

  useEffect(() => {
    if (notificationService.isSupported()) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await notificationService.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const showTestNotification = useCallback(() => {
    notificationService.showNotification("Тестовое уведомление", {
      body: "Уведомления работают! ✅",
    });
  }, []);

  const updateSettings = useCallback(
    (newSettings: Partial<NotificationSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  return {
    isSupported: notificationService.isSupported(),
    permission,
    settings,
    requestPermission,
    showTestNotification,
    updateSettings,
  };
};
