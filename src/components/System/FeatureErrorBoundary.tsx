import React, { Component, ErrorInfo, ReactNode } from "react";

interface FeatureErrorBoundaryProps {
  children: ReactNode;
  featureName: string;
}

interface FeatureErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class FeatureErrorBoundary extends Component<
  FeatureErrorBoundaryProps,
  FeatureErrorBoundaryState
> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): FeatureErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `Ошибка в фиче "${this.props.featureName}":`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            margin: "10px 0",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⚠️</div>
          <h3 style={{ margin: "0 0 10px 0" }}>
            Ошибка в {this.props.featureName}
          </h3>
          <p style={{ margin: "0 0 15px 0", opacity: 0.9 }}>
            {this.state.error?.message || "Произошла непредвиденная ошибка"}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "white",
              border: "none",
              color: "#FF6B6B",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Перезагрузить приложение
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
