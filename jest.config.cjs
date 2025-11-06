// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        // Добавляем обработку import.meta
        astTransformers: {
          before: [
            {
              path: "ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_APP_MODE: "development",
                    VITE_DEFAULT_ARCHITECTURE: "feature",
                    VITE_ENABLE_ARCH_SWITCHER: "true",
                    VITE_ENABLE_DEV_TOOLS: "true",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx)",
    "<rootDir>/src/**/?(*.)(spec|test).(ts|tsx)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  // Отключаем трансформацию node_modules (кроме нужных)
  transformIgnorePatterns: ["node_modules/(?!(ts-jest-mock-import-meta)/)"],
};
