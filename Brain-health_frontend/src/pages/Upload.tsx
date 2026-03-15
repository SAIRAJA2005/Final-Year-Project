import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileImage, FileType, ArrowRight, Info, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Upload = () => {
  const { selectedModel } = useApp();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMaskRCNN = selectedModel === "mask-rcnn";
  const accept = isMaskRCNN ? ".png" : ".png,.nii,.nii.gz";
  const mriType = isMaskRCNN ? "T1CE" : "FLAIR";

  const handleFile = useCallback((f: File) => {
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model_type", selectedModel || "unet");

      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.image) {
        navigate("/results", { 
          state: { 
            fileName: file.name,
            originalImage: preview,
            resultImage: data.image,
            details: data.details
          } 
        });
      } else {
        console.error("Backend error:", data.error);
        alert(data.error || "Failed to analyze image.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Could not connect to the backend server. Is it running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedModel) {
    navigate("/");
    return null;
  }

  return (
    <div className="container max-w-3xl py-10 sm:py-16 px-4">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold font-mono">
            {isMaskRCNN ? "Mask R-CNN" : "U-Net"}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground font-medium">{mriType} Sequence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Upload MRI Scan</h1>
      </motion.div>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-3 p-4 rounded-lg border border-info/30 bg-info/5 mb-8"
      >
        <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
        <div className="text-sm text-foreground/80 space-y-1">
          {isMaskRCNN ? (
            <>
              <p className="font-medium">Detection Mode — T1CE MRI</p>
              <p className="text-muted-foreground">Upload a <strong>PNG</strong> image of a T1CE MRI slice. The model will detect tumors with bounding boxes and confidence scores.</p>
            </>
          ) : (
            <>
              <p className="font-medium">Segmentation Mode — FLAIR MRI</p>
              <p className="text-muted-foreground">Upload a <strong>PNG</strong> or <strong>NIfTI (.nii, .nii.gz)</strong> file of a FLAIR MRI. The model will produce color-coded segmentation maps.</p>
            </>
          )}
        </div>
      </motion.div>

      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/5"
            : file
            ? "border-success/50 bg-success/5"
            : "border-border hover:border-primary/40 bg-card"
        }`}
        onClick={() => {
          if (!file) document.getElementById("file-input")?.click();
        }}
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {file ? (
          <div className="space-y-4">
            {preview ? (
              <img src={preview} alt="MRI Preview" className="max-h-64 mx-auto rounded-lg border border-border" />
            ) : (
              <div className="h-32 w-32 mx-auto rounded-lg bg-muted flex items-center justify-center">
                <FileType className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <FileImage className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-foreground">{file.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                className="ml-2 h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-14 w-14 mx-auto rounded-xl bg-muted flex items-center justify-center">
              <UploadIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Drop your MRI file here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse • {isMaskRCNN ? "PNG only" : "PNG, NIfTI (.nii, .nii.gz)"}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Analyze button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: file ? 1 : 0.3 }}
        className="flex justify-center mt-8"
      >
        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="group inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed medical-gradient text-primary-foreground hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Run {isMaskRCNN ? "Detection" : "Segmentation"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default Upload;
