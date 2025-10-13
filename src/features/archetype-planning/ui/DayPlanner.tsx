import React from "react";
import { useArchetypePlanning } from "../model/useArchetypePlanning";
import { ArchetypeSelector } from "./ArchetypeSelector";
import { TimeBlock } from "../../../shared/types/archetypes";

export const DayPlanner: React.FC = () => {
  const { archetype, setArchetype, tasks } = useArchetypePlanning();

  const getTimeBlocks = (): TimeBlock[] => {
    const blocks = {
      fox: [
        { time: "7:00-9:00", label: "Утренний фокус", type: "focus" as const },
        { time: "9:00-12:00", label: "Активная работа", type: "work" as const },
        { time: "12:00-13:00", label: "Обед + отдых", type: "break" as const },
        {
          time: "13:00-17:00",
          label: "Коммуникации",
          type: "meeting" as const,
        },
        {
          time: "17:00-19:00",
          label: "Завершение дня",
          type: "wrapup" as const,
        },
      ],
      dolphin: [
        { time: "9:00-11:00", label: "Вход в день", type: "work" as const },
        {
          time: "11:00-14:00",
          label: "Пик продуктивности",
          type: "focus" as const,
        },
        {
          time: "14:00-16:00",
          label: "Перерыв + движение",
          type: "break" as const,
        },
        {
          time: "16:00-19:00",
          label: "Второй пик энергии",
          type: "work" as const,
        },
        {
          time: "19:00-21:00",
          label: "Творческие задачи",
          type: "focus" as const,
        },
      ],
      owl: [
        {
          time: "10:00-12:00",
          label: "Медленный старт",
          type: "work" as const,
        },
        {
          time: "12:00-15:00",
          label: "Административные задачи",
          type: "work" as const,
        },
        {
          time: "15:00-19:00",
          label: "Коммуникации, встречи",
          type: "meeting" as const,
        },
        { time: "19:00-23:00", label: "Фокус-блок", type: "focus" as const },
      ],
    };

    return archetype ? blocks[archetype] : blocks.fox;
  };

  if (!archetype) {
    return <ArchetypeSelector />;
  }

  const currentArchetype = useArchetypePlanning().archetypes.find(
    (a) => a.id === archetype
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentArchetype?.icon}</span>
          <div>
            <h2 className="font-bold">План дня</h2>
            <p className="text-sm text-gray-600">
              Режим "{currentArchetype?.title}"
            </p>
          </div>
        </div>
        <button
          className="text-sm text-blue-500"
          onClick={() => setArchetype(null)}
        >
          Сменить
        </button>
      </div>

      <div className="space-y-4">
        {getTimeBlocks().map((block) => (
          <div key={block.time} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{block.time}</span>
              <span className="text-sm text-gray-500">{block.label}</span>
            </div>
            <div className="text-sm text-gray-600">
              {tasks.filter((task) => task.timeBlock === block.time).length}{" "}
              задач
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
