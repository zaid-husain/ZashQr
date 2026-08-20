import React, { useRef } from 'react';
import type {
  TemplateDocument,
  TemplateElement
} from '../../types/template';
import { CanvasElement } from './CanvasElement';
import type { SnapGuide } from '../../hooks/useTemplateEditor';
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface CanvasProps {
  document: TemplateDocument;
  selectedId: string | null;
  zoom: number;
  snapGuides: SnapGuide[];
  onSelectElement: (id: string | null, e?: React.MouseEvent) => void;
  onUpdateElement: (id: string, updates: Partial<TemplateElement>) => void;
  onSnapChange: (guides: SnapGuide[]) => void;
  onDuplicateElement?: (id: string) => void;
  onDeleteElement?: (id: string) => void;
  onReorderElement?: (id: string, dir: 'forward' | 'backward') => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  document,
  selectedId,
  zoom,
  snapGuides,
  onSelectElement,
  onUpdateElement,
  onSnapChange,
  onDuplicateElement,
  onDeleteElement,
  onReorderElement
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height, background, elements } = document;

  const selectedElement = elements.find((el) => el.id === selectedId);

  // Background style computation
  const getBackgroundStyle = (): React.CSSProperties => {
    if (background.type === 'solid') {
      return { backgroundColor: background.color };
    }
    if (background.type === 'gradient') {
      const colors = background.colors.join(', ');
      return {
        background: `linear-gradient(${background.angle || 135}deg, ${colors})`
      };
    }
    if (background.type === 'pattern') {
      return {
        backgroundColor: background.bgColor,
        backgroundImage: `radial-gradient(${background.patternColor} 1.5px, transparent 1.5px)`,
        backgroundSize: `${20 * (background.scale || 1)}px ${20 * (background.scale || 1)}px`
      };
    }
    return { backgroundColor: '#ffffff' };
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).id === 'canvas-board' ||
      (e.target as HTMLElement).id === 'canvas-container'
    ) {
      onSelectElement(null, e);
    }
  };

  return (
    <div
      id="canvas-container"
      ref={containerRef}
      onClick={handleCanvasClick}
      className="flex-1 w-full h-full min-h-0 bg-[#f4f4f6] dark:bg-[#121215] overflow-auto flex items-center justify-center p-8 sm:p-14 relative select-none"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(120, 120, 120, 0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Floating Quick Action Toolbar over selected element */}
      {selectedElement && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1.5 rounded-2xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2 text-xs font-semibold text-foreground/80 flex items-center gap-1.5 border-r border-border/60 mr-1">
            <span className="capitalize">{selectedElement.type}</span>
            <span className="text-[10px] text-muted-foreground font-mono">
              ({selectedElement.width}×{selectedElement.height})
            </span>
          </div>

          {/* Quick Reorder */}
          {onReorderElement && (
            <>
              <button
                type="button"
                onClick={() => onReorderElement(selectedElement.id, 'forward')}
                title="Bring Forward"
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => onReorderElement(selectedElement.id, 'backward')}
                title="Send Backward"
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowDown size={14} />
              </button>
              <div className="h-4 w-px bg-border/60 mx-0.5" />
            </>
          )}

          {/* Lock / Unlock */}
          <button
            type="button"
            onClick={() => onUpdateElement(selectedElement.id, { isLocked: !selectedElement.isLocked })}
            title={selectedElement.isLocked ? 'Unlock Element' : 'Lock Element'}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              selectedElement.isLocked ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {selectedElement.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>

          {/* Duplicate */}
          {onDuplicateElement && (
            <button
              type="button"
              onClick={() => onDuplicateElement(selectedElement.id)}
              title="Duplicate (Ctrl+D)"
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy size={14} />
            </button>
          )}

          {/* Delete */}
          {onDeleteElement && (
            <button
              type="button"
              onClick={() => onDeleteElement(selectedElement.id)}
              title="Delete (Del)"
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      {/* Artboard Card Container (Strict shrink-0 prevents flexbox deformation) */}
      <div
        id="canvas-board"
        onClick={handleCanvasClick}
        className="relative shrink-0 max-w-none max-h-none shadow-2xl rounded-xl transition-transform duration-100 ease-out origin-center overflow-hidden border border-border/40"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${zoom})`,
          ...getBackgroundStyle()
        }}
      >
        {/* Render Elements */}
        {elements
          .filter((el) => !el.isHidden)
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={element.id === selectedId}
              zoom={zoom}
              canvasWidth={width}
              canvasHeight={height}
              onSelect={(id, e) => onSelectElement(id, e)}
              onUpdate={onUpdateElement}
              onSnapChange={onSnapChange}
            />
          ))}

        {/* Dynamic Snap Guides Overlay */}
        {snapGuides.map((guide, idx) => {
          if (guide.type === 'x') {
            return (
              <div
                key={`snap-x-${idx}`}
                className="absolute top-0 bottom-0 w-[1.5px] bg-blue-500 pointer-events-none z-50 shadow-xs"
                style={{ left: `${guide.position}px` }}
              />
            );
          }
          return (
            <div
              key={`snap-y-${idx}`}
              className="absolute left-0 right-0 h-[1.5px] bg-blue-500 pointer-events-none z-50 shadow-xs"
              style={{ top: `${guide.position}px` }}
            />
          );
        })}
      </div>
    </div>
  );
};
