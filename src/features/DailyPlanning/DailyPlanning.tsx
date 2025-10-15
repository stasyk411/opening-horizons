import React, { useState, useEffect } from "react";
import { Task, LifeSphere } from "../../shared/types";
import { Archetype } from "../../shared/types/archetypes";
import { dataManager } from "../../shared/lib/data-manager";
import { generateId } from "../../shared/lib/id-generator";
import {
  Plus,
  Clock,
  Bell,
  Repeat,
  Target,
  Calendar,
  Zap,
  Activity,
  Brain,
} from "lucide-react";

interface DailyPlanningProps {
  selectedSphere?: LifeSphere;
}

const PRIORITY_OPTIONS: {
  value: "low" | "medium" | "high";
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    value: "high",
    label: "Высокий",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    value: "medium",
    label: "Средний",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    value: "low",
    label: "Низкий",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
];

const RECURRENCE_OPTIONS: {
  value: string;
  label: string;
  icon: string;
}[] = [
  { value: "none", label: "Не повторять", icon: "❌" },
  { value: "daily", label: "Ежедневно", icon: "📅" },
  { value: "weekly", label: "Еженедельно", icon: "📆" },
  { value: "monthly", label: "Ежемесячно", icon: "🗓️" },
];

const SPHERE_LABELS: Record<LifeSphere, string> = {
  health: "Здоровье",
  development: "Развитие",
  finance: "Финансы",
  hobby: "Хобби",
  family: "Семья",
  career: "Карьера",
};

const ARCHETYPE_CONFIG: Record<
  Archetype,
  {
    label: string;
    emoji: string;
    icon: React.ReactNode;
    description: string;
    color: string;
    tips: string[];
  }
> = {
  fox: {
    label: "Лиса",
    emoji: "🦊",
    icon: <Zap className="w-5 h-5" />,
    description: "Фокус и эффективность",
    color: "from-orange-500 to-red-500",
    tips: [
      "Фокусируйтесь на 2-3 важных задачах",
      "Избегайте многозадачности",
      "Используйте тайм-блоки",
    ],
  },
  dolphin: {
    label: "Дельфин",
    emoji: "🐬",
    icon: <Activity className="w-5 h-5" />,
    description: "Гибкость и баланс",
    color: "from-blue-500 to-cyan-500",
    tips: [
      "Планируйте с запасом времени",
      "Будьте готовы к изменениям",
      "Балансируйте разные сферы жизни",
    ],
  },
  owl: {
    label: "Сова",
    emoji: "🦉",
    icon: <Brain className="w-5 h-5" />,
    description: "Анализ и стратегия",
    color: "from-purple-500 to-indigo-500",
    tips: [
      "Анализируйте перед действием",
      "Планируйте долгосрочно",
      "Уделяйте время обучению",
    ],
  },
};

interface TaskForm {
  title: string;
  sphere: LifeSphere;
  date: string;
  timeSlot?: { start: string; end: string };
  priority: "low" | "medium" | "high";
  withAlarm: boolean;
  alarmTime?: string;
  recurrence: string;
  goalId?: string;
}

