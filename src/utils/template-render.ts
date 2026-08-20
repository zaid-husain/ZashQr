import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import type {
  TemplateDocument,
  TextElement,
  QRElement,
  ShapeElement,
  IconElement,
  ImageElement,
  CanvasBackground
} from '../types/template';

// Helper to load image
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

export const renderTemplateToCanvas = async (
  template: TemplateDocument,
  scale = 1
): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(template.width * scale);
  canvas.height = Math.round(template.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D context');

  ctx.save();
  ctx.scale(scale, scale);

  // 1. Render Background
  renderBackground(ctx, template.background, template.width, template.height);

  // 2. Render Elements in zIndex order
  const sortedElements = [...template.elements]
    .filter(el => !el.isHidden)
    .sort((a, b) => a.zIndex - b.zIndex);

  for (const element of sortedElements) {
    ctx.save();
    // Element opacity
    ctx.globalAlpha = element.opacity ?? 1;

    // Element rotation & translation
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    ctx.translate(centerX, centerY);
    if (element.rotation) {
      ctx.rotate((element.rotation * Math.PI) / 180);
    }
    ctx.translate(-centerX, -centerY);

    // Apply shadow if present
    if (element.shadow && element.shadow.blur > 0) {
      ctx.shadowColor = element.shadow.color;
      ctx.shadowBlur = element.shadow.blur;
      ctx.shadowOffsetX = element.shadow.offsetX;
      ctx.shadowOffsetY = element.shadow.offsetY;
    }

    switch (element.type) {
      case 'shape':
        renderShape(ctx, element as ShapeElement);
        break;
      case 'text':
        renderText(ctx, element as TextElement);
        break;
      case 'qr':
        await renderQR(ctx, element as QRElement);
        break;
      case 'image':
        await renderImage(ctx, element as ImageElement);
        break;
      case 'icon':
        renderIconFallback(ctx, element as IconElement);
        break;
    }

    ctx.restore();
  }

  ctx.restore();
  return canvas;
};

