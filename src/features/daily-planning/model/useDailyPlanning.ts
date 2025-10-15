import { useState } from "react";
import { Task, LifeSphere } from "../../../shared/types";
import { generateId } from "../../../shared/lib/id-generator";

interface UseDailyPlanningProps {
  selectedSphere: LifeSphere | null;
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const useDailyPlanning = ({
  selectedSphere,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: UseDailyPlanningProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = () => {
    if (!newTaskTitle.trim() || !selectedSphere) return;

    const newTask: Task = {
      id: generateId(), // ← ИСПРАВЛЕНО: используем наш генератор
      title: newTaskTitle,
      completed: false,
      priority: "medium",
      category: selectedSphere.id,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(), // ← ДОБАВЛЕНО: поле createdAt
    };

    onAddTask(newTask);
    setNewTaskTitle("");
  };

  const filteredTasks = selectedSphere
    ? tasks.filter((task) => task.category === selectedSphere.id)
    : [];

  return {
    tasks: filteredTasks,
    newTaskTitle,
    setNewTaskTitle,
    addTask,
    toggleTask: onToggleTask,
    deleteTask: onDeleteTask,
    canAddTask: !!selectedSphere,
  };
};
