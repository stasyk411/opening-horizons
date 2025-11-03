import React, { useState } from "react";
import { CreateGoalData } from "../../../shared/types";

interface GoalFormProps {
  onSubmit: (goalData: CreateGoalData) => void;
  onCancel: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sphere, setSphere] = useState("Развитие");
  const [steps, setSteps] = useState([""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goalData: CreateGoalData = {
      title,
      description,
      sphere,
      steps: steps
        .filter((step) => step.trim() !== "")
        .map((step) => ({
          title: step,
          deadline: undefined,
        })),
    };

    onSubmit(goalData);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold">Новая цель</h3>

      {/* Название цели */}
      <div>
        <label htmlFor="goal-title" className="block text-sm font-medium mb-1">
          Название цели
        </label>
        <input
          type="text"
          id="goal-title"
          name="goalTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Введите название цели"
          required
        />
      </div>

      {/* Описание */}
      <div>
        <label
          htmlFor="goal-description"
          className="block text-sm font-medium mb-1"
        >
          Описание
        </label>
        <textarea
          id="goal-description"
          name="goalDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Описание цели (необязательно)"
          rows={3}
        />
      </div>

      {/* Сфера жизни */}
      <div>
        <label htmlFor="goal-sphere" className="block text-sm font-medium mb-1">
          Сфера жизни
        </label>
        <select
          id="goal-sphere"
          name="goalSphere"
          value={sphere}
          onChange={(e) => setSphere(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="Развитие">Развитие</option>
          <option value="Карьера">Карьера</option>
          <option value="Здоровье">Здоровье</option>
          <option value="Отношения">Отношения</option>
          <option value="Финансы">Финансы</option>
          <option value="Хобби">Хобби</option>
        </select>
      </div>

      {/* Шаги к цели */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Шаги к цели</label>
          <button
            type="button"
            onClick={addStep}
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
          >
            + Добавить шаг
          </button>
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                id={`goal-step-${index}`}
                name={`goalStep${index}`}
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder={`Шаг ${index + 1}`}
              />
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="px-3 text-red-500 border border-red-500 rounded-lg"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium"
        >
          Создать цель
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 py-2 rounded-lg font-medium"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};
