import React from 'react';
import {
  QrCode,
  ShieldCheck,
  Download,
  LayoutTemplate,
  X,
  Keyboard
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground border-t sm:border border-border rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl max-h-[88vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-250 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="sm:hidden w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto -mt-1 mb-2" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-foreground text-background flex items-center justify-center shadow-xs">
              <QrCode size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">About ZashQr</h2>
              <p className="text-[11px] text-muted-foreground">Version 2.0 • Pro QR Generator & Design Studio</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          ZashQr is a fast, privacy-first client-side studio for generating custom QR codes and designing printable marketing materials, posters, business cards, flyers, and social media posts.
        </p>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <QrCode size={14} className="text-blue-500" />
              <span>QR Code Generator</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Generate custom codes for URLs, WiFi, emails, phones, and raw text.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <LayoutTemplate size={14} className="text-purple-500" />
              <span>100+ QR Templates</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              100+ ready-to-edit templates across 28 categories with visual drag-and-drop.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>100% Client Privacy</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              No data leaves your device. All rendering and exports happen locally in your browser.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/60 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Download size={14} className="text-amber-500" />
              <span>Multi-Format Exports</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Download crisp High-Res PNG (300 DPI), Print-Ready PDF, JPG, and SVG vectors.
            </p>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="p-2.5 rounded-xl border border-border bg-muted/20 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Keyboard size={13} className="text-primary" />
            <span>Editor Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <div><kbd className="px-1 py-0.2 rounded bg-muted border font-mono text-[9px]">Ctrl+Z</kbd> Undo</div>
            <div><kbd className="px-1 py-0.2 rounded bg-muted border font-mono text-[9px]">Ctrl+Y</kbd> Redo</div>
            <div><kbd className="px-1 py-0.2 rounded bg-muted border font-mono text-[9px]">Ctrl+D</kbd> Duplicate</div>
            <div><kbd className="px-1 py-0.2 rounded bg-muted border font-mono text-[9px]">Del</kbd> Delete</div>
            <div><kbd className="px-1 py-0.2 rounded bg-muted border font-mono text-[9px]">Arrows</kbd> Move 1px / 10px</div>
            <div><kbd className="px-1 py-0.2 rounded bg-muted border font-mono text-[9px]">Esc</kbd> Deselect</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
          <span>Co-powered by <strong className="text-foreground">Zashly</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 sm:py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:opacity-90 transition-opacity cursor-pointer touch-btn"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
