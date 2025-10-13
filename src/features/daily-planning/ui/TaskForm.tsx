import React from "react";

interface TaskFormProps {
  newTaskTitle: string;
  onTitleChange: (title: string) => void;
  onAddTask: () => void;
  disabled?: boolean;
  selectedSphereName?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  newTaskTitle,
  onTitleChange,
  onAddTask,
  disabled = false,
  selectedSphereName = "",
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={
            selectedSphereName
              ? `Добавить задачу для ${selectedSphereName}`
              : "Выберите сферу жизни сначала"
          }
          disabled={disabled}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={disabled || !newTaskTitle.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Добавить
        </button>
      </div>
    </form>
  );
};
