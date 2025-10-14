import React from "react";
import { Archetype } from "../../../shared/types/archetypes";

interface DayPlannerProps {
  currentArchetype: Archetype;
}

export const DayPlanner: React.FC<DayPlannerProps> = ({ currentArchetype }) => {
  const getArchetypeConfig = () => {
    const configs = {
      fox: {
        emoji: "🦊",
        title: "Лиса",
        description: "Энергичен и сфокусирован с утра",
        energyLevel: "Высокая энергия",
        characteristics: [
          "💪 Много энергии для достижения целей",
          "🎯 Лучшая продуктивность с 7:00 до 12:00",
          "⚡ Быстро принимает решения",
          "📈 Эффективен в сложных задачах",
        ],
        recommendations: [
          "Сложные задачи планируй на утро",
          "Используй утреннюю энергию для главных целей",
          "После обеда - встречи и коммуникации",
        ],
      },
      dolphin: {
        emoji: "🐬",
        title: "Дельфин",
        description: "Нужна гибкость и разнообразие",
        energyLevel: "Два пика энергии",
        characteristics: [
          "🔄 Два пика энергии: утро и вечер",
          "🎭 Любит разнообразие в задачах",
          "🤝 Эффективен в команде",
          "⚖️ Нужен баланс работы и отдыха",
        ],
        recommendations: [
          "Чередуй типы задач в течение дня",
          "Сложные задачи - в пики энергии (11:00-14:00, 17:00-20:00)",
          "Делай короткие перерывы между задачами",
        ],
      },
      owl: {
        emoji: "🦉",
        title: "Сова",
        description: "Творческий и продуктивный вечером",
        energyLevel: "Энергия растет к вечеру",
        characteristics: [
          "🎨 Творческий подход к задачам",
          "🌙 Пик продуктивности после 18:00",
          "💡 Генерирует идеи в спокойной обстановке",
          "📚 Любит глубокое погружение в темы",
        ],
        recommendations: [
          "Утром - легкие, разогревающие задачи",
          "Основную работу планируй на вечер",
          "Используй вечер для творческих проектов",
        ],
      },
    };

    return configs[currentArchetype] || configs.fox;
  };

  const config = getArchetypeConfig();

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      {/* Заголовок с архетипом */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <h2 className="font-bold text-lg text-gray-800">{config.title}</h2>
          <p className="text-sm text-gray-600">{config.description}</p>
          <p className="text-xs text-blue-500 font-medium mt-1">
            {config.energyLevel}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Характеристики архетипа */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <span>✨</span>
            Особенности {config.title}:
          </h3>
          <ul className="space-y-2 text-sm text-amber-700">
            {config.characteristics.map((char, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Рекомендации по планированию */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span>💡</span>
            Рекомендации по планированию:
          </h3>
          <ul className="space-y-2 text-sm text-green-700">
            {config.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-0.5">🎯</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Призыв к действию */}
        <div className="text-center py-4">
          <p className="text-gray-500 mb-4 text-sm">
            Используй свои сильные стороны для эффективного планирования
          </p>
          <div className="flex flex-col gap-2 max-w-md mx-auto">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">
              + Добавить задачу
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium">
              + Создать цель
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
