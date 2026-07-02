import React, { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, Undo, Circle, Eraser, Download, Check, RefreshCw } from 'lucide-react';

interface SketchCanvasProps {
  onSaveSnapshot: (dataUrl: string) => void;
  savedDrawingUrl?: string;
}

const PALETTE_COLORS = [
  { name: 'Warm Charcoal', value: '#241a15' },
  { name: 'Coffee Brown', value: '#5c4033' },
  { name: 'Forest Green', value: '#2e4c3b' },
  { name: 'Muted Sage', value: '#7a8c7b' },
  { name: 'Rust Red', value: '#9c4125' },
  { name: 'Soft Orange', value: '#d97d4d' },
  { name: 'Sky Ink', value: '#3d617a' },
];

const STROKE_WIDTHS = [
  { name: 'Extra Fine', value: 2 },
  { name: 'Fine', value: 4 },
  { name: 'Medium', value: 8 },
  { name: 'Thick', value: 16 },
];

export default function SketchCanvas({ onSaveSnapshot, savedDrawingUrl }: SketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#241a15');
  const [currentWidth, setCurrentWidth] = useState(4);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [history, setHistory] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas high DPI size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill white background so export has white paper look instead of black/transparent
    ctx.fillStyle = '#faf6f0';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // If there is an existing saved sketch (or we're editing), load it onto canvas
    if (savedDrawingUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        // Save initial state to history
        setHistory([canvas.toDataURL('image/jpeg', 0.85)]);
      };
      img.src = savedDrawingUrl;
    } else {
      setHistory([canvas.toDataURL('image/jpeg', 0.85)]);
    }

    // Set drawing styles
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentWidth;

    // Handle canvas resize
    const handleResize = () => {
      // Keep a temporary image of current canvas
      const tempUrl = canvas.toDataURL();
      const newRect = canvas.getBoundingClientRect();
      
      canvas.width = newRect.width * 2;
      canvas.height = newRect.height * 2;
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.fillStyle = '#faf6f0';
      ctx.fillRect(0, 0, newRect.width, newRect.height);

      const tempImg = new Image();
      tempImg.onload = () => {
        ctx.drawImage(tempImg, 0, 0, newRect.width, newRect.height);
      };
      tempImg.src = tempUrl;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update stroke values on color/thickness change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = tool === 'eraser' ? '#faf6f0' : currentColor;
    ctx.lineWidth = currentWidth;
  }, [currentColor, currentWidth, tool]);

  // Drawing mouse handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check if touch event
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent scrolling when drawing on touch screens
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsSaved(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // Save state to undo history
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setHistory(prev => [...prev, dataUrl]);
  };

  // Undo drawing step
  const handleUndo = () => {
    if (history.length <= 1) return; // Keep the blank canvas state
    const newHistory = [...history];
    newHistory.pop(); // Remove current state
    const prevStateUrl = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#faf6f0';
    ctx.fillRect(0, 0, rect.width, rect.height);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = prevStateUrl;
    setIsSaved(false);
  };

  // Clear canvas
  const handleClear = () => {
    if (window.confirm('Clear your current masterpiece and start fresh?')) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = '#faf6f0';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const blankUrl = canvas.toDataURL('image/jpeg', 0.85);
      setHistory([blankUrl]);
      setIsSaved(false);
    }
  };

  // Finalize canvas capture, compress and trigger parent save
  const handleCapture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // To make sure file sizes are highly optimized for fast Firestore sync (especially in cell network/slower connections),
    // we create a smaller hidden canvas of exactly 600x600 size and compress it with high-quality JPEG compression.
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 600;
    exportCanvas.height = 600;
    const exportCtx = exportCanvas.getContext('2d');
    if (exportCtx) {
      exportCtx.fillStyle = '#faf6f0';
      exportCtx.fillRect(0, 0, 600, 600);
      exportCtx.drawImage(canvas, 0, 0, 600, 600);
      
      const compressedDataUrl = exportCanvas.toDataURL('image/jpeg', 0.82); // 82% quality yields beautiful crisp results under 50KB!
      onSaveSnapshot(compressedDataUrl);
      setIsSaved(true);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-4 w-full h-full relative">
      
      {/* Canvas Drawing area styled as a textured paper notebook sheet */}
      <div className="flex-grow w-full min-h-[300px] bg-[#faf6f0] border-2 border-[#eae4d5] rounded-3xl shadow-inner relative overflow-hidden group touch-none cursor-crosshair">
        
        {/* Subtle texture lines inside the active canvas area */}
        <div className="absolute inset-0 bg-[radial-gradient(#d5cebe_1px,transparent_1px)] [background-size:12px_12px] opacity-15 pointer-events-none" />
        
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full"
        />

        {/* Float overlay saved indicator */}
        {isSaved && (
          <div className="absolute top-3 right-3 bg-emerald-700/95 text-stone-100 text-xs font-serif font-medium px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
            <Check className="w-3.5 h-3.5" />
            <span>Sketch captured!</span>
          </div>
        )}
      </div>

      {/* Toolbar Area Styled cleanly like a classic desk drawer tray */}
      <div className="bg-[#fbf9f4] p-4 rounded-3xl border border-[#CBD5E1] flex flex-col gap-3 shadow-sm select-none">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Colors Selection */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-stone-600 tracking-wider">Ink:</span>
            <div className="flex items-center gap-1.5">
              {PALETTE_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setCurrentColor(c.value);
                    setTool('pen');
                  }}
                  className={`w-6 h-6 rounded-full border shadow-sm transition-transform cursor-pointer relative ${
                    tool === 'pen' && currentColor === c.value 
                      ? 'scale-115 border-stone-800 ring-2 ring-stone-800/25 ring-offset-1' 
                      : 'border-stone-400/40 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Tools Toggle (Pen / Eraser) */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setTool('pen')}
              className={`p-1.5 rounded-lg transition-all text-xs font-serif font-semibold cursor-pointer flex items-center gap-1 select-none ${
                tool === 'pen' 
                  ? 'bg-[#8daa91] text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-200/40'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Pen</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-1.5 rounded-lg transition-all text-xs font-serif font-semibold cursor-pointer flex items-center gap-1 select-none ${
                tool === 'eraser' 
                  ? 'bg-[#8daa91] text-white shadow-sm' 
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-200/40'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Eraser</span>
            </button>
          </div>
        </div>

        <hr className="border-stone-300/45" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Thickness selection */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono uppercase text-stone-600 tracking-wider">Nib:</span>
            <div className="flex gap-1.5">
              {STROKE_WIDTHS.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setCurrentWidth(w.value)}
                  className={`px-2.5 py-1 text-[10px] font-mono tracking-tighter rounded-lg border transition-all cursor-pointer ${
                    currentWidth === w.value
                      ? 'bg-[#8daa91] border-[#8daa91] text-white shadow-sm'
                      : 'border-stone-300 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Operations (Undo, Clear, Save) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1}
              className={`p-1.5 rounded-lg border border-stone-300 bg-white transition-all cursor-pointer ${
                history.length <= 1 
                  ? 'opacity-45 cursor-not-allowed text-stone-400' 
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900 active:scale-95'
              }`}
              title="Undo Sketch Line"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all cursor-pointer"
              title="Clear Notebook Sheet"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCapture}
              className="px-4 py-1.5 rounded-xl bg-[#8daa91] hover:bg-[#7ba180] text-white text-xs font-serif font-bold transition-all shadow-[2px_2px_0_rgba(141,170,145,0.25)] hover:shadow-none translate-y-[-1px] active:translate-y-0 cursor-pointer flex items-center gap-1.5 select-none"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Capture Drawing</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
