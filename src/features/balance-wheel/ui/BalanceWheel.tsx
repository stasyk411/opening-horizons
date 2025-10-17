import React from "react";
import { LifeSphere } from "../../../shared/types";

interface BalanceWheelProps {
  spheres: LifeSphere[];
  onSphereChange: (sphereId: string, newValue: number) => void;
  onSphereSelect: (sphere: LifeSphere) => void;
}

export const BalanceWheel: React.FC<BalanceWheelProps> = ({
  spheres,
  onSphereChange,
  onSphereSelect,
}) => {
  // ИСПРАВЛЕНО: используем существующие поля
  const handleValueChange = (sphereId: string, value: number) => {
    onSphereChange(sphereId, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Колесо баланса</h2>
      <div className="grid grid-cols-2 gap-4">
        {spheres.map((sphere) => (
          <div
            key={sphere.id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => onSphereSelect(sphere)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{sphere.name}</span>
              <span className="text-lg font-bold">{sphere.value}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={sphere.value || 5}
              onChange={(e) =>
                handleValueChange(sphere.id, parseInt(e.target.value))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
