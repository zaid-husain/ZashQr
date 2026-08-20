import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Italic,
  Trash2,
  Copy,
  Lock,
  Unlock
} from 'lucide-react';
import type { TextElement } from '../../../types/template';
import { ColorPicker } from '../../ui/ColorPicker';
import { Slider } from '../../ui/Slider';

interface TextPropertiesProps {
  element: TextElement;
  onUpdate: (id: string, updates: Partial<TextElement>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const FONTS = [
  'Inter',
  'Roboto',
  'Plus Jakarta Sans',
  'Outfit',
  'Playfair Display',
  'Montserrat',
  'Merriweather',
  'Courier Prime',
  'Oswald'
];

export const TextProperties: React.FC<TextPropertiesProps> = ({
  element,
  onUpdate,
  onDuplicate,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {/* Element Header & Quick Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <span className="text-xs font-bold text-foreground">Text Properties</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdate(element.id, { isLocked: !element.isLocked })}
            title={element.isLocked ? 'Unlock' : 'Lock'}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {element.isLocked ? <Lock size={14} className="text-primary" /> : <Unlock size={14} />}
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(element.id)}
            title="Duplicate"
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(element.id)}
            title="Delete"
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Text Content Input */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground/80">Content</label>
        <textarea
          rows={3}
          value={element.text}
          onChange={(e) => onUpdate(element.id, { text: e.target.value })}
          className="w-full p-2 rounded-xl border border-border bg-muted/30 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-y"
        />
      </div>

      {/* Font Family & Weight */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground/80">Font</label>
          <select
            value={element.fontFamily}
            onChange={(e) => onUpdate(element.id, { fontFamily: e.target.value })}
            className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {FONTS.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground/80">Weight</label>
          <select
            value={element.fontWeight || '400'}
            onChange={(e) => onUpdate(element.id, { fontWeight: e.target.value as any })}
            className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">SemiBold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">ExtraBold (800)</option>
            <option value="900">Black (900)</option>
          </select>
        </div>
      </div>

      {/* Font Size */}
      <Slider
        label="Font Size"
        valueDisplay={`${element.fontSize}px`}
        min={8}
        max={120}
        value={element.fontSize}
        onChange={(e) => onUpdate(element.id, { fontSize: Number(e.target.value) })}
      />

      {/* Formatting Toolbar */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground/80">Alignment & Style</label>
        <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => onUpdate(element.id, { textAlign: 'left' })}
            className={`flex-1 p-1.5 rounded-lg flex items-center justify-center transition-colors ${
              element.textAlign === 'left' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground'
            }`}
          >
            <AlignLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => onUpdate(element.id, { textAlign: 'center' })}
            className={`flex-1 p-1.5 rounded-lg flex items-center justify-center transition-colors ${
              element.textAlign === 'center' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground'
            }`}
          >
            <AlignCenter size={14} />
          </button>
          <button
            type="button"
            onClick={() => onUpdate(element.id, { textAlign: 'right' })}
            className={`flex-1 p-1.5 rounded-lg flex items-center justify-center transition-colors ${
              element.textAlign === 'right' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground'
            }`}
          >
            <AlignRight size={14} />
          </button>
          <div className="h-4 w-px bg-border mx-0.5" />
          <button
            type="button"
            onClick={() =>
              onUpdate(element.id, {
                fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic'
              })
            }
            className={`p-1.5 rounded-lg transition-colors ${
              element.fontStyle === 'italic' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground'
            }`}
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdate(element.id, {
                textTransform: element.textTransform === 'uppercase' ? 'none' : 'uppercase'
              })
            }
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
              element.textTransform === 'uppercase' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
            }`}
          >
            AA
          </button>
        </div>
      </div>

      {/* Colors */}
      <ColorPicker
        label="Text Color"
        value={element.color}
        onChange={(color) => onUpdate(element.id, { color })}
      />

      <ColorPicker
        label="Badge / Background Highlight"
        allowTransparent
        value={element.backgroundColor || 'transparent'}
        onChange={(backgroundColor) => onUpdate(element.id, { backgroundColor })}
      />

      {/* Spacing & Opacity */}
      <div className="space-y-3 pt-2">
        <Slider
          label="Line Height"
          valueDisplay={element.lineHeight || 1.2}
          min={0.8}
          max={2.4}
          step={0.1}
          value={element.lineHeight || 1.2}
          onChange={(e) => onUpdate(element.id, { lineHeight: Number(e.target.value) })}
        />

        <Slider
          label="Letter Spacing"
          valueDisplay={`${element.letterSpacing || 0}px`}
          min={-2}
          max={16}
          step={0.5}
          value={element.letterSpacing || 0}
          onChange={(e) => onUpdate(element.id, { letterSpacing: Number(e.target.value) })}
        />

        <Slider
          label="Opacity"
          valueDisplay={`${Math.round((element.opacity ?? 1) * 100)}%`}
          min={0.05}
          max={1}
          step={0.05}
          value={element.opacity ?? 1}
          onChange={(e) => onUpdate(element.id, { opacity: Number(e.target.value) })}
        />
      </div>
    </div>
  );
};
