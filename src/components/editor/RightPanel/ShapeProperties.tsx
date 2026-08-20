import React from 'react';
import { Trash2, Copy, Lock, Unlock } from 'lucide-react';
import type { ShapeElement } from '../../../types/template';
import { ColorPicker } from '../../ui/ColorPicker';
import { Slider } from '../../ui/Slider';

interface ShapePropertiesProps {
  element: ShapeElement;
  onUpdate: (id: string, updates: Partial<ShapeElement>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ShapeProperties: React.FC<ShapePropertiesProps> = ({
  element,
  onUpdate,
  onDuplicate,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <span className="text-xs font-bold text-foreground capitalize">
          {element.shapeType} Properties
        </span>
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

      {/* Colors */}
      <ColorPicker
        label="Fill Color"
        allowTransparent
        value={element.fill}
        onChange={(fill) => onUpdate(element.id, { fill })}
      />

      <ColorPicker
        label="Border / Stroke Color"
        allowTransparent
        value={element.stroke}
        onChange={(stroke) => onUpdate(element.id, { stroke })}
      />

      {/* Sliders */}
      <div className="space-y-3 pt-2">
        <Slider
          label="Border Width"
          valueDisplay={`${element.strokeWidth || 0}px`}
          min={0}
          max={20}
          value={element.strokeWidth || 0}
          onChange={(e) => onUpdate(element.id, { strokeWidth: Number(e.target.value) })}
        />

        {element.shapeType !== 'circle' && (
          <Slider
            label="Corner Radius"
            valueDisplay={`${element.borderRadius || 0}px`}
            min={0}
            max={80}
            value={element.borderRadius || 0}
            onChange={(e) => onUpdate(element.id, { borderRadius: Number(e.target.value) })}
          />
        )}

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
