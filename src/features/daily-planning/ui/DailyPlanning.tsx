import React from "react";
import { LifeSphere, Task } from "../../../shared/types";
import { useDailyPlanning } from "../model/useDailyPlanning";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

interface DailyPlanningProps {
  selectedSphere: LifeSphere;
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void; // ← ИСПРАВЛЕНО: Omit<Task, "id">
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const DailyPlanning: React.FC<DailyPlanningProps> = ({
  selectedSphere,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const {
    tasks: filteredTasks,
    newTaskTitle,
    setNewTaskTitle,
    addTask,
    canAddTask,
  } = useDailyPlanning({
    selectedSphere,
    tasks,
    onAddTask,
    onToggleTask,
    onDeleteTask,
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Планирование: {selectedSphere.name}
        </h2>
        <div className="text-4xl mb-2">{selectedSphere.icon}</div>
        <p className="text-gray-600">
          Добавляйте задачи для развития этой сферы жизни
        </p>
      </div>

      <TaskForm
        newTaskTitle={newTaskTitle}
        onTitleChange={setNewTaskTitle}
        onAddTask={addTask}
        disabled={!canAddTask}
        selectedSphereName={selectedSphere.name}
      />

      <div>
        <h3 className="text-lg font-semibold mb-4">
          Задачи ({filteredTasks.filter((t) => !t.completed).length} активных)
        </h3>
        <TaskList
          tasks={filteredTasks}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </div>
  );
};
