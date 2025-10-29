// 📝 ПОЛНЫЙ ФАЙЛ validation/types/validation.ts:

export interface ValidationError {
  field: string;
  message: string;
  value: any;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  data?: any;
}

export type Validator = (value: any, context?: any) => string | null;

export interface ValidationRules {
  [field: string]: Validator[];
}
