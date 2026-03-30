import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScanSearch, Layers, ArrowRight } from "lucide-react";
import ModelCard from "@/components/ModelCard";
import { useApp, type ModelType } from "@/contexts/AppContext";

const ModelSelection = () => {
  const { selectedModel, setSelectedModel } = useApp();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedModel) navigate("/upload");
  };

  return (
    <div className="container max-w-4xl py-10 sm:py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 sm:mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
          A Deep Learning Approach for Brain Tumor Detection and Segmentation
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
          Brain Tumor Detection
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          Select a deep learning model to analyze MRI brain scans for tumor detection and segmentation.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mb-10">
        <ModelCard
          title="Mask R-CNN"
          subtitle="Instance Detection"
          description="Detect and localize brain tumors with bounding boxes and instance masks on T1CE MRI sequences."
          icon={<ScanSearch className="h-6 w-6" />}
          features={["Bounding box detection", "Instance mask overlay", "Confidence scoring", "T1CE MRI input (PNG)"]}
          selected={selectedModel === "mask-rcnn"}
          onSelect={() => setSelectedModel("mask-rcnn" as ModelType)}
          delay={0.1}
        />
        <ModelCard
          title="U-Net"
          subtitle="Semantic Segmentation"
          description="Perform pixel-wise segmentation of tumor sub-regions on FLAIR MRI sequences with color-coded overlays."
          icon={<Layers className="h-6 w-6" />}
          features={["Full tumor (Blue)", "Tumor core (Yellow)", "Enhancing tumor (Red)", "FLAIR MRI input (NIfTI/PNG)"]}
          selected={selectedModel === "unet"}
          onSelect={() => setSelectedModel("unet" as ModelType)}
          delay={0.2}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedModel ? 1 : 0.3 }}
        className="flex justify-center"
      >
        <button
          onClick={handleContinue}
          disabled={!selectedModel}
          className="group inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed medical-gradient text-primary-foreground hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
        >
          Continue to Upload
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </div>
  );
};

export default ModelSelection;
