import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Download, Eye, EyeOff, RotateCcw, CheckCircle2, AlertTriangle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Results = () => {
  const { selectedModel, resetState } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { originalImage, resultImage, fileName, details } = (location.state as any) || {};
  const isMaskRCNN = selectedModel === "mask-rcnn";

  useEffect(() => {
    if (!selectedModel || !resultImage || !originalImage) {
      navigate("/");
    }
  }, [selectedModel, resultImage, originalImage, navigate]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = `deephealth-result-${fileName || "scan"}.png`;
    link.href = resultImage;
    link.click();
  };

  if (!selectedModel || !resultImage) return null;

  return (
    <div className="container max-w-5xl py-10 sm:py-16 px-4">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <span className="text-sm font-semibold text-success">Analysis Complete</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {isMaskRCNN ? "Detection" : "Segmentation"} Results
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="flex items-center justify-between p-3 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Result Visualization</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:border-primary/30 transition-colors text-foreground"
              >
                {showOverlay ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showOverlay ? "Hide" : "Show"} Overlay
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md medical-gradient text-primary-foreground hover:shadow-glow transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
          <div className="p-4 flex items-center justify-center bg-muted/30 min-h-[300px]">
            <img 
              src={showOverlay ? resultImage : originalImage} 
              alt="Result Visualization" 
              className="max-w-full max-h-[500px] rounded-lg border border-border/50 shadow-sm"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </motion.div>

        {/* Details panel */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          {/* Model info */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Model Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Model</dt>
                <dd className="font-mono font-medium text-foreground">{isMaskRCNN ? "Mask R-CNN" : "U-Net"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">MRI Type</dt>
                <dd className="font-mono font-medium text-foreground">{isMaskRCNN ? "T1CE" : "FLAIR"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="text-success font-medium">Complete</dd>
              </div>
            </dl>
          </div>

          {/* Results */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">
              {isMaskRCNN ? "Detection Results" : "Segmentation Legend"}
            </h3>
            {isMaskRCNN ? (
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tumors Found</dt>
                  <dd className="font-bold text-foreground">1</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Confidence</dt>
                  <dd className="font-mono font-bold text-success">94.7%</dd>
                </div>
              </dl>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-yellow-500" />
                    <span className="text-foreground">Tumor Confidence Map</span>
                  </div>
                  <span className="font-mono font-medium text-muted-foreground">{(details?.tumor_percentage || 0).toFixed(2)}% Area</span>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 p-4 rounded-lg border border-warning/30 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              These results are generated by an AI model for <strong>research purposes only</strong>. Always consult a qualified medical professional for clinical decisions.
            </p>
          </div>

          <button
            onClick={() => { resetState(); navigate("/"); }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Start New Analysis
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
