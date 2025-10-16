import { useEffect, useState } from "react";

export const useServiceWorker = () => {
  const [swStatus, setSwStatus] = useState<
    "loading" | "registered" | "error" | "unsupported"
  >("loading");

  useEffect(() => {
    // Проверяем поддержку Service Worker
    if (!("serviceWorker" in navigator)) {
      console.log("❌ Service Worker не поддерживается");
      setSwStatus("unsupported");
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        console.log("✅ Service Worker зарегистрирован:", registration);
        setSwStatus("registered");

        // Проверяем обновления Service Worker
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              console.log("🔄 Новый Service Worker:", newWorker.state);
            });
          }
        });
      } catch (error) {
        console.error("❌ Ошибка регистрации Service Worker:", error);
        setSwStatus("error");
      }
    };

    // Ждем полной загрузки страницы
    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW);
    }

    return () => {
      window.removeEventListener("load", registerSW);
    };
  }, []);

  return swStatus;
};
