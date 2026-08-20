import React from 'react';
import { Maximize2, Palette } from 'lucide-react';
import type { TemplateDocument, CanvasBackground, CategoryType, TemplateStyle } from '../../../types/template';
import { ALL_CATEGORIES } from '../../../data/templates';
import { ColorPicker } from '../../ui/ColorPicker';

interface CanvasPropertiesProps {
  document: TemplateDocument;
  onUpdateBackground: (bg: CanvasBackground) => void;
  onUpdateDimensions: (width: number, height: number) => void;
  onUpdateMeta: (meta: Partial<Pick<TemplateDocument, 'name' | 'category' | 'style'>>) => void;
}

const DIMENSION_PRESETS = [
  { label: 'Flyer / Poster (A4)', width: 600, height: 840 },
  { label: 'Instagram Post (1:1)', width: 600, height: 600 },
  { label: 'Instagram Story (9:16)', width: 540, height: 960 },
  { label: 'Business Card (3.5×2)', width: 640, height: 380 },
  { label: 'Table Tent / Menu', width: 500, height: 700 },
  { label: 'Certificate / Award', width: 800, height: 560 },
  { label: 'QR Sticker (Square)', width: 500, height: 500 },
  { label: 'LinkedIn Banner (16:9)', width: 800, height: 400 }
];

const STYLES: TemplateStyle[] = [
  'Modern',
  'Minimal',
  'Corporate',
  'Creative',
  'Luxury',
  'Bold',
  'Retro',
  'Elegant'
];

const PRESET_SWATCHES = [
  '#ffffff', '#09090b', '#18181b', '#0f172a',
  '#f4f4f5', '#e4e4e7', '#fefce8', '#eff6ff'
];

export const CanvasProperties: React.FC<CanvasPropertiesProps> = ({
  document,
  onUpdateBackground,
  onUpdateDimensions,
  onUpdateMeta
}) => {
  const currentBgColor =
    document.background.type === 'solid'
      ? document.background.color
      : document.background.type === 'pattern'
      ? document.background.bgColor
      : '#ffffff';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-2 border-b border-border/60">
        <div className="text-xs font-bold text-foreground">Canvas Settings</div>
        <p className="text-[11px] text-muted-foreground">Global dimensions and canvas background.</p>
      </div>

      {/* Preset Dimensions */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
          <Maximize2 size={13} className="text-primary" />
          <span>Canvas Size Preset</span>
        </label>
        <select
          value={`${document.width}x${document.height}`}
          onChange={(e) => {
            const [w, h] = e.target.value.split('x').map(Number);
            if (w && h) onUpdateDimensions(w, h);
          }}
          className="w-full h-9 px-2.5 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring shadow-xs"
        >
          {DIMENSION_PRESETS.map((p) => (
            <option key={p.label} value={`${p.width}x${p.height}`}>
              {p.label} ({p.width}×{p.height})
            </option>
          ))}
        </select>
      </div>

      {/* Custom Dimensions */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="space-y-1">
          <label className="text-[11px] text-muted-foreground font-medium">Width (px)</label>
          <input
            type="number"
            value={document.width}
            onChange={(e) => onUpdateDimensions(Number(e.target.value), document.height)}
            className="w-full h-8 px-2.5 rounded-lg border border-border bg-muted/40 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[11px] text-muted-foreground font-medium">Height (px)</label>
          <input
            type="number"
            value={document.height}
            onChange={(e) => onUpdateDimensions(document.width, Number(e.target.value))}
            className="w-full h-8 px-2.5 rounded-lg border border-border bg-muted/40 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-2 pt-1 border-t border-border/60">
        <label className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
          <Palette size={13} className="text-primary" />
          <span>Canvas Background</span>
        </label>

        <ColorPicker
          label=""
          value={currentBgColor}
          onChange={(color) => onUpdateBackground({ type: 'solid', color })}
        />

        <div className="grid grid-cols-8 gap-1.5 pt-1">
          {PRESET_SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => onUpdateBackground({ type: 'solid', color: swatch })}
              className="w-full aspect-square rounded-md border border-border/80 shadow-xs hover:scale-110 transition-transform"
              style={{ backgroundColor: swatch }}
              title={swatch}
            />
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground/80">Category</label>
          <select
            value={document.category}
            onChange={(e) => onUpdateMeta({ category: e.target.value as CategoryType })}
            className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground/80">Style</label>
          <select
            value={document.style}
            onChange={(e) => onUpdateMeta({ style: e.target.value as TemplateStyle })}
            className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {STYLES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
