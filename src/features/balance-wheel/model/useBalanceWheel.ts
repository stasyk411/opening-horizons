import { useState } from "react";
import { LifeSphere, LifeSphereConfig } from "../../../shared/types";
import { SPHERE_CONFIGS } from "../../../shared/lib/sphere-configs";

export const useBalanceWheel = () => {
  const [spheres, setSpheres] = useState<LifeSphereConfig[]>(SPHERE_CONFIGS);

  const updateSphereValue = (sphereId: LifeSphere, newValue: number) => {
    setSpheres((prevSpheres) =>
      prevSpheres.map((sphere) =>
        sphere.id === sphereId ? { ...sphere, value: newValue } : sphere
      )
    );
  };

  const getSphereById = (sphereId: LifeSphere) => {
    return spheres.find((sphere) => sphere.id === sphereId);
  };

  const resetSpheres = () => {
    setSpheres(SPHERE_CONFIGS);
  };

  const getTotalScore = () => {
    return spheres.reduce((total, sphere) => total + (sphere.value || 0), 0);
  };

  const getAverageScore = () => {
    return Math.round(getTotalScore() / spheres.length);
  };

  return {
    spheres,
    updateSphereValue,
    getSphereById,
    resetSpheres,
    getTotalScore,
    getAverageScore,
  };
};
