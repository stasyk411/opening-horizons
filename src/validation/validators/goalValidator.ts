// 📝 ПОЛНЫЙ ФАЙЛ validation/validators/goalValidator.ts:

import {
  ValidationError,
  ValidationResult,
  Validator,
} from "../types/validation";
import { Goal, GoalStep } from "../../types";

// Базовые валидаторы
export const Validators = {
  required:
    (fieldName: string): Validator =>
    (value: any) =>
      !value ? `${fieldName} обязательно для заполнения` : null,

  minLength:
    (min: number, fieldName: string): Validator =>
    (value: string) =>
      value && value.length < min
        ? `${fieldName} должен содержать минимум ${min} символов`
        : null,

  maxLength:
    (max: number, fieldName: string): Validator =>
    (value: string) =>
      value && value.length > max
        ? `${fieldName} должен содержать максимум ${max} символов`
        : null,

  isDate:
    (fieldName: string): Validator =>
    (value: string) =>
      value && !/^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `Неверный формат даты для ${fieldName}. Используйте YYYY-MM-DD`
        : null,

  futureDate:
    (fieldName: string): Validator =>
    (value: string) => {
      if (!value) return null;
      return new Date(value) <= new Date()
        ? `${fieldName} должна быть в будущем`
        : null;
    },

  oneOf:
    (allowed: any[], fieldName: string): Validator =>
    (value: any) =>
      value && !allowed.includes(value)
        ? `${fieldName} должен быть одним из: ${allowed.join(", ")}`
        : null,

  arrayMaxLength:
    (max: number, fieldName: string): Validator =>
    (value: any[]) =>
      value && value.length > max
        ? `${fieldName} не может содержать больше ${max} элементов`
        : null,
};

// Схема валидации для Goal
const GoalValidationSchema = {
  title: [
    Validators.required("Название цели"),
    Validators.minLength(1, "Название цели"),
    Validators.maxLength(100, "Название цели"),
  ],
  description: [Validators.maxLength(500, "Описание цели")],
  deadline: [Validators.isDate("Дедлайн"), Validators.futureDate("Дедлайн")],
  priority: [
    Validators.required("Приоритет"),
    Validators.oneOf(["low", "medium", "high"], "Приоритет"),
  ],
  category: [Validators.required("Категория")],
  steps: [Validators.arrayMaxLength(20, "Шаги цели")],
};

// Схема валидации для GoalStep
const GoalStepValidationSchema = {
  title: [
    Validators.required("Название шага"),
    Validators.minLength(1, "Название шага"),
    Validators.maxLength(200, "Название шага"),
  ],
};

// Валидатор для GoalStep
export const validateGoalStep = (step: Partial<GoalStep>): ValidationResult => {
  const errors: ValidationError[] = [];

  for (const [field, validators] of Object.entries(GoalStepValidationSchema)) {
    const value = step[field as keyof GoalStep];

    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors.push({
          field,
          message: error,
          value,
          code: `INVALID_${field.toUpperCase()}`,
        });
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? (step as GoalStep) : undefined,
  };
};

// Главный валидатор для Goal
export const validateGoal = (goal: Partial<Goal>): ValidationResult => {
  const errors: ValidationError[] = [];

  // Валидация основных полей
  for (const [field, validators] of Object.entries(GoalValidationSchema)) {
    const value = goal[field as keyof Goal];

    for (const validator of validators) {
      const error = validator(value);
      if (error) {
        errors.push({
          field,
          message: error,
          value,
          code: `INVALID_${field.toUpperCase()}`,
        });
        break;
      }
    }
  }

  // Валидация шагов
  if (goal.steps) {
    for (let i = 0; i < goal.steps.length; i++) {
      const stepValidation = validateGoalStep(goal.steps[i]);
      if (!stepValidation.isValid) {
        stepValidation.errors.forEach((error) => {
          errors.push({
            field: `steps[${i}].${error.field}`,
            message: error.message,
            value: error.value,
            code: error.code,
          });
        });
      }
    }
  }

  // Бизнес-правила
  if (goal.completed && goal.steps?.some((step) => !step.completed)) {
    errors.push({
      field: "completed",
      message: "Нельзя завершить цель с незавершенными шагами",
      value: goal.completed,
      code: "INCOMPLETE_STEPS",
    });
  }

  if (
    goal.deadline &&
    goal.createdAt &&
    new Date(goal.deadline) < new Date(goal.createdAt)
  ) {
    errors.push({
      field: "deadline",
      message: "Дедлайн не может быть раньше даты создания цели",
      value: goal.deadline,
      code: "INVALID_DEADLINE_DATE",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? (goal as Goal) : undefined,
  };
};

// Валидатор для загрузки данных из localStorage
export const validateStoredGoal = (data: any): Goal | null => {
  try {
    // Базовая проверка структуры
    if (!data || typeof data !== "object") return null;

    const requiredFields = [
      "id",
      "title",
      "priority",
      "category",
      "steps",
      "createdAt",
    ];
    for (const field of requiredFields) {
      if (!(field in data)) return null;
    }

    // Валидация через основную функцию
    const validation = validateGoal(data);
    return validation.isValid ? validation.data! : null;
  } catch (error) {
    console.error("Goal validation error:", error);
    return null;
  }
};
// 📝 ПОЛНЫЙ ФАЙЛ validation/validators/goalValidator.ts (добавляем в конец):

// ... предыдущий код остается без изменений ...

// Экспорт для тестирования в браузере (только для разработки)
if (typeof window !== "undefined") {
  (window as any).GoalValidator = {
    validateStoredGoal,
    validateGoal,
    validateGoalStep,
  };
}
