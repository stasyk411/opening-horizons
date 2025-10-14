import React, { useState } from "react";
import { Archetype, ARCHETYPES } from "../../../shared/types";

interface ArchetypeSelectorProps {
  onArchetypeSelect: (archetype: Archetype) => void;
}

export const ArchetypeSelector: React.FC<ArchetypeSelectorProps> = ({
  onArchetypeSelect,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(
    null
  );

  const handleArchetypeSelect = (archetype: Archetype) => {
    setSelectedArchetype(archetype);
  };

  const handleConfirm = () => {
    if (selectedArchetype) {
      onArchetypeSelect(selectedArchetype);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Доброе утро!
          </h1>
          <p className="text-gray-600">Как вы себя чувствуете сегодня?</p>
        </div>

        {/* Выбор архетипа */}
        <div className="space-y-4 mb-8">
          {Object.entries(ARCHETYPES).map(([key, archetype]) => (
            <button
              key={key}
              onClick={() => handleArchetypeSelect(key as Archetype)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedArchetype === key
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{archetype.emoji}</span>
                <div className="text-left flex-1">
                  <div className="font-semibold text-gray-800">
                    {archetype.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {archetype.description}
                  </div>
                </div>
                {selectedArchetype === key && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Рекомендации при выборе */}
        {selectedArchetype && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Рекомендации на сегодня:
              </h3>
              <div className="space-y-2 text-sm">
                {Object.values(ARCHETYPES[selectedArchetype].energyWindows).map(
                  (window, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{window}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-sm"
            >
              Начать планирование →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
