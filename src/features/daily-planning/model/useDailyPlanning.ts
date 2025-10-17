import { useState } from "react";
import { Task, LifeSphere } from "../../../shared/types";
import { generateId } from "../../../shared/lib/id-generator";

interface UseDailyPlanningProps {
  selectedSphere: LifeSphere | null;
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
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

    const newTaskData = {
      title: newTaskTitle,
      description: "",
      completed: false,
      sphere: selectedSphere.id,
      category: selectedSphere.id,
      priority: "medium" as const,
      userId: "demo-user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAddTask(newTaskData);
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
