import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, LogOut, Check, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colorMap = {
    danger: {
      accent: 'bg-red-50 text-red-600 border-red-200',
      button: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/10',
      icon: Trash2
    },
    warning: {
      accent: 'bg-amber-50 text-amber-600 border-amber-200',
      button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/10',
      icon: AlertTriangle
    },
    info: {
      accent: 'bg-slate-50 text-slate-600 border-slate-200',
      button: 'bg-[#8E94F2] hover:bg-[#8E94F2]/90 text-white shadow-md shadow-indigo-500/10',
      icon: LogOut
    }
  };

  const currentTheme = colorMap[type];
  const IconComponent = currentTheme.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 relative"
          id="custom-confirm-card"
        >
          {/* Deckled Edge/Stitch decoration */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-200 via-indigo-200 to-emerald-200" />
          <div className="absolute top-3 right-3 text-[9px] font-mono text-slate-300 select-none">INKLINK VAULT</div>

          {/* Icon Header */}
          <div className="flex items-start gap-4 mt-1">
            <div className={`p-2.5 rounded-xl border ${currentTheme.accent} flex-shrink-0`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-black text-[#2D3748] text-sm leading-tight">
                {title}
              </h3>
              <p className="text-2xs font-serif text-[#64748B] leading-relaxed italic">
                {message}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="flex-1 py-2 text-2xs font-serif font-bold text-[#64748B] hover:text-[#2D3748] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors text-center select-none flex items-center justify-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{cancelLabel}</span>
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2 text-2xs font-serif font-bold rounded-lg cursor-pointer transition-colors text-center select-none flex items-center justify-center gap-1 ${currentTheme.button}`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{confirmLabel}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
