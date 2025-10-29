// 📝 ИСПРАВЛЕННЫЙ ФАЙЛ authValidator.ts
import { ValidationResult, ValidationError } from "../types/validation";
import { AuthData, User, LoginFormData } from "../../features/auth/types/auth";

export const validateLoginForm = (
  formData: LoginFormData
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!formData.username?.trim()) {
    errors.push({
      field: "username",
      message: "Имя пользователя обязательно",
      value: formData.username,
      code: "USERNAME_REQUIRED",
    });
  } else if (formData.username.trim().length < 3) {
    errors.push({
      field: "username",
      message: "Имя пользователя должно быть не менее 3 символов",
      value: formData.username,
      code: "USERNAME_TOO_SHORT",
    });
  }

  if (!formData.password) {
    errors.push({
      field: "password",
      message: "Пароль обязателен",
      value: "",
      code: "PASSWORD_REQUIRED",
    });
  } else if (formData.password.length < 1) {
    errors.push({
      field: "password",
      message: "Пароль должен содержать хотя бы 1 символ",
      value: "*".repeat(formData.password.length),
      code: "PASSWORD_TOO_SHORT",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAuthData = (authData: unknown): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!authData || typeof authData !== "object") {
    return {
      isValid: false,
      errors: [
        {
          field: "auth",
          message: "Invalid auth data structure",
          value: authData,
          code: "INVALID_AUTH_STRUCTURE",
        },
      ],
    };
  }

  const data = authData as Record<string, unknown>;

  // Валидация isLoggedIn
  if (typeof data.isLoggedIn !== "boolean") {
    errors.push({
      field: "isLoggedIn",
      message: "isLoggedIn must be a boolean",
      value: data.isLoggedIn,
      code: "INVALID_IS_LOGGED_IN",
    });
  }

  // Валидация user
  if (data.isLoggedIn && (!data.user || typeof data.user !== "object")) {
    errors.push({
      field: "user",
      message: "User data is required when logged in",
      value: data.user,
      code: "USER_DATA_REQUIRED",
    });
  }

  // Валидация структуры пользователя
  if (data.user && typeof data.user === "object") {
    const user = data.user as Record<string, unknown>;

    if (!user.username || typeof user.username !== "string") {
      errors.push({
        field: "user.username",
        message: "Username is required and must be a string",
        value: user.username,
        code: "INVALID_USERNAME",
      });
    }

    if (!user.id || typeof user.id !== "string") {
      errors.push({
        field: "user.id",
        message: "User ID is required and must be a string",
        value: user.id,
        code: "INVALID_USER_ID",
      });
    }

    if (!user.createdAt || typeof user.createdAt !== "string") {
      errors.push({
        field: "user.createdAt",
        message: "Creation date is required and must be a string",
        value: user.createdAt,
        code: "INVALID_CREATED_AT",
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeAuthData = (rawData: string): AuthData | null => {
  try {
    const parsed = JSON.parse(rawData);
    const validation = validateAuthData(parsed);

    if (!validation.isValid) {
      console.warn("Invalid auth data found, clearing:", validation.errors);
      return null;
    }

    return parsed as AuthData;
  } catch (error) {
    console.error("Failed to parse auth data:", error);
    return null;
  }
};
