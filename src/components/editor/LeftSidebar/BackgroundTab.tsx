import React from 'react';
import type { CanvasBackground } from '../../../types/template';
import { ColorPicker } from '../../ui/ColorPicker';

interface BackgroundTabProps {
  currentBackground: CanvasBackground;
  onUpdateBackground: (bg: CanvasBackground) => void;
}

const SOLID_PRESETS = [
  '#ffffff', '#fafafa', '#f4f4f5', '#09090b', '#18181b', '#0f172a',
  '#fefce8', '#fff7ed', '#fdfbf7', '#022c22', '#1e1b4b', '#311042'
];

const GRADIENT_PRESETS = [
  { name: 'Dark Slate', colors: ['#0f172a', '#1e293b', '#0f172a'], angle: 135 },
  { name: 'Sunset Flame', colors: ['#ea580c', '#c2410c', '#9a3412'], angle: 160 },
  { name: 'Cyber Purple', colors: ['#4c1d95', '#2e1065', '#0f172a'], angle: 150 },
  { name: 'Neon Night', colors: ['#0f051d', '#280c4d', '#110326'], angle: 180 },
  { name: 'Deep Emerald', colors: ['#047857', '#064e3b'], angle: 135 },
  { name: 'Midnight Azure', colors: ['#020617', '#082f49', '#020617'], angle: 140 }
];

export const BackgroundTab: React.FC<BackgroundTabProps> = ({
  currentBackground,
  onUpdateBackground
}) => {
  const currentColor =
    currentBackground.type === 'solid'
      ? currentBackground.color
      : currentBackground.type === 'pattern'
      ? currentBackground.bgColor
      : '#ffffff';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Background</h3>
        <p className="text-xs text-muted-foreground">Customize canvas canvas background color or gradient.</p>
      </div>

      {/* Solid Color Picker */}
      <div className="space-y-2">
        <ColorPicker
          label="Solid Color"
          value={currentColor}
          onChange={(color) => onUpdateBackground({ type: 'solid', color })}
        />
      </div>

      {/* Preset Swatches */}
      <div>
        <div className="text-xs font-semibold text-foreground mb-2">Preset Colors</div>
        <div className="grid grid-cols-6 gap-2">
          {SOLID_PRESETS.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => onUpdateBackground({ type: 'solid', color: col })}
              className="w-full aspect-square rounded-lg border border-border shadow-xs hover:scale-105 transition-transform"
              style={{ backgroundColor: col }}
              title={col}
            />
          ))}
        </div>
      </div>

      {/* Gradient Presets */}
      <div className="pt-2">
        <div className="text-xs font-semibold text-foreground mb-2">Modern Gradients</div>
        <div className="grid grid-cols-2 gap-2">
          {GRADIENT_PRESETS.map((grad) => (
            <button
              key={grad.name}
              type="button"
              onClick={() =>
                onUpdateBackground({
                  type: 'gradient',
                  gradientType: 'linear',
                  colors: grad.colors,
                  angle: grad.angle
                })
              }
              className="p-3 rounded-xl border border-border shadow-xs hover:scale-[1.02] transition-transform text-left flex flex-col justify-end h-16 relative overflow-hidden"
              style={{
                background: `linear-gradient(${grad.angle}deg, ${grad.colors.join(', ')})`
              }}
            >
              <span className="text-[10px] font-bold text-white drop-shadow-sm">
                {grad.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Presets */}
      <div className="pt-2">
        <div className="text-xs font-semibold text-foreground mb-2">Patterns</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              onUpdateBackground({
                type: 'pattern',
                patternName: 'dots',
                bgColor: '#fafafa',
                patternColor: '#71717a',
                scale: 1,
                opacity: 0.2
              })
            }
            className="p-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors flex items-center justify-center h-12 bg-white"
          >
            Dot Grid
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateBackground({
                type: 'pattern',
                patternName: 'grid',
                bgColor: '#0f172a',
                patternColor: '#38bdf8',
                scale: 1,
                opacity: 0.15
              })
            }
            className="p-3 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-white transition-colors flex items-center justify-center h-12 bg-zinc-900"
          >
            Blueprint Grid
          </button>
        </div>
      </div>
    </div>
  );
};
