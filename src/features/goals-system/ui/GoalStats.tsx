import React from "react";

interface GoalStatsProps {
  stats: {
    total: number;
    completed: number;
    active: number;
    progress: number;
  };
}

export const GoalStats: React.FC<GoalStatsProps> = ({ stats }) => {
  const getMotivationalMessage = () => {
    if (stats.total === 0) return "🎯 Начните с первой цели!";
    if (stats.progress === 100) return "🎉 Все цели завершены! Вы великолепны!";
    if (stats.progress >= 80)
      return "💪 Почти у цели! Осталось совсем немного!";
    if (stats.progress >= 50)
      return "🚀 Отличный прогресс! Продолжайте в том же духе!";
    if (stats.progress > 0) return "📈 Хорошее начало! Каждый шаг важен!";
    return "🌟 Время начинать! Первый шаг - самый важный!";
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg mb-4 sm:mb-6 mx-2 sm:mx-0">
      <h3 className="text-lg sm:text-xl font-semibold text-center mb-4 sm:mb-5">
        📊 Статистика целей
      </h3>

      {/* Responsive grid: 2 колонки на mobile, 4 на desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">{stats.total}</div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">Всего</div>
        </div>

        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">{stats.active}</div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">Активных</div>
        </div>

        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">
            {stats.completed}
          </div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">Завершено</div>
        </div>

        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">
            {stats.progress}%
          </div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">Прогресс</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white bg-opacity-20 rounded-full h-2 sm:h-3 mb-3 sm:mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${stats.progress}%` }}
        ></div>
      </div>

      {/* Motivational message */}
      <div className="text-xs sm:text-sm text-center opacity-90 italic">
        {getMotivationalMessage()}
      </div>
    </div>
  );
};
