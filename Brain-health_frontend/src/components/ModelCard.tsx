import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface ModelCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  features: string[];
  selected: boolean;
  onSelect: () => void;
  delay?: number;
}

const ModelCard = ({ title, subtitle, description, icon, features, selected, onSelect, delay = 0 }: ModelCardProps) => (
  <motion.button
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    onClick={onSelect}
    className={`relative group w-full text-left rounded-xl border-2 p-6 sm:p-8 transition-all duration-300 ${
      selected
        ? "border-primary bg-primary/5 shadow-glow"
        : "border-border bg-card hover:border-primary/40 hover:shadow-medical"
    }`}
  >
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-4 right-4 h-7 w-7 rounded-full medical-gradient flex items-center justify-center"
      >
        <Check className="h-4 w-4 text-primary-foreground" />
      </motion.div>
    )}

    <div className="flex items-start gap-4 mb-4">
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
        selected ? "medical-gradient" : "bg-muted group-hover:bg-primary/10"
      }`}>
        <div className={selected ? "text-primary-foreground" : "text-primary"}>{icon}</div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-xs font-mono font-medium text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>

    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

    <ul className="space-y-2">
      {features.map((f) => (
        <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
          <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
          {f}
        </li>
      ))}
    </ul>
  </motion.button>
);

export default ModelCard;
