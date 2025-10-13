import { useState } from "react";
import {
  Archetype,
  ArchetypeConfig,
  Task,
} from "../../../shared/types/archetypes";

export const useArchetypePlanning = () => {
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const archetypes: ArchetypeConfig[] = [
    {
      id: "fox",
      icon: "🦊",
      title: "Лиса",
      description: "Ранняя пташка, максимум энергии с утра",
      schedule: [
        "7:00-9:00 - Фокус",
        "9:00-12:00 - Активная работа",
        "12:00-13:00 - Обед",
      ],
    },
    {
      id: "dolphin",
      icon: "🐬",
      title: "Дельфин",
      description: "Гибкий график, два пика продуктивности",
      schedule: [
        "9:00-11:00 - Вход в день",
        "11:00-14:00 - Пик",
        "16:00-19:00 - Второй пик",
      ],
    },
    {
      id: "owl",
      icon: "🦉",
      title: "Сова",
      description: "Ночной режим, креативность вечером",
      schedule: ["10:00-12:00 - Медленный старт", "19:00-23:00 - Фокус-блок"],
    },
  ];

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return {
    archetype,
    setArchetype,
    tasks,
    addTask,
    completeTask,
    archetypes,
  };
};
