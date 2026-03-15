import { Brain, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useApp } from "@/contexts/AppContext";

const Header = () => {
  const { selectedModel, resetState } = useApp();
  const navigate = useNavigate();

  const handleReset = () => {
    resetState();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 glass">
      <div className="container flex h-16 items-center justify-between">
        <button onClick={handleReset} className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-lg medical-gradient flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground leading-none">Brain Tumour Detection</span>
            <span className="text-[10px] font-medium text-muted-foreground leading-none mt-0.5">Brain Tumor Detection</span>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {selectedModel && (
            <button
              onClick={handleReset}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border hover:border-primary/30"
            >
              <RotateCcw className="h-3 w-3" />
              New Analysis
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
