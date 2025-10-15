import React from "react";
import { LifeSphereConfig, LifeSphere } from "../../../shared/types";

interface BalanceWheelProps {
  spheres: LifeSphereConfig[];
  onSphereChange: (sphereId: string, newValue: number) => void;
  onSphereSelect: (sphere: LifeSphere) => void;
}

export const BalanceWheel: React.FC<BalanceWheelProps> = ({
  spheres,
  onSphereChange,
  onSphereSelect,
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Колесо баланса жизни
      </h2>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {spheres.map((sphere) => (
          <div
            key={sphere.id}
            className="p-4 rounded-lg border-2 text-center"
            style={{ borderColor: sphere.color }}
          >
            <div className="text-2xl mb-2">{sphere.icon}</div>
            <h3 className="font-semibold mb-2">{sphere.name}</h3>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <button
                onClick={() =>
                  onSphereChange(
                    sphere.id,
                    Math.max(0, (sphere.value || 0) - 1)
                  )
                }
                className="w-8 h-8 bg-gray-200 rounded-full"
              >
                -
              </button>
              <span className="text-xl font-bold">{sphere.value || 0}/10</span>
              <button
                onClick={() =>
                  onSphereChange(
                    sphere.id,
                    Math.min(10, (sphere.value || 0) + 1)
                  )
                }
                className="w-8 h-8 bg-gray-200 rounded-full"
              >
                +
              </button>
            </div>
            <button
              onClick={() => onSphereSelect(sphere.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              Выбрать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
