import { useState, useEffect } from "react";
import { Archetype, UserArchetype } from "../../../shared/types/archetypes";
import { ARCHETYPES } from "../../../shared/lib/archetype-configs";

export const useArchetypePlanning = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(
    null
  );
  const [userArchetype, setUserArchetype] = useState<UserArchetype | null>(
    null
  );

  // Загрузка выбранного архетипа из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userArchetype");
    if (saved) {
      try {
        const archetypeData = JSON.parse(saved) as UserArchetype;
        setUserArchetype(archetypeData);
        setSelectedArchetype(archetypeData.type);
      } catch (error) {
        console.error("Error parsing saved archetype:", error);
      }
    }
  }, []);

  // Выбор архетипа
  const selectArchetype = (archetype: Archetype) => {
    const userArchetypeData: UserArchetype = {
      type: archetype,
      selectedAt: new Date(),
    };

    setSelectedArchetype(archetype);
    setUserArchetype(userArchetypeData);
    localStorage.setItem("userArchetype", JSON.stringify(userArchetypeData));
  };

  // Сброс выбора
  const resetArchetype = () => {
    setSelectedArchetype(null);
    setUserArchetype(null);
    localStorage.removeItem("userArchetype");
  };

  // Получение конфигурации текущего архетипа
  const getCurrentArchetypeConfig = () => {
    if (!selectedArchetype) return null;
    return ARCHETYPES[selectedArchetype];
  };

  return {
    selectedArchetype,
    userArchetype,
    selectArchetype,
    resetArchetype,
    getCurrentArchetypeConfig,
    archetypesConfig: ARCHETYPES,
  };
};
