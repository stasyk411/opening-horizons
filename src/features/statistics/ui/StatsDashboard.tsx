import React from "react";
import { LifeSphere, Task } from "../../../shared/types";
import { useStatistics } from "../model/useStatistics";

interface StatsDashboardProps {
  tasks: Task[];
  spheres: LifeSphere[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  tasks,
  spheres,
}) => {
  const stats = useStatistics({ tasks, spheres });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">📊 Статистика</h2>

      {/* Основная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {stats.totalTasks}
          </div>
          <div className="text-blue-800 mt-2">Всего задач</div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <div className="text-3xl font-bold text-green-600">
            {stats.completedTasks}
          </div>
          <div className="text-green-800 mt-2">Выполнено</div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {stats.completionRate}%
          </div>
          <div className="text-purple-800 mt-2">Процент выполнения</div>
        </div>
      </div>

      {/* Самая продуктивная сфера */}
      {stats.mostProductiveSphere && (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🏆 Самая продуктивная сфера
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{stats.mostProductiveSphere.icon}</span>
            <div>
              <div className="font-medium text-yellow-900">
                {stats.mostProductiveSphere.name}
              </div>
              <div className="text-yellow-700 text-sm">
                {stats.mostProductiveSphere.completionRate}% выполнено (
                {stats.mostProductiveSphere.completedCount}/
                {stats.mostProductiveSphere.taskCount} задач)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Статистика по сферам */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">
          📈 Распределение по сферам
        </h3>
        <div className="space-y-4">
          {stats.sphereStats.map((sphere) => (
            <div key={sphere.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{sphere.icon}</span>
                <span className="font-medium">{sphere.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {sphere.completedCount}/{sphere.taskCount} выполнено
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: sphere.color }}
                >
                  {sphere.completionRate}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
