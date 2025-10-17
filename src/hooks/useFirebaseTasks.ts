import { useState, useEffect } from "react";
import { Task } from "../shared/types";
import {
  addTask,
  updateTask,
  deleteTask,
  subscribeToUserTasks,
} from "../lib/firebase/tasksService";

export const useFirebaseTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time подписка на задачи пользователя
  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const unsubscribe = subscribeToUserTasks(userId, (firebaseTasks) => {
      setTasks(firebaseTasks);
      setLoading(false);
      setError(null);
    });

    // Очистка подписки при размонтировании
    return () => unsubscribe();
  }, [userId]);

  // Добавить задачу
  const handleAddTask = async (task: Omit<Task, "id">) => {
    try {
      setError(null);
      const taskId = await addTask(task);
      return taskId;
    } catch (err) {
      const errorMessage = "Ошибка при добавлении задачи";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Обновить задачу
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setError(null);
      await updateTask(taskId, updates);
    } catch (err) {
      const errorMessage = "Ошибка при обновлении задачи";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Удалить задачу
  const handleDeleteTask = async (taskId: string) => {
    try {
      setError(null);
      await deleteTask(taskId);
    } catch (err) {
      const errorMessage = "Ошибка при удалении задачи";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Переключить статус выполнения
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    await handleUpdateTask(taskId, { completed });
  };
  // ДОБАВЬ ПЕРЕД return { tasks, loading, error, ... }:
  console.log("📱 Mobile Debug: Firebase hook initialized");
  console.log("📱 Mobile Debug: User ID:", userId);
  console.log(
    "📱 Mobile Debug: Firebase config loaded:",
    !!(import.meta as any).env.VITE_FIREBASE_API_KEY
  );
  console.log("📱 Mobile Debug: Current tasks count:", tasks.length);
  return {
    tasks,
    loading,
    error,
    addTask: handleAddTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    toggleTask: handleToggleTask,
  };
};
