import React from "react";
import { useArchetypePlanning } from "../model/useArchetypePlanning";

export const ArchetypeSelector: React.FC = () => {
  const { archetype, setArchetype, archetypes } = useArchetypePlanning();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Выбери свой стиль дня</h2>
      <div className="space-y-3">
        {archetypes.map((type) => (
          <div
            key={type.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              archetype === type.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setArchetype(type.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{type.icon}</span>
              <div>
                <h3 className="font-semibold">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
