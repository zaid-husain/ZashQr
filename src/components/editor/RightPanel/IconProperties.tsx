import React from 'react';
import { Trash2, Copy, Lock, Unlock } from 'lucide-react';
import type { IconElement } from '../../../types/template';
import { ColorPicker } from '../../ui/ColorPicker';
import { Slider } from '../../ui/Slider';

interface IconPropertiesProps {
  element: IconElement;
  onUpdate: (id: string, updates: Partial<IconElement>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const IconProperties: React.FC<IconPropertiesProps> = ({
  element,
  onUpdate,
  onDuplicate,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <span className="text-xs font-bold text-foreground">Icon Properties</span>
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

      <ColorPicker
        label="Icon Color"
        value={element.color}
        onChange={(color) => onUpdate(element.id, { color })}
      />

      <div className="space-y-3 pt-2">
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
