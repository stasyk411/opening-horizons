class NotificationService {
  isSupported(): boolean {
    return "Notification" in window;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return "denied";
    if (Notification.permission === "default") {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (!this.isSupported() || Notification.permission !== "granted") return;
    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });
  }
}

export const notificationService = new NotificationService();
