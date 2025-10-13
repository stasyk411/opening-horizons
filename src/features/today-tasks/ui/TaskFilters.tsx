import React from "react";
import { LifeSphere } from "../../../shared/types";
import { TaskFilter, PriorityFilter } from "../model/useTodayTasks";

interface TaskFiltersProps {
  selectedFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  selectedPriority: PriorityFilter;
  onPriorityChange: (priority: PriorityFilter) => void;
  selectedSphere: string;
  onSphereChange: (sphereId: string) => void;
  spheres: LifeSphere[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  selectedPriority,
  onPriorityChange,
  selectedSphere,
  onSphereChange,
  spheres,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg border">
      {/* Фильтр по статусу */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Статус</label>
        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value as TaskFilter)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все задачи</option>
          <option value="active">Активные</option>
          <option value="completed">Выполненные</option>
        </select>
      </div>

      {/* Фильтр по приоритету */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Приоритет</label>
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value as PriorityFilter)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все приоритеты</option>
          <option value="high">Высокий</option>
          <option value="medium">Средний</option>
          <option value="low">Низкий</option>
        </select>
      </div>

      {/* Фильтр по сфере */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Сфера</label>
        <select
          value={selectedSphere}
          onChange={(e) => onSphereChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Все сферы</option>
          {spheres.map((sphere) => (
            <option key={sphere.id} value={sphere.id}>
              {sphere.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
