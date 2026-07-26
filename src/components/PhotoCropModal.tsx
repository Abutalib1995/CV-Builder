import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, ZoomIn, ZoomOut, RotateCw, Move, Check, Image as ImageIcon, 
  Sparkles, RefreshCw, SlidersHorizontal, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';

interface PhotoCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImageBase64: string) => void;
}

export default function PhotoCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete
}: PhotoCropModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0); // -100 to 100 percentage shift
  const [offsetY, setOffsetY] = useState<number>(0); // -100 to 100 percentage shift
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset parameters when a new image is loaded
  useEffect(() => {
    if (imageSrc) {
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setRotation(0);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imgRef.current = img;
        drawCanvas();
      };
    }
  }, [imageSrc]);

  // Re-draw canvas whenever zoom, offset, or rotation changes
  useEffect(() => {
    if (imgRef.current) {
      drawCanvas();
    }
  }, [zoom, offsetX, offsetY, rotation]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 400; // Output high-res 400x400 square for CV
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Save current context transform
    ctx.save();

    // Move to center of canvas for rotation and zooming
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate aspect fill sizing
    const imgAspect = img.width / img.height;
    let drawWidth = size;
    let drawHeight = size;

    if (imgAspect > 1) {
      // Landscape image
      drawWidth = size * imgAspect;
      drawHeight = size;
    } else {
      // Portrait image
      drawWidth = size;
      drawHeight = size / imgAspect;
    }

    // Apply manual user panning offsets (scaled to size)
    const shiftX = (offsetX / 100) * (drawWidth / 2);
    const shiftY = (offsetY / 100) * (drawHeight / 2);

    ctx.drawImage(
      img,
      -drawWidth / 2 + shiftX,
      -drawHeight / 2 + shiftY,
      drawWidth,
      drawHeight
    );

    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setOffsetX((prev) => Math.min(100, Math.max(-100, prev + dx * 0.4)));
    setOffsetY((prev) => Math.min(100, Math.max(-100, prev + dy * 0.4)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                ছবি পজিশন ও সাইজ ঠিক করুন (Photo Adjustment)
              </h3>
              <p className="text-[11px] text-slate-500">
                ছবি ড্র্যাগ বা স্লাইডার দিয়ে মাথা/পজিশন সঠিকভাবে এডজাস্ট করুন
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Canvas Interactive Viewport */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative group select-none">
              <div 
                className="relative border-4 border-indigo-600/30 rounded-2xl overflow-hidden bg-slate-900 shadow-inner cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <canvas 
                  ref={canvasRef} 
                  className="w-64 h-64 md:w-72 md:h-72 object-contain"
                />

                {/* Circular Crop Guide Overlay */}
                <div className="absolute inset-0 border-[32px] border-slate-900/60 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 shadow-xs" />
                </div>
              </div>

              <div className="absolute -bottom-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1 rounded-full pointer-events-none shadow-md">
                মাউস/টাচ দিয়ে ড্র্যাগ করুন
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
            
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <ZoomIn className="w-4 h-4" />
                  জুম করুন (Zoom)
                </span>
                <span className="font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setZoom(prev => Math.max(0.8, prev - 0.1))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input 
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <button 
                  onClick={() => setZoom(prev => Math.min(2.5, prev + 0.1))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Vertical Shift (Fix Head Cut Off) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-purple-700">
                  <ArrowUp className="w-4 h-4" />
                  উপরে/নিচে নামান (Fix Head Cut-Off)
                </span>
                <span className="font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {Math.round(offsetY)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setOffsetY(prev => Math.min(100, prev + 5))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  title="নিচে নামান (নিচের দিকে আনুন)"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <input 
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={offsetY}
                  onChange={(e) => setOffsetY(parseFloat(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <button 
                  onClick={() => setOffsetY(prev => Math.max(-100, prev - 5))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                  title="উপরে তুলুন"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Shift */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <ArrowLeft className="w-4 h-4" />
                  ডানে/বামে সরান (Horizontal Position)
                </span>
                <span className="font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {Math.round(offsetX)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setOffsetX(prev => Math.max(-100, prev - 5))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <input 
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={offsetX}
                  onChange={(e) => setOffsetX(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <button 
                  onClick={() => setOffsetX(prev => Math.min(100, prev + 5))}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions (Rotate & Reset) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <button 
                type="button"
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 py-1.5 px-3 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>ঘোরান ( Rotate )</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setZoom(1);
                  setOffsetX(0);
                  setOffsetY(0);
                  setRotation(0);
                }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-bold py-1.5 px-3 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>রিসেট করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            বাতিল
          </button>

          <button
            onClick={handleApplyCrop}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>ছবিটি সেট করুন (Apply Photo)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
