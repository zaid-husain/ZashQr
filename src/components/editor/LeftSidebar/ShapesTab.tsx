import React from 'react';
import { Square, Circle, Minus, Triangle, Hexagon, Star } from 'lucide-react';
import type { ShapeElement, ShapeType } from '../../../types/template';

interface ShapesTabProps {
  onAddElement: (data: Partial<ShapeElement> & { type: 'shape' }) => void;
}

export const ShapesTab: React.FC<ShapesTabProps> = ({ onAddElement }) => {
  const shapes: { label: string; shapeType: ShapeType; icon: React.FC<{ size?: number; className?: string }>; width: number; height: number; borderRadius: number }[] = [
    { label: 'Rectangle', shapeType: 'rectangle', icon: Square, width: 240, height: 160, borderRadius: 0 },
    { label: 'Rounded Card', shapeType: 'rounded-rectangle', icon: Square, width: 260, height: 180, borderRadius: 20 },
    { label: 'Circle / Badge', shapeType: 'circle', icon: Circle, width: 140, height: 140, borderRadius: 50 },
    { label: 'Divider Line', shapeType: 'line', icon: Minus, width: 300, height: 4, borderRadius: 0 },
    { label: 'Triangle', shapeType: 'triangle', icon: Triangle, width: 140, height: 140, borderRadius: 0 },
    { label: 'Hexagon', shapeType: 'hexagon', icon: Hexagon, width: 140, height: 140, borderRadius: 0 },
    { label: 'Star', shapeType: 'star', icon: Star, width: 140, height: 140, borderRadius: 0 }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Shapes & Frames</h3>
        <p className="text-xs text-muted-foreground">Add vector backgrounds, containers, and accents.</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {shapes.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() =>
                onAddElement({
                  type: 'shape',
                  name: s.label,
                  shapeType: s.shapeType,
                  fill: '#1e293b',
                  stroke: 'transparent',
                  strokeWidth: 0,
                  strokeStyle: 'solid',
                  borderRadius: s.borderRadius,
                  width: s.width,
                  height: s.height
                })
              }
              className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted text-center transition-all flex flex-col items-center justify-center gap-2 group shadow-xs hover:border-primary/40"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground/80 group-hover:text-primary transition-colors">
                <Icon size={22} />
              </div>
              <span className="text-[11px] font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
