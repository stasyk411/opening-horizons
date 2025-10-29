// 📝 ПОЛНЫЙ ФАЙЛ features/goals-system/hooks/useGoalValidation.ts:

import { useState, useCallback } from "react";
import {
  ValidationError,
  validateGoal,
  validateGoalStep,
} from "../../../validation";
import { Goal, GoalStep } from "../../../types";

export const useGoalValidation = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateGoalForm = useCallback((goalData: Partial<Goal>) => {
    const validation = validateGoal(goalData);
    setErrors(validation.errors);
    return validation;
  }, []);

  const validateStepForm = useCallback((stepData: Partial<GoalStep>) => {
    const validation = validateGoalStep(stepData);
    return validation;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return errors.find((error) => error.field === fieldName)?.message;
    },
    [errors]
  );

  const hasErrors = useCallback((): boolean => {
    return errors.length > 0;
  }, [errors]);

  return {
    errors,
    validateGoalForm,
    validateStepForm,
    clearErrors,
    getFieldError,
    hasErrors,
  };
};
