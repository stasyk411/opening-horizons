import React, { useState, useEffect } from "react";
import { Task } from "../../shared/types";
import { dataManager } from "../../shared/lib/data-manager";
import { Check, Clock, Bell, MoveRight, Calendar } from "lucide-react";

export const TodayTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodayTasks();
  }, []);

  const loadTodayTasks = async () => {
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = await dataManager.getTasks(today);
    setTasks(todayTasks);
    setLoading(false);
  };

  const handleToggleTask = async (taskId: string) => {
    await dataManager.toggleTask(taskId);
    await loadTodayTasks();
  };

  const handleMoveToCove = async (taskId: string) => {
    await dataManager.moveTaskToCove(taskId);
    await loadTodayTasks();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  const getSphereColor = (sphere: string) => {
    const colors = {
      health: "bg-red-500",
      development: "bg-purple-500",
      finance: "bg-yellow-500",
      hobby: "bg-pink-500",
      family: "bg-green-500",
      career: "bg-blue-500",
    };
    return colors[sphere as keyof typeof colors] || "bg-gray-400";
  };

  if (loading) {
    return (
      <div className="min-h-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-gray-600">Загрузка задач...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 md:p-4">
      <div className="max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
            Задачи на сегодня
          </h1>
          <p className="text-white/80 text-xs md:text-sm">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Список задач */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-white/20">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Нет задач на сегодня
              </h3>
              <p className="text-gray-500 text-sm">
                Создайте задачи через планирование или колесо баланса
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 md:p-4 rounded-lg border-2 transition-all duration-200 ${
                    task.isCompleted
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Чекбокс выполнения */}
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-500"
                      }`}
                    >
                      {task.isCompleted && <Check className="w-3 h-3" />}
                    </button>

                    {/* Контент задачи */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`w-2 h-2 rounded-full ${getSphereColor(
                            task.sphere
                          )}`}
                        />
                        <span className="text-xs text-gray-500 capitalize">
                          {task.sphere}
                        </span>
                        {task.priority !== "none" && (
                          <span
                            className={`text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority === "high"
                              ? "Высокий"
                              : task.priority === "medium"
                              ? "Средний"
                              : "Низкий"}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm md:text-base ${
                          task.isCompleted
                            ? "line-through text-gray-500"
                            : "text-gray-800"
                        }`}
                      >
                        {task.text}
                      </p>

                      {/* Детали задачи */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {task.timeSlot && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>
                              {task.timeSlot.start} - {task.timeSlot.end}
                            </span>
                          </div>
                        )}

                        {task.withAlarm && (
                          <div className="flex items-center space-x-1 text-xs text-orange-500">
                            <Bell className="w-3 h-3" />
                            <span>Напоминание</span>
                          </div>
                        )}

                        {task.recurrence !== "none" && (
                          <div className="flex items-center space-x-1 text-xs text-blue-500">
                            <span>
                              🔄{" "}
                              {task.recurrence === "daily"
                                ? "Ежедневно"
                                : task.recurrence === "weekly"
                                ? "Еженедельно"
                                : "Ежемесячно"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Кнопка перемещения в бухту */}
                    {!task.isCompleted && (
                      <button
                        onClick={() => handleMoveToCove(task.id)}
                        className="flex-shrink-0 p-1 md:p-2 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                        title="Переместить в бухту отдыха"
                      >
                        <MoveRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Статистика */}
          {tasks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-600">
                <span>
                  Выполнено: {tasks.filter((t) => t.isCompleted).length} из{" "}
                  {tasks.length}
                </span>
                <span>
                  {Math.round(
                    (tasks.filter((t) => t.isCompleted).length / tasks.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div
                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (tasks.filter((t) => t.isCompleted).length /
                        tasks.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
