import React, { useState } from 'react';
import {
  LayoutTemplate,
  Type,
  QrCode,
  Shapes,
  Smile,
  Image as ImageIcon,
  Palette,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { TemplateDocument, TemplateElement, CanvasBackground } from '../../../types/template';
import { TemplatesTab } from './TemplatesTab';
import { TextTab } from './TextTab';
import { QRTab } from './QRTab';
import { ShapesTab } from './ShapesTab';
import { IconsTab } from './IconsTab';
import { ImagesTab } from './ImagesTab';
import { BackgroundTab } from './BackgroundTab';
import { BrandKitTab } from './BrandKitTab';
import { LayersTab } from './LayersTab';
import { cn } from '../../../utils/cn';

export type SidebarTab =
  | 'templates'
  | 'text'
  | 'qr'
  | 'shapes'
  | 'icons'
  | 'images'
  | 'background'
  | 'brand-kit'
  | 'layers';

interface LeftSidebarProps {
  currentDocument: TemplateDocument;
  selectedId: string | null;
  onSelectTemplate: (template: TemplateDocument) => void;
  onAddElement: (data: Partial<TemplateElement> & { type: TemplateElement['type'] }) => void;
  onUpdateBackground: (bg: CanvasBackground) => void;
  onSelectElement: (id: string | null) => void;
  onReorderElement: (id: string, dir: 'front' | 'back' | 'forward' | 'backward') => void;
  onToggleLock: (id: string) => void;
  onToggleHide: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onApplyBrandKit: (colors: { primary: string; secondary: string; accent: string; text: string; bg: string }, font: string, logo?: string) => void;
}

const SIDEBAR_ITEMS: { id: SidebarTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'qr', label: 'QR Code', icon: QrCode },
  { id: 'shapes', label: 'Shapes', icon: Shapes },
  { id: 'icons', label: 'Icons', icon: Smile },
  { id: 'images', label: 'Uploads', icon: ImageIcon },
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'brand-kit', label: 'Brand Kit', icon: Sparkles },
  { id: 'layers', label: 'Layers', icon: Layers }
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentDocument,
  selectedId,
  onSelectTemplate,
  onAddElement,
  onUpdateBackground,
  onSelectElement,
  onReorderElement,
  onToggleLock,
  onToggleHide,
  onDeleteElement,
  onApplyBrandKit
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab | null>('templates');

  const handleTabClick = (tabId: SidebarTab) => {
    if (activeTab === tabId) {
      setActiveTab(null); // collapse
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="flex h-full border-r border-border/80 bg-background shrink-0 z-20 select-none relative">
      {/* Icon Navigation Bar (64px) */}
      <nav className="w-16 sm:w-18 border-r border-border/60 bg-card flex flex-col items-center py-3 gap-1 overflow-y-auto scrollbar-none shrink-0">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "w-12 sm:w-14 h-12 sm:h-13 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              <Icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "scale-105" : "")} />
              <span className="leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Flyout Content Panel */}
      {activeTab && (
        <aside className="w-72 sm:w-80 bg-background border-r border-border/60 flex flex-col h-full overflow-hidden shadow-sm animate-in slide-in-from-left-2 duration-150 relative">
          {/* Header Close / Collapse button */}
          <div className="absolute right-3 top-3 z-20">
            <button
              type="button"
              onClick={() => setActiveTab(null)}
              title="Close sidebar"
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-4">
            {activeTab === 'templates' && (
              <TemplatesTab onSelectTemplate={onSelectTemplate} />
            )}
            {activeTab === 'text' && (
              <TextTab onAddElement={onAddElement} />
            )}
            {activeTab === 'qr' && (
              <QRTab onAddElement={onAddElement} currentTemplate={currentDocument} />
            )}
            {activeTab === 'shapes' && (
              <ShapesTab onAddElement={onAddElement} />
            )}
            {activeTab === 'icons' && (
              <IconsTab onAddElement={onAddElement} />
            )}
            {activeTab === 'images' && (
              <ImagesTab onAddElement={onAddElement} />
            )}
            {activeTab === 'background' && (
              <BackgroundTab currentBackground={currentDocument.background} onUpdateBackground={onUpdateBackground} />
            )}
            {activeTab === 'brand-kit' && (
              <BrandKitTab onApplyBrandKit={onApplyBrandKit} />
            )}
            {activeTab === 'layers' && (
              <LayersTab
                elements={currentDocument.elements}
                selectedId={selectedId}
                onSelectElement={onSelectElement}
                onReorderElement={onReorderElement}
                onToggleLock={onToggleLock}
                onToggleHide={onToggleHide}
                onDeleteElement={onDeleteElement}
              />
            )}
          </div>
        </aside>
      )}

      {/* Seam toggle expand button when panel is closed */}
      {!activeTab && (
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          title="Expand sidebar"
          className="absolute left-16 sm:left-18 top-6 -translate-x-1/2 z-30 w-5 h-10 rounded-r-md bg-card border border-l-0 border-border text-muted-foreground hover:text-foreground flex items-center justify-center shadow-md transition-colors"
        >
          <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
};
