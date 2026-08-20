import React, { useRef } from 'react';
import { Trash2, Copy, Lock, Unlock, RefreshCw } from 'lucide-react';
import type { ImageElement } from '../../../types/template';
import { Slider } from '../../ui/Slider';
import { ColorPicker } from '../../ui/ColorPicker';

interface ImagePropertiesProps {
  element: ImageElement;
  onUpdate: (id: string, updates: Partial<ImageElement>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ImageProperties: React.FC<ImagePropertiesProps> = ({
  element,
  onUpdate,
  onDuplicate,
  onDelete
}) => {
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleReplaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUpdate(element.id, { src: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <span className="text-xs font-bold text-foreground">Image Properties</span>
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

      {/* Replace Image Button */}
      <div>
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/*"
          onChange={handleReplaceUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => replaceInputRef.current?.click()}
          className="w-full py-2 px-3 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <RefreshCw size={14} />
          <span>Replace Image</span>
        </button>
      </div>

      {/* Object Fit */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground/80">Scaling / Fit</label>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/40 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => onUpdate(element.id, { objectFit: 'cover' })}
            className={`py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              element.objectFit === 'cover' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground'
            }`}
          >
            Cover
          </button>
          <button
            type="button"
            onClick={() => onUpdate(element.id, { objectFit: 'contain' })}
            className={`py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              element.objectFit === 'contain' ? 'bg-background shadow-xs text-foreground font-semibold' : 'text-muted-foreground'
            }`}
          >
            Contain
          </button>
        </div>
      </div>

      {/* Border Color */}
      <ColorPicker
        label="Border Color"
        allowTransparent
        value={element.borderColor || 'transparent'}
        onChange={(borderColor) => onUpdate(element.id, { borderColor })}
      />

      {/* Sliders */}
      <div className="space-y-3 pt-2">
        <Slider
          label="Border Width"
          valueDisplay={`${element.borderWidth || 0}px`}
          min={0}
          max={20}
          value={element.borderWidth || 0}
          onChange={(e) => onUpdate(element.id, { borderWidth: Number(e.target.value) })}
        />

        <Slider
          label="Corner Radius"
          valueDisplay={`${element.borderRadius || 0}px`}
          min={0}
          max={100}
          value={element.borderRadius || 0}
          onChange={(e) => onUpdate(element.id, { borderRadius: Number(e.target.value) })}
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
