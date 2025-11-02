// Service Worker для Opening Horizons
const CACHE_NAME = "opening-horizons-v1.0";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Установка Service Worker
self.addEventListener("install", (event) => {
  console.log("🛠️ Service Worker: Установлен");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Кэшируем основные ресурсы");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("❌ Ошибка кэширования:", error);
      })
  );
});

// Активация - очистка старых кэшей
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker: Активирован");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Удаляем старый кэш:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват сетевых запросов
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Возвращаем кэш если есть, иначе сетевой запрос
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback для оффлайн режима
        return new Response("🔄 Оффлайн режим");
      })
  );
});

console.log("📱 Service Worker загружен и готов к работе");
