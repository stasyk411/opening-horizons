import { useMemo } from "react";
import { Task, LifeSphere } from "../../../shared/types";

interface UseStatisticsProps {
  tasks: Task[];
  spheres: LifeSphere[];
}

export const useStatistics = ({ tasks, spheres }: UseStatisticsProps) => {
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Распределение по сферам
    const sphereStats = spheres.map((sphere) => {
      const sphereTasks = tasks.filter((task) => task.category === sphere.id);
      const completed = sphereTasks.filter((task) => task.completed).length;
      const total = sphereTasks.length;

      return {
        ...sphere,
        taskCount: total,
        completedCount: completed,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
      };
    });

    // Самая продуктивная сфера
    const mostProductiveSphere = sphereStats
      .filter((sphere) => sphere.taskCount > 0)
      .sort((a, b) => b.completionRate - a.completionRate)[0];

    return {
      totalTasks,
      completedTasks,
      completionRate: Math.round(completionRate),
      sphereStats,
      mostProductiveSphere,
    };
  }, [tasks, spheres]);

  return stats;
};
