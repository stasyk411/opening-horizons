// types/window.d.ts
declare global {
  interface Window {
    unifiedDataManager: {
      dataHandlers: Map<string, any>;
      queueSync: () => void;
      syncData: () => Promise<void>;
      currentArchitecture: string;
    };
  }
}

export {};
