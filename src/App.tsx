import React, { useState, useEffect } from "react";
import { InteractiveWheel } from "./widgets/InteractiveWheel/InteractiveWheel";
import { DailyPlanning } from "./features/DailyPlanning/DailyPlanning";
import { TodayTasks } from "./features/TodayTasks/TodayTasks";
import { EveningReview } from "./features/EveningReview/EveningReview";
import { Navigation } from "./widgets/Navigation/Navigation";
import { LifeSphere } from "./shared/types";
import { dataManager } from "./shared/lib/data-manager";

type ActiveView =
  | "wheel"
  | "planning"
  | "tasks"
  | "review"
  | "goals"
  | "cove"
  | "settings";

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>("wheel");
  const [selectedSphere, setSelectedSphere] = useState<LifeSphere>("health");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await dataManager.init();
      setIsInitialized(true);
    };
    initializeApp();
  }, []);

  const handleSphereSelect = (sphere: LifeSphere) => {
    setSelectedSphere(sphere);
    setActiveView("planning");
  };

  const renderActiveView = () => {
    if (!isInitialized) {
      return (
        <div className="flex items-center justify-center min-h-[40vh] py-4">
          <div className="text-white text-base">Загрузка...</div>
        </div>
      );
    }

    switch (activeView) {
      case "wheel":
        return <InteractiveWheel onSphereSelect={handleSphereSelect} />;
      case "planning":
        return <DailyPlanning selectedSphere={selectedSphere} />;
      case "tasks":
        return <TodayTasks />;
      case "review":
        return <EveningReview />;
      default:
        return (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg mx-2 md:mx-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
              {activeView === "goals" && "Цели"}
              {activeView === "cove" && "Бухта отдыха"}
              {activeView === "settings" && "Настройки"}
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Раздел в разработке
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-main-gradient safe-area">
      {/* Safe area для современных мобильных устройств */}
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4 min-h-screen flex flex-col">
        {/* Адаптивный заголовок */}
        <header className="text-center mb-3 md:mb-6 flex-shrink-0">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2 px-2">
            Opening Horizons
          </h1>
          <p className="text-white/80 text-xs md:text-sm lg:text-base px-2">
            Твой друг-коуч для осознанного управления временем
          </p>
        </header>

        {/* Основной контент с адаптивными отступами */}
        <main className="flex-1 w-full max-w-full md:max-w-4xl mx-auto px-1 md:px-2">
          {renderActiveView()}
        </main>

        {/* Навигация с адаптацией под мобильные */}
        <div className="flex-shrink-0 mt-4 md:mt-6">
          <Navigation activeView={activeView} onViewChange={setActiveView} />
        </div>
      </div>
    </div>
  );
};

export default App;
