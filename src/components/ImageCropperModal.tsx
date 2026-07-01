import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ZoomIn, RotateCw, Check, X, Move } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedBase64: string) => void;
  onClose: () => void;
}

export default function ImageCropperModal({ imageSrc, onCropComplete, onClose }: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // in degrees: 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset adjustments when image source changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  }, [imageSrc]);

  // Touch and mouse event handlers for panning the image inside the crop frame
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStart.current = { x: clientX - offset.x, y: clientY - offset.y };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setOffset({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // 90-degree rotations
  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Perform canvas-based crop, rotation, scale, and compression
  const handleCrop = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Define fixed high-quality square dimension for the output sketch
    const size = 800;
    canvas.width = size;
    canvas.height = size;

    // Background color is clean white for paper sketches
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    // Move origin to the center of the output canvas
    ctx.translate(size / 2, size / 2);
    // Apply user selected rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate dimensions of image inside crop box
    // Find scale ratio of actual image vs viewport display
    const cropFrameSize = 280; // matches display box in UI
    const scaleFactor = (img.naturalWidth / img.width);

    // Draw the source image with offset, zoom and rotation centered
    const drawWidth = img.naturalWidth * zoom;
    const drawHeight = img.naturalHeight * zoom;

    // Map offset from screen coordinates to native image pixels
    const nativeOffsetX = offset.x * scaleFactor;
    const nativeOffsetY = offset.y * scaleFactor;

    ctx.drawImage(
      img,
      -drawWidth / 2 + nativeOffsetX,
      -drawHeight / 2 + nativeOffsetY,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // Compress to 85% JPEG
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onCropComplete(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-50 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        id="image-cropper-card"
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-slate-800 text-sm">Crop & Adjust Sketch</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">Prepare paper drawing</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CROP WORKSPACE CONTAINER */}
        <div 
          ref={containerRef}
          className="relative bg-slate-900 w-full h-[320px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => {
            if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handleEnd}
        >
          {/* Active Image with CSS transform for previews */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Source"
            className="max-w-none pointer-events-none transition-transform duration-75 select-none"
            style={{
              width: '280px',
              height: 'auto',
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            }}
            referrerPolicy="no-referrer"
          />

          {/* Visual Crop Box Mask Overlay (High transparency around edges, sharp crop square) */}
          <div className="absolute inset-0 border-[20px] border-slate-950/70 pointer-events-none flex items-center justify-center">
            <div 
              className="w-[280px] h-[280px] border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(15,23,42,0.4)] relative"
            >
              {/* Guides */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Move className="w-6 h-6 text-white" />
              </div>
              <div className="absolute top-2 left-2 text-[9px] font-mono text-white/80 bg-black/40 px-1 py-0.5 rounded">
                CROP AREA
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="p-5 bg-slate-50 space-y-4">
          
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-2xs font-mono text-slate-500">
              <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> Scale</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#8E94F2]"
            />
          </div>

          {/* Buttons to Rotate & Reset */}
          <div className="flex gap-2.5">
            <button
              onClick={rotateImage}
              className="flex-1 py-2 px-3 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-2xs font-serif font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate 90°</span>
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setOffset({ x: 0, y: 0 });
                setRotation(0);
              }}
              className="py-2 px-4 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-2xs font-serif font-bold text-slate-500 cursor-pointer shadow-xs"
            >
              Reset
            </button>
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 border-t border-slate-200 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-serif font-bold text-xs rounded-xl cursor-pointer shadow-xs text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              className="flex-1 py-2.5 bg-[#8E94F2] text-white hover:bg-[#8E94F2]/95 font-serif font-bold text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Crop & Apply</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
