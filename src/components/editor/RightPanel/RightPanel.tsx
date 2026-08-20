import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import type {
  TemplateDocument,
  TemplateElement,
  TextElement,
  QRElement,
  ShapeElement,
  ImageElement,
  IconElement,
  CanvasBackground
} from '../../../types/template';
import { TextProperties } from './TextProperties';
import { QRProperties } from './QRProperties';
import { ShapeProperties } from './ShapeProperties';
import { ImageProperties } from './ImageProperties';
import { IconProperties } from './IconProperties';
import { CanvasProperties } from './CanvasProperties';

interface RightPanelProps {
  document: TemplateDocument;
  selectedElement: TemplateElement | null;
  onUpdateElement: (id: string, updates: Partial<TemplateElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onUpdateBackground: (bg: CanvasBackground) => void;
  onUpdateDimensions: (width: number, height: number) => void;
  onUpdateMeta: (meta: Partial<Pick<TemplateDocument, 'name' | 'category' | 'style'>>) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  document,
  selectedElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onUpdateBackground,
  onUpdateDimensions,
  onUpdateMeta
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setIsCollapsed(false)}
        title="Show properties panel"
        className="absolute right-0 top-6 z-30 w-6 h-11 rounded-l-lg bg-card border border-r-0 border-border text-muted-foreground hover:text-foreground flex items-center justify-center shadow-md transition-colors"
      >
        <ChevronLeft size={14} />
      </button>
    );
  }

  return (
    <aside className="w-72 sm:w-80 border-l border-border/80 bg-background flex flex-col h-full overflow-hidden shrink-0 select-none z-20 shadow-xs relative animate-in slide-in-from-right-2 duration-150">
      {/* Collapse button */}
      <div className="absolute right-3 top-3 z-30">
        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          title="Hide properties panel"
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-4">
        {selectedElement?.type === 'text' && (
          <TextProperties
            element={selectedElement as TextElement}
            onUpdate={onUpdateElement}
            onDuplicate={onDuplicateElement}
            onDelete={onDeleteElement}
          />
        )}

        {selectedElement?.type === 'qr' && (
          <QRProperties
            element={selectedElement as QRElement}
            onUpdate={onUpdateElement}
            onDuplicate={onDuplicateElement}
            onDelete={onDeleteElement}
          />
        )}

        {selectedElement?.type === 'shape' && (
          <ShapeProperties
            element={selectedElement as ShapeElement}
            onUpdate={onUpdateElement}
            onDuplicate={onDuplicateElement}
            onDelete={onDeleteElement}
          />
        )}

        {selectedElement?.type === 'image' && (
          <ImageProperties
            element={selectedElement as ImageElement}
            onUpdate={onUpdateElement}
            onDuplicate={onDuplicateElement}
            onDelete={onDeleteElement}
          />
        )}

        {selectedElement?.type === 'icon' && (
          <IconProperties
            element={selectedElement as IconElement}
            onUpdate={onUpdateElement}
            onDuplicate={onDuplicateElement}
            onDelete={onDeleteElement}
          />
        )}

        {!selectedElement && (
          <CanvasProperties
            document={document}
            onUpdateBackground={onUpdateBackground}
            onUpdateDimensions={onUpdateDimensions}
            onUpdateMeta={onUpdateMeta}
          />
        )}
      </div>
    </aside>
  );
};
