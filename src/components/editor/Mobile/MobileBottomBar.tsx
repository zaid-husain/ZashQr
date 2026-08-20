import React from 'react';
import {
  Type,
  QrCode,
  Square,
  Palette,
  Layers,
  LayoutTemplate,
  Sparkles,
  Sliders
} from 'lucide-react';
import { cn } from '../../../utils/cn';

export type MobileTab = 'templates' | 'text' | 'qr' | 'shapes' | 'background' | 'layers' | 'brand' | 'properties' | null;

interface MobileBottomBarProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  hasSelectedElement: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  onSelectTab,
  hasSelectedElement
}) => {
  const tools = [
    { id: 'text' as MobileTab, label: 'Text', icon: Type },
    { id: 'qr' as MobileTab, label: 'QR', icon: QrCode },
    { id: 'shapes' as MobileTab, label: 'Shapes', icon: Square },
    { id: 'background' as MobileTab, label: 'Color', icon: Palette },
    { id: 'layers' as MobileTab, label: 'Layers', icon: Layers },
    { id: 'templates' as MobileTab, label: 'Templates', icon: LayoutTemplate },
    { id: 'brand' as MobileTab, label: 'Brand', icon: Sparkles }
  ];

  return (
    <div className="lg:hidden border-t border-border/80 bg-background/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around z-30 shrink-0 pb-safe">
      {hasSelectedElement && (
        <button
          type="button"
          onClick={() => onSelectTab(activeTab === 'properties' ? null : 'properties')}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-semibold transition-all touch-btn",
            activeTab === 'properties'
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-primary/10 text-primary animate-pulse"
          )}
        >
          <Sliders size={18} className="mb-0.5" />
          <span>Edit</span>
        </button>
      )}

      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTab === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelectTab(isActive ? null : tool.id)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[44px] h-12 px-2 rounded-xl text-[10px] font-medium transition-all cursor-pointer touch-btn",
              isActive
                ? "bg-primary text-primary-foreground font-bold shadow-xs scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 active:scale-95"
            )}
          >
            <Icon size={18} className="mb-0.5" />
            <span className="leading-none">{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
};
