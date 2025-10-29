// 📝 ШАГ 2: ПОЛНЫЙ ФАЙЛ useAuth.ts
import { useState, useEffect } from "react";
import { AuthData, User, LoginFormData } from "../types/auth";
import { validateLoginForm, sanitizeAuthData } from "../../../validation";

export const useAuth = () => {
  const [authData, setAuthData] = useState<AuthData>({
    isLoggedIn: false,
    user: null,
    loginTime: null,
  });

  // ВЕРИФИКАЦИЯ ПРИ ЗАГРУЗКЕ с использованием системы верификации
  useEffect(() => {
    const verifyAndLoadAuth = () => {
      try {
        const savedAuth = localStorage.getItem("life-wheel-auth");

        if (savedAuth) {
          // Используем санітизацию из системы верификации
          const sanitizedAuth = sanitizeAuthData(savedAuth);

          if (sanitizedAuth) {
            setAuthData(sanitizedAuth);
            console.log(
              "✅ Auth verified and loaded:",
              sanitizedAuth.user?.username
            );
          } else {
            // Невалидные данные - очищаем
            localStorage.removeItem("life-wheel-auth");
            console.log("⚠️ Invalid auth data cleared by verification system");
          }
        }
      } catch (error) {
        console.error("❌ Auth verification failed:", error);
        localStorage.removeItem("life-wheel-auth");
      }
    };

    verifyAndLoadAuth();
  }, []);

  const login = (formData: LoginFormData) => {
    // ВАЛИДАЦИЯ ФОРМЫ с использованием системы верификации
    const validation = validateLoginForm(formData);

    if (!validation.isValid) {
      const errorMessage = validation.errors
        .map((err) => err.message)
        .join(", ");
      throw new Error(errorMessage);
    }

    // БАЗОВАЯ ПРОВЕРКА ПАРОЛЯ ДЛЯ РЕАЛИЗМА
    if (formData.password.length < 3) {
      throw new Error("Пароль должен содержать не менее 3 символов");
    }

    const user: User = {
      id: Date.now().toString(),
      username: formData.username.trim(),
      createdAt: new Date().toISOString(),
    };

    const newAuthData: AuthData = {
      isLoggedIn: true,
      user,
      loginTime: new Date().toISOString(),
    };

    setAuthData(newAuthData);
    localStorage.setItem("life-wheel-auth", JSON.stringify(newAuthData));

    console.log("✅ User logged in with verification:", user.username);
    return user;
  };

  const logout = () => {
    console.log("✅ User logged out");
    setAuthData({
      isLoggedIn: false,
      user: null,
      loginTime: null,
    });
    localStorage.removeItem("life-wheel-auth");
  };

  return {
    authData,
    login,
    logout,
    isAuthenticated: authData.isLoggedIn,
  };
};
