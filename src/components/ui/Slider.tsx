import React from 'react';
import { cn } from '../../utils/cn';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: string | number;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  valueDisplay,
  className,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {(label || valueDisplay !== undefined) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-medium text-foreground/80">{label}</span>}
          {valueDisplay !== undefined && (
            <span className="text-muted-foreground font-mono text-[11px]">{valueDisplay}</span>
          )}
        </div>
      )}
      <input
        type="range"
        className={cn(
          "w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-1 focus:ring-ring",
          className
        )}
        {...props}
      />
    </div>
  );
};
