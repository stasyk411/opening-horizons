// Environment Variables Types
interface ImportMetaEnv {
  readonly VITE_APP_MODE: "development" | "production";
  readonly VITE_DEFAULT_ARCHITECTURE: "feature" | "react" | "minimalist";
  readonly VITE_ENABLE_ARCH_SWITCHER: string;
  readonly VITE_ENABLE_DEV_TOOLS: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
