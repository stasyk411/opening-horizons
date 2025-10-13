import { useState, useMemo } from "react";
import { Task, LifeSphere } from "../../../shared/types";

export type TaskFilter = "all" | "active" | "completed";
export type PriorityFilter = "all" | "high" | "medium" | "low";

interface UseTodayTasksProps {
  tasks: Task[];
  spheres: LifeSphere[];
}

export const useTodayTasks = ({ tasks, spheres }: UseTodayTasksProps) => {
  const [selectedFilter, setSelectedFilter] = useState<TaskFilter>("all");
  const [selectedPriority, setSelectedPriority] =
    useState<PriorityFilter>("all");
  const [selectedSphere, setSelectedSphere] = useState<string>("all");

  const today = new Date().toISOString().split("T")[0];

  // Фильтрация задач
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Фильтр по статусу
      const statusMatch =
        selectedFilter === "all" ||
        (selectedFilter === "active" && !task.completed) ||
        (selectedFilter === "completed" && task.completed);

      // Фильтр по приоритету
      const priorityMatch =
        selectedPriority === "all" || task.priority === selectedPriority;

      // Фильтр по сфере
      const sphereMatch =
        selectedSphere === "all" || task.category === selectedSphere;

      return statusMatch && priorityMatch && sphereMatch;
    });
  }, [tasks, selectedFilter, selectedPriority, selectedSphere]);

  // Статистика
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;

    return { total, completed, active };
  }, [tasks]);

  return {
    filteredTasks,
    stats,
    selectedFilter,
    setSelectedFilter,
    selectedPriority,
    setSelectedPriority,
    selectedSphere,
    setSelectedSphere,
    spheres,
    today,
  };
};
