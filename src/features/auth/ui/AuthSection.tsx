// 📝 ИСПРАВЛЕННЫЙ ФАЙЛ AuthSection.tsx С ДИАГНОСТИКОЙ
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { LoginFormData } from "../types/auth";
import { validateLoginForm, ValidationError } from "../../../validation";

interface AuthSectionProps {
  isMobile: boolean;
  darkTheme: boolean;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  isMobile,
  darkTheme,
}) => {
  console.log("🔧 AuthSection rendered", { isMobile, darkTheme });

  const { authData, login, logout, isAuthenticated } = useAuth();
  console.log("🔧 Auth state:", { isAuthenticated, user: authData.user });

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleLogin = async () => {
    // Валидация формы
    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setErrors([]);
      await login(formData);
      setFormData({ username: "", password: "" });
    } catch (err) {
      setErrors([
        {
          field: "general",
          message: err instanceof Error ? err.message : "Ошибка входа",
          value: "",
          code: "LOGIN_FAILED",
        },
      ]);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Очищаем ошибки для этого поля при изменении
    setErrors((prev) =>
      prev.filter((error) => error.field !== field && error.field !== "general")
    );
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find((error) => error.field === fieldName)?.message;
  };

  const sectionStyle = {
    background: darkTheme ? "#2a2a2a" : "white",
    borderRadius: "12px",
    padding: isMobile ? "15px" : "20px",
    marginBottom: "20px",
    border: `1px solid ${darkTheme ? "#444" : "#e0e0e0"}`,
  };

  const inputStyle = (hasError: boolean) => ({
    padding: "12px",
    border: `1px solid ${hasError ? "#dc3545" : darkTheme ? "#555" : "#ddd"}`,
    borderRadius: "8px",
    background: darkTheme ? "#333" : "white",
    color: darkTheme ? "white" : "#333",
  });

  if (isAuthenticated && authData.user) {
    return (
      <div style={sectionStyle}>
        <h3 style={{ color: darkTheme ? "white" : "#2F2F4F", marginTop: 0 }}>
          🔐 Аккаунт
        </h3>
        <div
          style={{
            background: "linear-gradient(135deg, #8A2BE2, #4B0082)",
            color: "white",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>✅ Вы вошли в систему</div>
          <div>
            Пользователь: <strong>{authData.user.username}</strong>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Вход выполнен: {new Date(authData.loginTime!).toLocaleString()}
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            background: darkTheme ? "#555" : "#f0f0f0",
            color: darkTheme ? "#ccc" : "#666",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <div style={sectionStyle}>
      <h3 style={{ color: darkTheme ? "white" : "#2F2F4F", marginTop: 0 }}>
        🔐 Аккаунт
      </h3>

      {/* Общие ошибки */}
      {getFieldError("general") && (
        <div
          style={{
            background: "#dc3545",
            color: "white",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontSize: "14px",
          }}
        >
          {getFieldError("general")}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "300px",
        }}
      >
        <div>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            style={inputStyle(!!getFieldError("username"))}
          />
          {getFieldError("username") && (
            <div
              style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}
            >
              {getFieldError("username")}
            </div>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            style={inputStyle(!!getFieldError("password"))}
          />
          {getFieldError("password") && (
            <div
              style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px" }}
            >
              {getFieldError("password")}
            </div>
          )}
        </div>

        <button
          onClick={handleLogin}
          disabled={!formData.username.trim() || !formData.password}
          style={{
            padding: "12px 20px",
            background:
              formData.username.trim() && formData.password
                ? "linear-gradient(to right, #8A2BE2, #4B0082)"
                : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor:
              formData.username.trim() && formData.password
                ? "pointer"
                : "not-allowed",
          }}
        >
          Войти
        </button>
      </div>

      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          background: darkTheme ? "#333" : "#f8f9fa",
          borderRadius: "6px",
          fontSize: "14px",
          color: darkTheme ? "#ccc" : "#666",
        }}
      >
        💡 <strong>Демо-режим:</strong> пароль должен содержать не менее 3
        символов
      </div>
    </div>
  );
};
