import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  allowTransparent?: boolean;
  className?: string;
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#18181b', '#3f3f46', '#71717a',
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  allowTransparent = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <div className="text-xs font-medium text-foreground/80">{label}</div>}
      <div className="flex items-center gap-2">
        {/* Swatch & native picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 rounded-lg border border-border/80 shadow-xs flex items-center justify-center p-0.5 hover:ring-2 hover:ring-primary/20 transition-all"
            style={{
              backgroundColor: value === 'transparent' ? 'transparent' : value,
              backgroundImage: value === 'transparent'
                ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px'
                : 'none'
            }}
            title={value}
          />
          <input
            type="color"
            value={value.startsWith('#') ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 h-8 px-2.5 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
        />

        {allowTransparent && (
          <button
            type="button"
            onClick={() => onChange('transparent')}
            className={cn(
              "h-8 px-2 rounded-lg border text-[11px] font-medium transition-colors",
              value === 'transparent'
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted text-muted-foreground"
            )}
          >
            None
          </button>
        )}
      </div>

      {/* Preset Swatches */}
      <div className="flex flex-wrap gap-1 pt-1">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "w-5 h-5 rounded-md border border-border/60 transition-transform hover:scale-110",
              value.toLowerCase() === color.toLowerCase() ? "ring-2 ring-primary ring-offset-1" : ""
            )}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
};
