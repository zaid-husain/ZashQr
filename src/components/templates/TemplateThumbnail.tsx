import React from 'react';
import type { TemplateDocument, ShapeElement, TextElement, QRElement } from '../../types/template';

interface TemplateThumbnailProps {
  template: TemplateDocument;
  className?: string;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({ template, className }) => {
  const { width, height, background, elements } = template;

  const renderBackground = () => {
    if (background.type === 'solid') {
      return <rect width="100%" height="100%" fill={background.color} />;
    }
    if (background.type === 'gradient') {
      const gradId = `grad-${template.id}`;
      const stops = background.colors.map((c, i) => (
        <stop
          key={i}
          offset={`${(i / Math.max(1, background.colors.length - 1)) * 100}%`}
          stopColor={c}
        />
      ));
      return (
        <>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              {stops}
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gradId})`} />
        </>
      );
    }
    if (background.type === 'pattern') {
      return (
        <g>
          <rect width="100%" height="100%" fill={background.bgColor} />
          <circle cx="50" cy="50" r="2" fill={background.patternColor} opacity={background.opacity || 0.2} />
        </g>
      );
    }
    return <rect width="100%" height="100%" fill="#18181b" />;
  };

  const sortedElements = [...elements]
    .filter(el => !el.isHidden)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className={`w-full h-full relative overflow-hidden flex items-center justify-center ${className || ''}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full object-contain pointer-events-none select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {renderBackground()}

        {sortedElements.map((el) => {
          const transform = el.rotation
            ? `rotate(${el.rotation} ${el.x + el.width / 2} ${el.y + el.height / 2})`
            : undefined;

          if (el.type === 'shape') {
            const shape = el as ShapeElement;
            if (shape.shapeType === 'circle') {
              return (
                <circle
                  key={el.id}
                  cx={shape.x + shape.width / 2}
                  cy={shape.y + shape.height / 2}
                  r={shape.width / 2}
                  fill={shape.fill}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  opacity={shape.opacity}
                  transform={transform}
                />
              );
            }
            return (
              <rect
                key={el.id}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                rx={shape.borderRadius || 0}
                fill={shape.fill}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
                opacity={shape.opacity}
                transform={transform}
              />
            );
          }

          if (el.type === 'text') {
            const txt = el as TextElement;
            const lines = txt.text.split('\n');
            const lineH = txt.fontSize * (txt.lineHeight || 1.2);
            let textAnchor: 'start' | 'middle' | 'end' = 'start';
            let tx = txt.x;
            if (txt.textAlign === 'center') {
              textAnchor = 'middle';
              tx = txt.x + txt.width / 2;
            } else if (txt.textAlign === 'right') {
              textAnchor = 'end';
              tx = txt.x + txt.width;
            }

            return (
              <g key={el.id} opacity={txt.opacity} transform={transform}>
                {txt.backgroundColor && txt.backgroundColor !== 'transparent' && (
                  <rect
                    x={txt.x}
                    y={txt.y}
                    width={txt.width}
                    height={txt.height}
                    rx={txt.borderRadius || 4}
                    fill={txt.backgroundColor}
                  />
                )}
                <text
                  x={tx}
                  y={txt.y + txt.fontSize * 0.9 + (txt.padding || 0)}
                  fontFamily={txt.fontFamily}
                  fontSize={txt.fontSize}
                  fontWeight={txt.fontWeight}
                  fill={txt.color}
                  textAnchor={textAnchor}
                  letterSpacing={txt.letterSpacing ? `${txt.letterSpacing}px` : undefined}
                >
                  {lines.map((line, idx) => (
                    <tspan key={idx} x={tx} dy={idx === 0 ? 0 : lineH}>
                      {txt.textTransform === 'uppercase'
                        ? line.toUpperCase()
                        : txt.textTransform === 'lowercase'
                        ? line.toLowerCase()
                        : line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          }

          if (el.type === 'qr') {
            const qr = el as QRElement;
            const size = Math.min(qr.width, qr.height);
            const pad = qr.padding || 14;
            const inner = size - pad * 2;
            const cell = inner / 21;

            return (
              <g key={el.id} opacity={qr.opacity} transform={transform}>
                {/* QR Background */}
                <rect
                  x={qr.x}
                  y={qr.y}
                  width={size}
                  height={size}
                  rx={qr.borderRadius || 12}
                  fill={qr.isTransparentBg ? 'none' : qr.bgColor}
                  stroke={qr.borderColor || 'none'}
                  strokeWidth={qr.borderWidth || 0}
                />
                {/* Simplified Finder 1 */}
                <rect
                  x={qr.x + pad}
                  y={qr.y + pad}
                  width={7 * cell}
                  height={7 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell * 1.5 : 0}
                  fill={qr.fgColor}
                />
                <rect
                  x={qr.x + pad + cell}
                  y={qr.y + pad + cell}
                  width={5 * cell}
                  height={5 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell : 0}
                  fill={qr.bgColor}
                />
                <rect
                  x={qr.x + pad + 2 * cell}
                  y={qr.y + pad + 2 * cell}
                  width={3 * cell}
                  height={3 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell * 0.8 : 0}
                  fill={qr.fgColor}
                />

                {/* Simplified Finder 2 */}
                <rect
                  x={qr.x + pad + 14 * cell}
                  y={qr.y + pad}
                  width={7 * cell}
                  height={7 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell * 1.5 : 0}
                  fill={qr.fgColor}
                />
                <rect
                  x={qr.x + pad + 15 * cell}
                  y={qr.y + pad + cell}
                  width={5 * cell}
                  height={5 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell : 0}
                  fill={qr.bgColor}
                />
                <rect
                  x={qr.x + pad + 16 * cell}
                  y={qr.y + pad + 2 * cell}
                  width={3 * cell}
                  height={3 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell * 0.8 : 0}
                  fill={qr.fgColor}
                />

                {/* Simplified Finder 3 */}
                <rect
                  x={qr.x + pad}
                  y={qr.y + pad + 14 * cell}
                  width={7 * cell}
                  height={7 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell * 1.5 : 0}
                  fill={qr.fgColor}
                />
                <rect
                  x={qr.x + pad + cell}
                  y={qr.y + pad + 15 * cell}
                  width={5 * cell}
                  height={5 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell : 0}
                  fill={qr.bgColor}
                />
                <rect
                  x={qr.x + pad + 2 * cell}
                  y={qr.y + pad + 16 * cell}
                  width={3 * cell}
                  height={3 * cell}
                  rx={qr.finderStyle === 'rounded' ? cell * 0.8 : 0}
                  fill={qr.fgColor}
                />

                {/* Representative Data Dots */}
                {[
                  [8, 2], [9, 4], [11, 3], [12, 5], [8, 8], [10, 10], [12, 12],
                  [3, 8], [5, 9], [9, 14], [11, 16], [15, 8], [17, 10], [14, 14],
                  [18, 16], [16, 18], [10, 18], [8, 16]
                ].map(([col, row], i) => (
                  <rect
                    key={i}
                    x={qr.x + pad + col * cell}
                    y={qr.y + pad + row * cell}
                    width={cell * 0.9}
                    height={cell * 0.9}
                    rx={qr.moduleStyle === 'dots' ? cell / 2 : qr.moduleStyle === 'rounded' ? cell * 0.3 : 0}
                    fill={qr.fgColor}
                  />
                ))}
              </g>
            );
          }

          return null;
        })}
      </svg>
    </div>
  );
};
