import React from "react";
import {
  Home,
  Calendar,
  Target,
  Moon,
  Settings,
  Users,
  List,
} from "lucide-react";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: any) => void;
}

const NAV_ITEMS = [
  { id: "wheel", icon: Home, label: "Колесо" },
  { id: "planning", icon: Calendar, label: "Планирование" },
  { id: "tasks", icon: List, label: "Задачи" },
  { id: "goals", icon: Target, label: "Цели" },
  { id: "cove", icon: Users, label: "Бухта" }, // ✅ Простая иконка Users
  { id: "review", icon: Moon, label: "Анализ" }, // ✅ Moon для анализа
  { id: "settings", icon: Settings, label: "Настройки" },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onViewChange,
}) => {
  return (
    <nav className="fixed bottom-2 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mx-2 safe-area-bottom">
      <div className="flex space-x-0 p-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center p-2 md:p-3 rounded-xl transition-all duration-200 min-w-[50px] ${
                isActive
                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md"
                  : "text-gray-600 hover:text-purple-600 hover:bg-white/50"
              }`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-xs mt-1 font-medium leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
