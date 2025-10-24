import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class EmergencyErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  private backupData = () => {
    try {
      const appState = {
        tasks: localStorage.getItem("tasks"),
        goals: localStorage.getItem("goals"),
        reflections: localStorage.getItem("reflections"),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("emergencyBackup", JSON.stringify(appState));
    } catch (e) {
      console.warn("Backup failed:", e);
    }
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.backupData();
    console.error("App Crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>😵 Что-то пошло не так</h2>
          <p>Приложение столкнулось с ошибкой. Данные сохранены.</p>
          <button onClick={() => window.location.reload()}>
            Перезагрузить приложение
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
