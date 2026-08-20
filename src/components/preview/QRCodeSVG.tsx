import React, { useMemo } from 'react';
import * as QRCode from 'qrcode';
import type { QRCodeOptions } from '../../types';

interface QRCodeSVGProps extends QRCodeOptions {
  value: string;
  id?: string;
  className?: string;
}

export const QRCodeSVG: React.FC<QRCodeSVGProps> = ({
  value,
  fgColor,
  bgColor,
  moduleStyle,
  finderStyle,
  logoUrl,
  size,
  errorCorrectionLevel,
  id = 'qr-preview-svg',
  className
}) => {
  const qrData = useMemo(() => {
    try {
      if (!value) return null;
      const qr = QRCode.create(value, { errorCorrectionLevel, margin: 0 } as any);
      return qr.modules;
    } catch (e) {
      console.error('QR creation error:', e);
      return null;
    }
  }, [value, errorCorrectionLevel]);

  if (!qrData || !value) {
    return null;
  }

  const moduleSize = qrData.size;
  const padding = 16; // quiet zone in px
  const innerSize = size - padding * 2;
  const cellSize = innerSize / moduleSize;

  // Calculate logo clearance if logo is present
  const logoScale = 0.26;
  const logoModules = Math.max(3, Math.floor(moduleSize * logoScale));
  const logoOffset = Math.floor((moduleSize - logoModules) / 2);
  
  const inLogoArea = (row: number, col: number) => {
    if (!logoUrl) return false;
    const pad = 1;
    return (
      row >= logoOffset - pad &&
      row < logoOffset + logoModules + pad &&
      col >= logoOffset - pad &&
      col < logoOffset + logoModules + pad
    );
  };

  const isFinderModule = (row: number, col: number) => {
    // Top-Left Finder
    if (row < 7 && col < 7) return true;
    // Top-Right Finder
    if (row < 7 && col >= moduleSize - 7) return true;
    // Bottom-Left Finder
    if (row >= moduleSize - 7 && col < 7) return true;
    return false;
  };

  const moduleElements: React.ReactNode[] = [];

  for (let row = 0; row < moduleSize; row++) {
    for (let col = 0; col < moduleSize; col++) {
      const isDark = qrData.data[row * moduleSize + col];
      if (!isDark) continue;
      if (inLogoArea(row, col)) continue;
      if (isFinderModule(row, col)) continue;

      const x = padding + col * cellSize;
      const y = padding + row * cellSize;
      const key = `mod-${row}-${col}`;

      if (moduleStyle === 'dots') {
        const radius = (cellSize / 2) * 0.88;
        moduleElements.push(
          <circle
            key={key}
            cx={x + cellSize / 2}
            cy={y + cellSize / 2}
            r={radius}
            fill={fgColor}
          />
        );
      } else if (moduleStyle === 'rounded') {
        const radius = cellSize * 0.35;
        moduleElements.push(
          <rect
            key={key}
            x={x + cellSize * 0.05}
            y={y + cellSize * 0.05}
            width={cellSize * 0.9}
            height={cellSize * 0.9}
            rx={radius}
            ry={radius}
            fill={fgColor}
          />
        );
      } else {
        // Square
        moduleElements.push(
          <rect
            key={key}
            x={x}
            y={y}
            width={cellSize + 0.1}
            height={cellSize + 0.1}
            fill={fgColor}
          />
        );
      }
    }
  }

  // Draw 3 Finder Patterns
  const renderFinder = (startCol: number, startRow: number, keyPrefix: string) => {
    const x = padding + startCol * cellSize;
    const y = padding + startRow * cellSize;
    const finderDim = 7 * cellSize;

    if (finderStyle === 'rounded') {
      const outerRx = cellSize * 1.6;
      const innerRx = cellSize * 0.9;
      return (
        <g key={keyPrefix} fill={fgColor}>
          {/* Outer Ring */}
          <rect
            x={x}
            y={y}
            width={finderDim}
            height={finderDim}
            rx={outerRx}
            ry={outerRx}
            fill={fgColor}
          />
          {/* Inner Gap / Cutout */}
          <rect
            x={x + cellSize}
            y={y + cellSize}
            width={finderDim - 2 * cellSize}
            height={finderDim - 2 * cellSize}
            rx={outerRx * 0.75}
            ry={outerRx * 0.75}
            fill={bgColor}
          />
          {/* Center Dot */}
          <rect
            x={x + 2 * cellSize}
            y={y + 2 * cellSize}
            width={3 * cellSize}
            height={3 * cellSize}
            rx={innerRx}
            ry={innerRx}
            fill={fgColor}
          />
        </g>
      );
    }

    // Classic Square Finder
    return (
      <g key={keyPrefix} fill={fgColor}>
        <rect x={x} y={y} width={finderDim} height={finderDim} fill={fgColor} />
        <rect
          x={x + cellSize}
          y={y + cellSize}
          width={finderDim - 2 * cellSize}
          height={finderDim - 2 * cellSize}
          fill={bgColor}
        />
        <rect
          x={x + 2 * cellSize}
          y={y + 2 * cellSize}
          width={3 * cellSize}
          height={3 * cellSize}
          fill={fgColor}
        />
      </g>
    );
  };

  const finders = [
    renderFinder(0, 0, 'finder-tl'),
    renderFinder(moduleSize - 7, 0, 'finder-tr'),
    renderFinder(0, moduleSize - 7, 'finder-bl')
  ];

  // Logo layout
  const logoPixelSize = (logoModules + 0.5) * cellSize;
  const logoX = padding + (innerSize - logoPixelSize) / 2;
  const logoY = padding + (innerSize - logoPixelSize) / 2;

  return (
    <svg
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={className}
      style={{ display: 'block' }}
    >
      {/* Background fill */}
      <rect width="100%" height="100%" fill={bgColor} rx={12} ry={12} />

      {/* Modules and Finders */}
      {moduleElements}
      {finders}

      {/* Center Logo with clean padded badge */}
      {logoUrl && (
        <g>
          <rect
            x={logoX - 4}
            y={logoY - 4}
            width={logoPixelSize + 8}
            height={logoPixelSize + 8}
            fill={bgColor}
            rx={8}
            ry={8}
          />
          <image
            href={logoUrl}
            x={logoX}
            y={logoY}
            width={logoPixelSize}
            height={logoPixelSize}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      )}
    </svg>
  );
};
