import React from "react";
import { Task, LifeSphere } from "../../../shared/types";
import { useRestCove } from "../model/useRestCove";
import { UncompletedTasks } from "./UncompletedTasks";

interface RestCoveProps {
  tasks: Task[];
  spheres: LifeSphere[];
}

export const RestCove: React.FC<RestCoveProps> = ({ tasks, spheres }) => {
  const {
    uncompletedTasks,
    reflectionText,
    setReflectionText,
    moveTaskToTomorrow,
    removeTask,
    getSphereById,
  } = useRestCove(tasks, spheres);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Заголовок с атмосферой отдыха */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-800 mb-2">
          🌴 Бухта отдыха
        </h2>
        <p className="text-gray-600 text-lg">
          Место для рефлексии и планирования невыполненных задач
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {uncompletedTasks.length}
          </div>
          <div className="text-blue-800">Невыполненных задач</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {tasks.length - uncompletedTasks.length}
          </div>
          <div className="text-green-800">Выполнено сегодня</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {tasks.length}
          </div>
          <div className="text-purple-800">Всего задач</div>
        </div>
      </div>

      {/* Невыполненные задачи */}
      <UncompletedTasks
        tasks={uncompletedTasks}
        getSphereById={getSphereById}
        onMoveToTomorrow={moveTaskToTomorrow}
        onRemove={removeTask}
      />

      {/* Рефлексия */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          💭 Рефлексия дня
        </h3>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="Что помешало выполнить задачи? Какие уроки можно извлечь? Какие планы на завтра?"
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
        <div className="text-sm text-gray-500 mt-2">
          {reflectionText.length}/500 символов
        </div>
      </div>

      {/* Советы */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Советы:</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Переносите важные задачи на завтра</li>
          <li>• Удаляйте неактуальные задачи без сожаления</li>
          <li>• Анализируйте причины невыполнения</li>
          <li>• Планируйте реалистичное количество задач</li>
        </ul>
      </div>
    </div>
  );
};
