import React from 'react';
import { Trash2, Copy, Sliders, ChevronDown } from 'lucide-react';
import type {
  TemplateDocument,
  TemplateElement,
  CanvasBackground,
  TextElement,
  QRElement,
  ShapeElement,
  ImageElement,
  IconElement
} from '../../../types/template';
import type { MobileTab } from './MobileBottomBar';
import { TextProperties } from '../RightPanel/TextProperties';
import { QRProperties } from '../RightPanel/QRProperties';
import { ShapeProperties } from '../RightPanel/ShapeProperties';
import { ImageProperties } from '../RightPanel/ImageProperties';
import { IconProperties } from '../RightPanel/IconProperties';
import { CanvasProperties } from '../RightPanel/CanvasProperties';
import { TextTab } from '../LeftSidebar/TextTab';
import { QRTab } from '../LeftSidebar/QRTab';
import { ShapesTab } from '../LeftSidebar/ShapesTab';
import { BackgroundTab } from '../LeftSidebar/BackgroundTab';
import { LayersTab } from '../LeftSidebar/LayersTab';
import { TemplatesTab } from '../LeftSidebar/TemplatesTab';
import { BrandKitTab } from '../LeftSidebar/BrandKitTab';

interface MobilePropertiesSheetProps {
  activeTab: MobileTab;
  onClose: () => void;
  document: TemplateDocument;
  selectedElement: TemplateElement | null;
  onUpdateElement: (id: string, updates: Partial<TemplateElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onUpdateBackground: (bg: CanvasBackground) => void;
  onUpdateDimensions: (width: number, height: number) => void;
  onUpdateMeta: (meta: Partial<Pick<TemplateDocument, 'name' | 'category' | 'style'>>) => void;
  onAddElement: (data: Partial<TemplateElement> & { type: TemplateElement['type'] }) => void;
  onSelectTemplate: (template: TemplateDocument) => void;
  onSelectElement: (id: string | null) => void;
  onReorderElement: (id: string, dir: 'front' | 'back' | 'forward' | 'backward') => void;
  onToggleLock: (id: string) => void;
  onToggleHide: (id: string) => void;
  onApplyBrandKit: (colors: { primary: string; secondary: string; accent: string; text: string; bg: string }, font: string, logo?: string) => void;
}

export const MobilePropertiesSheet: React.FC<MobilePropertiesSheetProps> = ({
  activeTab,
  onClose,
  document,
  selectedElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onUpdateBackground,
  onUpdateDimensions,
  onUpdateMeta,
  onAddElement,
  onSelectTemplate,
  onSelectElement,
  onReorderElement,
  onToggleLock,
  onToggleHide,
  onApplyBrandKit
}) => {
  if (!activeTab) return null;

  const getSheetTitle = () => {
    if (activeTab === 'properties') {
      return selectedElement ? `${selectedElement.name || selectedElement.type} Properties` : 'Canvas Settings';
    }
    if (activeTab === 'text') return 'Add Text';
    if (activeTab === 'qr') return 'Add QR Code';
    if (activeTab === 'shapes') return 'Shapes & Badges';
    if (activeTab === 'background') return 'Canvas Background';
    if (activeTab === 'layers') return 'Layers Manager';
    if (activeTab === 'templates') return 'Templates Library';
    if (activeTab === 'brand') return 'Brand Kit Palettes';
    return 'Editor Settings';
  };

  return (
    <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content Container */}
      <div
        className="relative z-50 bg-card border-t border-border rounded-t-3xl shadow-2xl max-h-[78vh] flex flex-col animate-in slide-in-from-bottom duration-250 pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle */}
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Sheet Header */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground capitalize">
              {getSheetTitle()}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {activeTab === 'properties' && selectedElement && (
              <>
                <button
                  type="button"
                  onClick={() => onDuplicateElement(selectedElement.id)}
                  title="Duplicate"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Copy size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteElement(selectedElement.id);
                    onClose();
                  }}
                  title="Delete"
                  className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1 cursor-pointer"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Sheet Body Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'properties' && (
            <>
              {selectedElement ? (
                <>
                  {selectedElement.type === 'text' && (
                    <TextProperties
                      element={selectedElement as TextElement}
                      onUpdate={(id, updates) => onUpdateElement(id, updates)}
                      onDuplicate={onDuplicateElement}
                      onDelete={onDeleteElement}
                    />
                  )}
                  {selectedElement.type === 'qr' && (
                    <QRProperties
                      element={selectedElement as QRElement}
                      onUpdate={(id, updates) => onUpdateElement(id, updates)}
                      onDuplicate={onDuplicateElement}
                      onDelete={onDeleteElement}
                    />
                  )}
                  {selectedElement.type === 'shape' && (
                    <ShapeProperties
                      element={selectedElement as ShapeElement}
                      onUpdate={(id, updates) => onUpdateElement(id, updates)}
                      onDuplicate={onDuplicateElement}
                      onDelete={onDeleteElement}
                    />
                  )}
                  {selectedElement.type === 'image' && (
                    <ImageProperties
                      element={selectedElement as ImageElement}
                      onUpdate={(id, updates) => onUpdateElement(id, updates)}
                      onDuplicate={onDuplicateElement}
                      onDelete={onDeleteElement}
                    />
                  )}
                  {selectedElement.type === 'icon' && (
                    <IconProperties
                      element={selectedElement as IconElement}
                      onUpdate={(id, updates) => onUpdateElement(id, updates)}
                      onDuplicate={onDuplicateElement}
                      onDelete={onDeleteElement}
                    />
                  )}
                </>
              ) : (
                <CanvasProperties
                  document={document}
                  onUpdateBackground={onUpdateBackground}
                  onUpdateDimensions={onUpdateDimensions}
                  onUpdateMeta={onUpdateMeta}
                />
              )}
            </>
          )}

          {activeTab === 'text' && (
            <TextTab onAddElement={(data) => { onAddElement(data); onClose(); }} />
          )}

          {activeTab === 'qr' && (
            <QRTab currentTemplate={document} onAddElement={(data) => { onAddElement(data); onClose(); }} />
          )}

          {activeTab === 'shapes' && (
            <ShapesTab onAddElement={(data) => { onAddElement(data); onClose(); }} />
          )}

          {activeTab === 'background' && (
            <BackgroundTab
              currentBackground={document.background}
              onUpdateBackground={onUpdateBackground}
            />
          )}

          {activeTab === 'layers' && (
            <LayersTab
              elements={document.elements}
              selectedId={selectedElement?.id || null}
              onSelectElement={onSelectElement}
              onReorderElement={onReorderElement}
              onToggleLock={onToggleLock}
              onToggleHide={onToggleHide}
              onDeleteElement={onDeleteElement}
            />
          )}

          {activeTab === 'templates' && (
            <TemplatesTab onSelectTemplate={(tmpl) => { onSelectTemplate(tmpl); onClose(); }} />
          )}

          {activeTab === 'brand' && (
            <BrandKitTab onApplyBrandKit={(colors, font, logo) => { onApplyBrandKit(colors, font, logo); onClose(); }} />
          )}
        </div>
      </div>
    </div>
  );
};
