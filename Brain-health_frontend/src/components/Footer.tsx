import { ShieldAlert } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldAlert className="h-4 w-4 text-warning" />
        <span className="font-medium">Research Use Only</span>
        <span className="hidden sm:inline">— Not for clinical diagnosis</span>
      </div>
      <p className="text-xs text-muted-foreground">
        © 2026 DeepHealth. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
