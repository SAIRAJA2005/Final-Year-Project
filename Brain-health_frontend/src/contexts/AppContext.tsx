import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type ModelType = "mask-rcnn" | "unet" | null;

interface AppState {
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  resetState: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState<ModelType>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("deephealth-theme");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("deephealth-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const resetState = () => setSelectedModel(null);

  return (
    <AppContext.Provider value={{ selectedModel, setSelectedModel, theme, toggleTheme, resetState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