const renderBackground = (
  ctx: CanvasRenderingContext2D,
  bg: CanvasBackground,
  width: number,
  height: number
) => {
  if (bg.type === 'solid') {
    ctx.fillStyle = bg.color;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'gradient') {
    const angleRad = ((bg.angle || 0) * Math.PI) / 180;
    const cx = width / 2;
    const cy = height / 2;
    const len = Math.hypot(width, height) / 2;
    const x0 = cx - Math.cos(angleRad) * len;
    const y0 = cy - Math.sin(angleRad) * len;
    const x1 = cx + Math.cos(angleRad) * len;
    const y1 = cy + Math.sin(angleRad) * len;

    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    const step = 1 / Math.max(1, bg.colors.length - 1);
    bg.colors.forEach((col, idx) => {
      grad.addColorStop(idx * step, col);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'pattern') {
    ctx.fillStyle = bg.bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.fillStyle = bg.patternColor;
    ctx.globalAlpha = bg.opacity || 0.15;
    const spacing = 20 * (bg.scale || 1);
    if (bg.patternName === 'dots') {
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (bg.patternName === 'grid') {
      ctx.lineWidth = 1;
      ctx.strokeStyle = bg.patternColor;
      for (let x = 0; x <= width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
};

const renderShape = (ctx: CanvasRenderingContext2D, el: ShapeElement) => {
  const { x, y, width, height, shapeType, fill, stroke, strokeWidth, borderRadius, gradient } = el;
  ctx.save();

  if (gradient) {
    const angleRad = (gradient.angle * Math.PI) / 180;
    const x0 = x + (width / 2) * (1 - Math.cos(angleRad));
    const y0 = y + (height / 2) * (1 - Math.sin(angleRad));
    const x1 = x + (width / 2) * (1 + Math.cos(angleRad));
    const y1 = y + (height / 2) * (1 + Math.sin(angleRad));
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    const step = 1 / Math.max(1, gradient.colors.length - 1);
    gradient.colors.forEach((c, idx) => grad.addColorStop(idx * step, c));
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = fill;
  }

  ctx.strokeStyle = stroke;
  ctx.lineWidth = strokeWidth;

  if (shapeType === 'circle') {
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    if (fill !== 'transparent') ctx.fill();
    if (strokeWidth > 0 && stroke !== 'transparent') ctx.stroke();
  } else if (shapeType === 'line') {
    ctx.beginPath();
    ctx.moveTo(x, y + height / 2);
    ctx.lineTo(x + width, y + height / 2);
    if (strokeWidth > 0) ctx.stroke();
  } else if (shapeType === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    if (fill !== 'transparent') ctx.fill();
    if (strokeWidth > 0) ctx.stroke();
  } else {
    // Rectangle / Rounded Rectangle
    const r = Math.min(borderRadius || 0, width / 2, height / 2);
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, r);
    if (fill !== 'transparent') ctx.fill();
    if (strokeWidth > 0 && stroke !== 'transparent') ctx.stroke();
  }
  ctx.restore();
};

const renderText = (ctx: CanvasRenderingContext2D, el: TextElement) => {
  const {
    x,
    y,
    width,
    height,
    text,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    color,
    textAlign,
    lineHeight,
    letterSpacing,
    textTransform,
    backgroundColor,
    borderRadius,
    padding,
    strokeColor,
    strokeWidth
  } = el;

  ctx.save();

  // Background badge highlight
  if (backgroundColor && backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    const r = borderRadius || 4;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, r);
    ctx.fill();
  }

  let displayText = text;
  if (textTransform === 'uppercase') displayText = displayText.toUpperCase();
  else if (textTransform === 'lowercase') displayText = displayText.toLowerCase();
  else if (textTransform === 'capitalize') {
    displayText = displayText.replace(/\b\w/g, c => c.toUpperCase());
  }

  const lines = displayText.split('\n');
  const fontStyleStr = fontStyle === 'italic' ? 'italic' : 'normal';
  const weightStr = fontWeight || '400';
  ctx.font = `${fontStyleStr} ${weightStr} ${fontSize}px ${fontFamily}, Inter, sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';

  const lineH = fontSize * (lineHeight || 1.2);
  const pad = padding || 0;

  lines.forEach((line, index) => {
    const lineY = y + pad + index * lineH;
    let lineX = x + pad;

    const measuredWidth = ctx.measureText(line).width;
    if (textAlign === 'center') {
      lineX = x + width / 2 - measuredWidth / 2;
    } else if (textAlign === 'right') {
      lineX = x + width - pad - measuredWidth;
    }

    if (letterSpacing && letterSpacing !== 0) {
      // Draw character by character for letter spacing
      let currentX = lineX;
      for (const char of line) {
        if (strokeWidth && strokeColor) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth;
          ctx.strokeText(char, currentX, lineY);
        }
        ctx.fillText(char, currentX, lineY);
        currentX += ctx.measureText(char).width + letterSpacing;
      }
    } else {
      if (strokeWidth && strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(line, lineX, lineY);
      }
      ctx.fillText(line, lineX, lineY);
    }
  });

  ctx.restore();
};

const renderQR = async (ctx: CanvasRenderingContext2D, el: QRElement) => {
  const {
    x,
    y,
    width,
    height,
    value,
    fgColor,
    bgColor,
    isTransparentBg,
    moduleStyle,
    finderStyle,
    errorCorrectionLevel,
    padding,
    borderRadius,
    borderColor,
    borderWidth,
    logoUrl
  } = el;

  if (!value) return;

  try {
    const qr = QRCode.create(value, { errorCorrectionLevel: errorCorrectionLevel || 'M', margin: 0 } as any);
    const qrData = qr.modules;
    const moduleSize = qrData.size;

    ctx.save();

    // Draw QR background
    const size = Math.min(width, height);
    const r = borderRadius || 0;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, r);
    if (!isTransparentBg) {
      ctx.fillStyle = bgColor || '#ffffff';
      ctx.fill();
    }
    if (borderWidth && borderColor && borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }

    const pad = padding || 16;
    const innerSize = size - pad * 2;
    const cellSize = innerSize / moduleSize;

    // Logo area calculation
    const logoScale = 0.26;
    const logoModules = logoUrl ? Math.max(3, Math.floor(moduleSize * logoScale)) : 0;
    const logoOffset = Math.floor((moduleSize - logoModules) / 2);

    const inLogoArea = (row: number, col: number) => {
      if (!logoUrl) return false;
      const p = 1;
      return (
        row >= logoOffset - p &&
        row < logoOffset + logoModules + p &&
        col >= logoOffset - p &&
        col < logoOffset + logoModules + p
      );
    };

    const isFinderModule = (row: number, col: number) => {
      if (row < 7 && col < 7) return true;
      if (row < 7 && col >= moduleSize - 7) return true;
      if (row >= moduleSize - 7 && col < 7) return true;
      return false;
    };

    ctx.fillStyle = fgColor;

    // Draw Modules
    for (let row = 0; row < moduleSize; row++) {
      for (let col = 0; col < moduleSize; col++) {
        const isDark = qrData.data[row * moduleSize + col];
        if (!isDark || inLogoArea(row, col) || isFinderModule(row, col)) continue;

        const mx = x + pad + col * cellSize;
        const my = y + pad + row * cellSize;

        if (moduleStyle === 'dots') {
          ctx.beginPath();
          ctx.arc(mx + cellSize / 2, my + cellSize / 2, (cellSize / 2) * 0.88, 0, Math.PI * 2);
          ctx.fill();
        } else if (moduleStyle === 'rounded') {
          const rx = cellSize * 0.35;
          ctx.beginPath();
          ctx.roundRect(mx + cellSize * 0.05, my + cellSize * 0.05, cellSize * 0.9, cellSize * 0.9, rx);
          ctx.fill();
        } else {
          // Classic square
          ctx.fillRect(mx, my, cellSize + 0.1, cellSize + 0.1);
        }
      }
    }

    // Draw 3 Finders
    const drawFinder = (startCol: number, startRow: number) => {
      const fx = x + pad + startCol * cellSize;
      const fy = y + pad + startRow * cellSize;
      const finderDim = 7 * cellSize;

      if (finderStyle === 'rounded') {
        const outerRx = cellSize * 1.6;
        const innerRx = cellSize * 0.9;
        ctx.fillStyle = fgColor;
        ctx.beginPath();
        ctx.roundRect(fx, fy, finderDim, finderDim, outerRx);
        ctx.fill();

        ctx.fillStyle = bgColor || '#ffffff';
        ctx.beginPath();
        ctx.roundRect(fx + cellSize, fy + cellSize, finderDim - 2 * cellSize, finderDim - 2 * cellSize, outerRx * 0.75);
        ctx.fill();

        ctx.fillStyle = fgColor;
        ctx.beginPath();
        ctx.roundRect(fx + 2 * cellSize, fy + 2 * cellSize, 3 * cellSize, 3 * cellSize, innerRx);
        ctx.fill();
      } else {
        ctx.fillStyle = fgColor;
        ctx.fillRect(fx, fy, finderDim, finderDim);

        ctx.fillStyle = bgColor || '#ffffff';
        ctx.fillRect(fx + cellSize, fy + cellSize, finderDim - 2 * cellSize, finderDim - 2 * cellSize);

        ctx.fillStyle = fgColor;
        ctx.fillRect(fx + 2 * cellSize, fy + 2 * cellSize, 3 * cellSize, 3 * cellSize);
      }
    };

    drawFinder(0, 0);
    drawFinder(moduleSize - 7, 0);
    drawFinder(0, moduleSize - 7);

    // Draw Center Logo
    if (logoUrl) {
      try {
        const logoImg = await loadImage(logoUrl);
        const logoPixelSize = (logoModules + 0.5) * cellSize;
        const lx = x + pad + (innerSize - logoPixelSize) / 2;
        const ly = y + pad + (innerSize - logoPixelSize) / 2;

        ctx.fillStyle = bgColor || '#ffffff';
        ctx.beginPath();
        ctx.roundRect(lx - 4, ly - 4, logoPixelSize + 8, logoPixelSize + 8, 8);
        ctx.fill();

        ctx.drawImage(logoImg, lx, ly, logoPixelSize, logoPixelSize);
      } catch (err) {
        console.warn('Failed to load center logo image:', err);
      }
    }

    ctx.restore();
  } catch (e) {
    console.error('QR Render Error:', e);
  }
};

const renderImage = async (ctx: CanvasRenderingContext2D, el: ImageElement) => {
  if (!el.src) return;
  try {
    const img = await loadImage(el.src);
    const { x, y, width, height, borderRadius, borderWidth, borderColor } = el;

    ctx.save();
    if (borderRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, borderRadius);
      ctx.clip();
    }

    ctx.drawImage(img, x, y, width, height);

    if (borderWidth && borderColor && borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }
    ctx.restore();
  } catch (err) {
    console.warn('Failed to load image in renderImage:', err);
  }
};

const renderIconFallback = (ctx: CanvasRenderingContext2D, el: IconElement) => {
  // Simple icon shape fallback
  const { x, y, width, height, color } = el;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export const exportTemplateAsPNG = async (
  template: TemplateDocument,
  scale = 2,
  filename = 'qr-template'
): Promise<void> => {
  const canvas = await renderTemplateToCanvas(template, scale);
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTemplateAsJPG = async (
  template: TemplateDocument,
  quality = 0.95,
  scale = 2,
  filename = 'qr-template'
): Promise<void> => {
  const canvas = await renderTemplateToCanvas(template, scale);
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTemplateAsPDF = async (
  template: TemplateDocument,
  filename = 'qr-template'
): Promise<void> => {
  const isLandscape = template.width > template.height;
  const canvas = await renderTemplateToCanvas(template, 3); // Crisp 3x render for PDF print
  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: [template.width, template.height]
  });

  doc.addImage(imgData, 'JPEG', 0, 0, template.width, template.height);
  doc.save(`${filename.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

export const downloadTemplateSVG = (
  template: TemplateDocument,
  filename = 'qr-template'
): void => {
  const { width, height, background, elements } = template;
  let bgSvg = '';
  if (background.type === 'solid') {
    bgSvg = `<rect width="100%" height="100%" fill="${background.color}" />`;
  } else if (background.type === 'gradient') {
    const stops = background.colors
      .map((c, i) => `<stop offset="${(i / Math.max(1, background.colors.length - 1)) * 100}%" stop-color="${c}" />`)
      .join('');
    bgSvg = `<defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">${stops}</linearGradient></defs><rect width="100%" height="100%" fill="url(#bgGrad)" />`;
  }

  const elementsSvg = elements
    .filter(el => !el.isHidden)
    .sort((a, b) => a.zIndex - b.zIndex)
    .map(el => {
      if (el.type === 'shape') {
        const shape = el as ShapeElement;
        if (shape.shapeType === 'circle') {
          return `<circle cx="${shape.x + shape.width / 2}" cy="${shape.y + shape.height / 2}" r="${shape.width / 2}" fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}" />`;
        }
        return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" rx="${shape.borderRadius || 0}" fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}" />`;
      }
      if (el.type === 'text') {
        const txt = el as TextElement;
        return `<text x="${txt.x}" y="${txt.y + txt.fontSize}" font-family="${txt.fontFamily}, sans-serif" font-size="${txt.fontSize}" font-weight="${txt.fontWeight}" fill="${txt.color}" opacity="${txt.opacity}">${txt.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`;
      }
      return '';
    })
    .join('\n');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${bgSvg}
  ${elementsSvg}
</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/\s+/g, '-').toLowerCase()}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copyTemplateImageToClipboard = async (
  template: TemplateDocument
): Promise<boolean> => {
  try {
    const canvas = await renderTemplateToCanvas(template, 2);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(false);
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          resolve(true);
        } catch {
          resolve(false);
        }
      }, 'image/png');
    });
  } catch {
    return false;
  }
};
