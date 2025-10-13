import React, { useState } from "react";
import { CreateGoalData } from "../../../shared/types/goals";

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
        .map((step, index) => ({
          title: step,
          order: index,
        })),
    };

    onSubmit(goalData);
  };

  const addStep = () => {
    setSteps((prev) => [...prev, ""]);
  };

  const updateStep = (index: number, value: string) => {
    setSteps((prev) => prev.map((step, i) => (i === index ? value : step)));
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-bold">Новая цель</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Название цели</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Например: Научиться играть на гитаре"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Описание цели..."
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Сфера жизни</label>
        <select
          value={sphere}
          onChange={(e) => setSphere(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="Развитие">Развитие</option>
          <option value="Работа">Работа</option>
          <option value="Здоровье">Здоровье</option>
          <option value="Отношения">Отношения</option>
          <option value="Финансы">Финансы</option>
          <option value="Хобби">Хобби</option>
        </select>
      </div>

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
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
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
