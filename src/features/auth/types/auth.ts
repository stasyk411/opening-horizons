// 📝 ШАГ 2: Добавляем типы для авторизации
export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
}

export interface AuthData {
  isLoggedIn: boolean;
  user: User | null;
  loginTime: string | null;
}

export interface LoginFormData {
  username: string;
  password: string;
}
