import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Settings } from "../../types";

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("life-wheel-settings");
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      archetype: "",
      darkTheme: false,
      notifications: true,
      autoSave: true,
      colorScheme: "purple",
      pwaSettings: {
        offlineMode: true,
        pushNotifications: true,
      },
    };
  });

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem("life-wheel-settings", JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