export const DailyPlanning: React.FC<DailyPlanningProps> = ({
  selectedSphere,
}) => {
  const [task, setTask] = useState<TaskForm>({
    title: "",
    sphere: selectedSphere || "health",
    date: new Date().toISOString().split("T")[0],
    timeSlot: undefined,
    priority: "low",
    withAlarm: false,
    alarmTime: undefined,
    recurrence: "none",
    goalId: undefined,
  });

  const [archetype, setArchetype] = useState<Archetype>("fox");
  const [goals, setGoals] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<"archetype" | "planning">(
    "archetype"
  );

  useEffect(() => {
    if (selectedSphere) {
      setTask((prev) => ({ ...prev, sphere: selectedSphere }));
    }
    loadGoals();
  }, [selectedSphere]);

  const loadGoals = async () => {
    const allGoals = await dataManager.getGoals();
    setGoals(allGoals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.title.trim()) return;

    // Создаем задачу в правильном формате
    const newTask: Task = {
      id: generateId(),
      title: task.title,
      completed: false,
      priority: task.priority,
      sphere: task.sphere,
      date: task.date,
      createdAt: new Date().toISOString(),
    };

    await dataManager.addTask(newTask);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Сбрасываем форму, но сохраняем выбранную сферу и архетип
    setTask({
      title: "",
      sphere: task.sphere,
      date: new Date().toISOString().split("T")[0],
      timeSlot: undefined,
      priority: "low",
      withAlarm: false,
      alarmTime: undefined,
      recurrence: "none",
      goalId: undefined,
    });
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const renderArchetypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Выберите архетип дня
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Какой подход к планированию вам подходит сегодня?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.entries(ARCHETYPE_CONFIG) as [Archetype, any][]).map(
          ([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setArchetype(key);
                setCurrentStep("planning");
              }}
              className={`p-4 md:p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                archetype === key
                  ? `border-transparent bg-gradient-to-r ${config.color} text-white shadow-lg transform scale-105`
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{config.emoji}</span>
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      archetype === key ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {config.label}
                  </h3>
                  <p
                    className={`text-sm ${
                      archetype === key ? "text-white/90" : "text-gray-600"
                    }`}
                  >
                    {config.description}
                  </p>
                </div>
              </div>

              <ul className="space-y-1">
                {config.tips.map((tip: string, index: number) => (
                  <li
                    key={index}
                    className={`text-xs ${
                      archetype === key ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    • {tip}
                  </li>
                ))}
              </ul>
            </button>
          )
        )}
      </div>

      <button
        onClick={() => setCurrentStep("planning")}
        className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
      >
        Пропустить выбор архетипа
      </button>
    </div>
  );

  const renderPlanningForm = () => (
    <div className="space-y-6">
      {/* Заголовок с архетипом */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Планирование дня
          </h2>
          <p className="text-gray-600 text-sm">
            {archetype &&
              `Архетип: ${ARCHETYPE_CONFIG[archetype].label} ${ARCHETYPE_CONFIG[archetype].emoji}`}
          </p>
        </div>
        <button
          onClick={() => setCurrentStep("archetype")}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          Сменить архетип
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основной текст задачи */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Опишите задачу *
          </label>
          <textarea
            value={task.title}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Например: Утренняя пробежка 30 минут..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none shadow-sm text-sm md:text-base"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Сфера жизни */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Сфера жизни
            </label>
            <select
              value={task.sphere}
              onChange={(e) =>
                setTask((prev) => ({
                  ...prev,
                  sphere: e.target.value as LifeSphere,
                }))
              }
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm md:text-base"
            >
              {Object.entries(SPHERE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Приоритет */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Приоритет задачи
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setTask((prev) => ({ ...prev, priority: option.value }))
                  }
                  className={`p-2 md:p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                    task.priority === option.value
                      ? `${option.bgColor} border-gray-300 font-semibold`
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`text-xs md:text-sm ${
                      task.priority === option.value
                        ? option.color
                        : "text-gray-600"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Дата */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Дата выполнения
            </label>
            <input
              type="date"
              value={task.date || ""}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm md:text-base"
            />
          </div>

          {/* Временной слот */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Время выполнения
            </label>
            <div className="flex space-x-2 md:space-x-3">
              <input
                type="time"
                value={task.timeSlot?.start || ""}
                onChange={(e) =>
                  setTask((prev) => ({
                    ...prev,
                    timeSlot: {
                      ...prev.timeSlot,
                      start: e.target.value,
                      end: prev.timeSlot?.end || "",
                    },
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm"
              />
              <span className="flex items-center text-gray-400">—</span>
              <input
                type="time"
                value={task.timeSlot?.end || ""}
                onChange={(e) =>
                  setTask((prev) => ({
                    ...prev,
                    timeSlot: {
                      ...prev.timeSlot,
                      start: prev.timeSlot?.start || "",
                      end: e.target.value,
                    },
                  }))
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Привязка к цели */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Привязать к цели
            </label>
            <select
              value={task.goalId || ""}
              onChange={(e) =>
                setTask((prev) => ({
                  ...prev,
                  goalId: e.target.value || undefined,
                }))
              }
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-sm md:text-base"
            >
              <option value="">Без привязки</option>
              {goals.map((goal: any) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          {/* Повторение */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Repeat className="w-4 h-4 mr-2" />
              Повторение
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RECURRENCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setTask((prev) => ({ ...prev, recurrence: option.value }))
                  }
                  className={`p-2 md:p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                    task.recurrence === option.value
                      ? "bg-purple-100 border-purple-300 font-semibold"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-xs">{option.icon}</span>
                    <span className="text-xs md:text-sm text-gray-600">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Уведомление */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={task.withAlarm}
                onChange={(e) => {
                  setTask((prev) => ({ ...prev, withAlarm: e.target.checked }));
                  if (e.target.checked) requestNotificationPermission();
                }}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-all duration-200 ${
                  task.withAlarm ? "bg-purple-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                    task.withAlarm ? "left-5" : "left-1"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                Напомнить о задаче
              </span>
            </div>
          </label>

          {task.withAlarm && (
            <div className="mt-3 pl-12">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Время напоминания
              </label>
              <input
                type="time"
                value={task.alarmTime || ""}
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, alarmTime: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 md:py-4 px-4 md:px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Добавить задачу
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Компактный заголовок */}
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
            {currentStep === "archetype"
              ? "Выбор архетипа"
              : "Планирование дня"}
          </h1>
          <p className="text-white/80 text-xs md:text-sm">
            {currentStep === "archetype"
              ? "Выберите подход к планированию на сегодня"
              : "Создайте задачу для выбранной сферы жизни"}
          </p>
        </div>

        {/* Карточка формы */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl border border-white/20">
          {currentStep === "archetype"
            ? renderArchetypeSelection()
            : renderPlanningForm()}
        </div>

        {/* Уведомление об успехе */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in-right text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span>Задача добавлена!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
