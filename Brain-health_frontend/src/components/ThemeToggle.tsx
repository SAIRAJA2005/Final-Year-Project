import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-lg border border-border bg-card flex items-center justify-center transition-all duration-300 hover:shadow-glow hover:border-primary/40"
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-warning" />
        ) : (
          <Moon className="h-5 w-5 text-primary" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
