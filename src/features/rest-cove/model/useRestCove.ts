import { useState, useMemo } from "react";
import { Task, LifeSphere } from "../../../shared/types";

export const useRestCove = (tasks: Task[], spheres: LifeSphere[]) => {
  const [reflectionText, setReflectionText] = useState("");

  // Невыполненные задачи за сегодня
  const uncompletedTasks = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.filter((task) => !task.completed);
  }, [tasks]);

  // Перенести задачу на завтра
  const moveTaskToTomorrow = (taskId: string) => {
    // Здесь будет логика переноса (пока заглушка)
    console.log("Переносим задачу на завтра:", taskId);
  };

  // Удалить задачу без выполнения
  const removeTask = (taskId: string) => {
    // Здесь будет логика удаления (пока заглушка)
    console.log("Удаляем задачу:", taskId);
  };

  // Получить сферу по ID
  const getSphereById = (sphereId: string) => {
    return spheres.find((sphere) => sphere.id === sphereId);
  };

  return {
    uncompletedTasks,
    reflectionText,
    setReflectionText,
    moveTaskToTomorrow,
    removeTask,
    getSphereById,
  };
};
