import React from "react";
import { Task, LifeSphere } from "../../../shared/types";
import { useTodayTasks } from "../model/useTodayTasks";
import { TaskFilters } from "./TaskFilters";
import { TaskItem } from "./TaskItem";

interface TodayTasksProps {
  tasks: Task[];
  spheres: LifeSphere[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TodayTasks: React.FC<TodayTasksProps> = ({
  tasks,
  spheres,
  onToggleTask,
  onDeleteTask,
}) => {
  const {
    filteredTasks,
    stats,
    selectedFilter,
    setSelectedFilter,
    selectedPriority,
    setSelectedPriority,
    selectedSphere,
    setSelectedSphere,
  } = useTodayTasks({ tasks, spheres });

  const getSphereById = (sphereId: string) => {
    return spheres.find((sphere) => sphere.id === sphereId);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Заголовок и статистика */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📋 Задачи на сегодня
        </h2>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-blue-800">Всего</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-sm text-green-800">Активных</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.completed}
            </div>
            <div className="text-sm text-purple-800">Выполнено</div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <TaskFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedSphere={selectedSphere}
        onSphereChange={setSelectedSphere}
        spheres={spheres}
      />

      {/* Список задач */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {tasks.length === 0
              ? "На сегодня задач нет. Добавьте задачи в планировании!"
              : "Задачи не найдены по выбранным фильтрам"}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              sphere={getSphereById(task.category || "")}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};
