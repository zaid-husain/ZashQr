import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Copy,
  ChevronDown,
  Check,
  Bookmark,
  FileText,
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import type { TemplateDocument } from '../../types/template';
import {
  exportTemplateAsPNG,
  exportTemplateAsJPG,
  exportTemplateAsPDF,
  downloadTemplateSVG,
  copyTemplateImageToClipboard
} from '../../utils/template-render';
import { cn } from '../../utils/cn';

interface EditorHeaderProps {
  document: TemplateDocument;
  isSaved: boolean;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onBack: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onSetZoom: (zoom: number) => void;
  onUpdateTitle: (title: string) => void;
  onSaveAsMyTemplate: () => void;
  showToast: (msg: string) => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  document,
  isSaved,
  canUndo,
  canRedo,
  zoom,
  onBack,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onSetZoom,
  onUpdateTitle,
  onSaveAsMyTemplate,
  showToast
}) => {
  const [exportOpen, setExportOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const zoomMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(e.target as Node)) {
        setZoomOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format: 'png-high' | 'png' | 'jpg' | 'svg' | 'pdf') => {
    setExportOpen(false);
    setIsExporting(true);
    try {
      if (format === 'png-high') {
        await exportTemplateAsPNG(document, 3, document.name);
        showToast('High-Resolution PNG downloaded');
      } else if (format === 'png') {
        await exportTemplateAsPNG(document, 1.5, document.name);
        showToast('Standard PNG downloaded');
      } else if (format === 'jpg') {
        await exportTemplateAsJPG(document, 0.95, 2, document.name);
        showToast('JPG image downloaded');
      } else if (format === 'svg') {
        downloadTemplateSVG(document, document.name);
        showToast('SVG vector downloaded');
      } else if (format === 'pdf') {
        await exportTemplateAsPDF(document, document.name);
        showToast('Print-Ready PDF downloaded');
      }
    } catch (e) {
      console.error(e);
      showToast('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyClipboard = async () => {
    const success = await copyTemplateImageToClipboard(document);
    if (success) {
      setCopied(true);
      showToast('Template copied to clipboard as PNG');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Copy failed (check browser permissions)');
    }
  };

  const zoomPercentages = [50, 75, 100, 125, 150, 200];

  return (
    <header className="h-14 border-b border-border/80 bg-background/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-2 z-30 sticky top-0">
      {/* Left section: Back button & Document title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-border/80 hover:bg-muted text-xs font-medium flex items-center gap-1.5 text-foreground transition-colors shrink-0"
          title="Back to Templates"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Templates</span>
        </button>

        <div className="h-4 w-px bg-border/80 hidden sm:block shrink-0" />

        {/* Title Input & Save status */}
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={document.name}
            onChange={(e) => onUpdateTitle(e.target.value)}
            placeholder="Untitled Design"
            className="text-xs sm:text-sm font-semibold text-foreground bg-transparent hover:bg-muted/50 focus:bg-muted/80 px-2 py-1 rounded-lg border border-transparent focus:border-border transition-colors truncate max-w-[140px] sm:max-w-[220px] focus:outline-none"
            title="Click to rename design"
          />

          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted text-muted-foreground border border-border/60">
            {document.width}×{document.height}
          </span>

          <span className="text-[11px] text-muted-foreground hidden lg:inline flex items-center gap-1">
            <span className={cn("w-1.5 h-1.5 rounded-full", isSaved ? "bg-green-500" : "bg-amber-500 animate-pulse")} />
            {isSaved ? 'Saved' : 'Saving...'}
          </span>
        </div>
      </div>

      {/* Center section: Undo/Redo & Zoom */}
      <div className="flex items-center gap-1">
        {/* Undo / Redo */}
        <button
          type="button"
          disabled={!canUndo}
          onClick={onUndo}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <Undo2 size={16} />
        </button>

        <button
          type="button"
          disabled={!canRedo}
          onClick={onRedo}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <Redo2 size={16} />
        </button>

        <div className="h-4 w-px bg-border/80 mx-1 hidden sm:block" />

        {/* Zoom Controls */}
        <div className="relative hidden sm:flex items-center gap-0.5" ref={zoomMenuRef}>
          <button
            type="button"
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ZoomOut size={15} />
          </button>

          <button
            type="button"
            onClick={() => setZoomOpen(!zoomOpen)}
            className="px-2 py-1 rounded-lg text-xs font-mono font-medium hover:bg-muted text-foreground transition-colors flex items-center gap-1"
          >
            <span>{Math.round(zoom * 100)}%</span>
            <ChevronDown size={11} className="opacity-60" />
          </button>

          <button
            type="button"
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            onClick={onZoomFit}
            title="Fit to Screen"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-0.5"
          >
            <Maximize2 size={14} />
          </button>

          {/* Zoom Menu Dropdown */}
          {zoomOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-28 bg-popover text-popover-foreground rounded-xl border border-border shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => { onZoomFit(); setZoomOpen(false); }}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-muted text-left flex items-center justify-between"
              >
                <span>Fit</span>
              </button>
              {zoomPercentages.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => { onSetZoom(pct / 100); setZoomOpen(false); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-muted text-left flex items-center justify-between font-mono"
                >
                  <span>{pct}%</span>
                  {Math.round(zoom * 100) === pct && <Check size={12} className="text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Save to My Templates & Export */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onSaveAsMyTemplate}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors shadow-xs"
          title="Save as custom template in My Templates"
        >
          <Bookmark size={14} />
          <span>Save as Template</span>
        </button>

        <button
          type="button"
          onClick={handleCopyClipboard}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5"
          title="Copy image to clipboard"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={exportMenuRef}>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => setExportOpen(!exportOpen)}
            className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs flex items-center gap-1.5 hover:opacity-90 transition-all"
          >
            <Download size={14} />
            <span>Export</span>
            <ChevronDown size={12} className={cn("transition-transform", exportOpen ? "rotate-180" : "")} />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-popover text-popover-foreground rounded-2xl border border-border shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
              <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Export Design
              </div>

              <button
                type="button"
                onClick={() => handleExport('png-high')}
                className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-muted transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <ImageIcon size={14} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <span>High-Res PNG</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-bold">300 DPI</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">Crisp print & digital asset</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleExport('pdf')}
                className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-muted transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText size={14} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Print-Ready PDF</div>
                  <div className="text-[11px] text-muted-foreground">For posters, flyers & cards</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleExport('svg')}
                className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-muted transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers size={14} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">SVG Vector File</div>
                  <div className="text-[11px] text-muted-foreground">Infinitely scalable vector</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleExport('jpg')}
                className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-muted transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <ImageIcon size={14} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Standard JPG</div>
                  <div className="text-[11px] text-muted-foreground">Small size for web & email</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
