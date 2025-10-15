/**
 * Генератор компактных уникальных ID
 * Формат: timestamp + случайная строка (20 символов)
 * Пример: "1635781234567x3k8j7"
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substr(2, 6); // 6 случайных символов
  return `${timestamp}${randomString}`;
};

/**
 * Генератор ID с префиксом для лучшей читаемости
 * Пример: "task_1635781234567x3k8j7"
 */
export const generatePrefixedId = (prefix: string): string => {
  return `${prefix}_${generateId()}`;
};
