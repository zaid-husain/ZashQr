import React from 'react';
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  QrCode,
  Square,
  Smile,
  Image as ImageIcon
} from 'lucide-react';
import type { TemplateElement } from '../../../types/template';
import { cn } from '../../../utils/cn';

interface LayersTabProps {
  elements: TemplateElement[];
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
  onReorderElement: (id: string, dir: 'front' | 'back' | 'forward' | 'backward') => void;
  onToggleLock: (id: string) => void;
  onToggleHide: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

export const LayersTab: React.FC<LayersTabProps> = ({
  elements,
  selectedId,
  onSelectElement,
  onReorderElement,
  onToggleLock,
  onToggleHide,
  onDeleteElement
}) => {
  // Sort with highest z-index on top
  const sortedLayers = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (type: TemplateElement['type']) => {
    switch (type) {
      case 'text':
        return <Type size={14} className="text-blue-500" />;
      case 'qr':
        return <QrCode size={14} className="text-emerald-500" />;
      case 'shape':
        return <Square size={14} className="text-amber-500" />;
      case 'icon':
        return <Smile size={14} className="text-purple-500" />;
      case 'image':
        return <ImageIcon size={14} className="text-rose-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Layers</h3>
        <p className="text-xs text-muted-foreground">Manage ordering, visibility, and lock status.</p>
      </div>

      <div className="space-y-1.5 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
        {sortedLayers.map((el) => {
          const isSelected = el.id === selectedId;
          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={cn(
                "p-2 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all cursor-pointer group",
                isSelected
                  ? "bg-primary/10 border-primary text-foreground font-semibold shadow-xs"
                  : "border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="shrink-0">{getElementIcon(el.type)}</div>
                <span className="truncate text-xs">{el.name || el.type.toUpperCase()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* Reorder Buttons */}
                <button
                  type="button"
                  onClick={() => onReorderElement(el.id, 'forward')}
                  title="Bring Forward"
                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowUp size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => onReorderElement(el.id, 'backward')}
                  title="Send Backward"
                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowDown size={13} />
                </button>

                {/* Hide / Show */}
                <button
                  type="button"
                  onClick={() => onToggleHide(el.id)}
                  title={el.isHidden ? 'Show Layer' : 'Hide Layer'}
                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                >
                  {el.isHidden ? <EyeOff size={13} className="text-amber-500" /> : <Eye size={13} />}
                </button>

                {/* Lock / Unlock */}
                <button
                  type="button"
                  onClick={() => onToggleLock(el.id)}
                  title={el.isLocked ? 'Unlock Layer' : 'Lock Layer'}
                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                >
                  {el.isLocked ? <Lock size={13} className="text-primary" /> : <Unlock size={13} />}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDeleteElement(el.id)}
                  title="Delete Layer"
                  className="p-1 rounded hover:bg-background text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
