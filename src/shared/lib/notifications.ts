// Мягкие звуковые сигналы для Pomodoro
class NotificationService {
  private audioContext: AudioContext | null = null;
  private isAudioEnabled = true;

  constructor() {
    // Проверяем поддержку Web Audio API
    if (typeof window !== "undefined" && "AudioContext" in window) {
      this.audioContext = new AudioContext();
    }
  }

  // Включение/выключение звука
  setAudioEnabled(enabled: boolean) {
    this.isAudioEnabled = enabled;
  }

  // Мягкий звук начала работы
  async playStartSound() {
    if (!this.isAudioEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Мягкий восходящий тон
      oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        440,
        this.audioContext.currentTime + 0.3
      );

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        this.audioContext.currentTime + 0.1
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.5
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }

  // Мягкий звук окончания
  async playCompleteSound() {
    if (!this.isAudioEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Мягкий нисходящий тон
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        220,
        this.audioContext.currentTime + 0.5
      );

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        this.audioContext.currentTime + 0.1
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.7
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.7);
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }

  // Звук перерыва
  async playBreakSound() {
    if (!this.isAudioEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Легкий колокольчик
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        523.25,
        this.audioContext.currentTime
      ); // C5

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.08,
        this.audioContext.currentTime + 0.1
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.8
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.8);

      // Второй тон через небольшую паузу
      setTimeout(() => {
        if (!this.isAudioEnabled || !this.audioContext) return;

        const oscillator2 = this.audioContext.createOscillator();
        const gainNode2 = this.audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(this.audioContext.destination);

        oscillator2.type = "sine";
        oscillator2.frequency.setValueAtTime(
          659.25,
          this.audioContext.currentTime
        ); // E5

        gainNode2.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(
          0.06,
          this.audioContext.currentTime + 0.1
        );
        gainNode2.gain.exponentialRampToValueAtTime(
          0.001,
          this.audioContext.currentTime + 0.6
        );

        oscillator2.start(this.audioContext.currentTime);
        oscillator2.stop(this.audioContext.currentTime + 0.6);
      }, 200);
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  }

  // Уведомление браузера (если разрешено)
  async showBrowserNotification(title: string, message: string) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
        silent: true, // Не использовать системные звуки
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "/favicon.ico",
          silent: true,
        });
      }
    }
  }

  // Комплексное уведомление о начале
  async notifySessionStart(phase: string, duration: number) {
    this.playStartSound();

    const phaseNames = {
      work: "Рабочий период",
      shortBreak: "Короткий перерыв",
      longBreak: "Длинный перерыв",
    };

    this.showBrowserNotification(
      "Pomodoro начат 🍅",
      `${phaseNames[phase as keyof typeof phaseNames]} на ${duration} минут`
    );
  }

  // Комплексное уведомление об окончании
  async notifySessionComplete(phase: string, nextPhase: string) {
    if (phase === "work") {
      this.playCompleteSound();
      this.showBrowserNotification(
        "Поздравляем! 🎉",
        "Рабочий период завершен. Время для перерыва!"
      );
    } else {
      this.playBreakSound();
      this.showBrowserNotification(
        "Перерыв окончен 🔔",
        "Время возвращаться к работе!"
      );
    }
  }
}

// Создаем глобальный экземпляр
export const notificationService = new NotificationService();
