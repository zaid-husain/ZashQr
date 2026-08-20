import React, { useState, useRef, useEffect } from 'react';
import type {
  TemplateElement,
  TextElement,
  QRElement,
  ShapeElement,
  IconElement,
  ImageElement
} from '../../types/template';
import { QRCodeSVG } from '../preview/QRCodeSVG';
import { cn } from '../../utils/cn';

interface CanvasElementProps {
  element: TemplateElement;
  isSelected: boolean;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onUpdate: (id: string, updates: Partial<TemplateElement>) => void;
  onSnapChange?: (guides: { type: 'x' | 'y'; position: number }[]) => void;
}

type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rot';

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  zoom,
  canvasWidth,
  canvasHeight,
  onSelect,
  onUpdate,
  onSnapChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [, setIsResizing] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [textVal, setTextVal] = useState(element.type === 'text' ? (element as TextElement).text : '');

  const elementRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; elX: number; elY: number }>({
    startX: 0,
    startY: 0,
    elX: 0,
    elY: 0
  });
  const resizeStartRef = useRef<{
    handle: HandleType;
    startX: number;
    startY: number;
    elX: number;
    elY: number;
    elW: number;
    elH: number;
  }>({
    handle: 'se',
    startX: 0,
    startY: 0,
    elX: 0,
    elY: 0,
    elW: 0,
    elH: 0
  });

  // Sync text value if element text changes externally
  useEffect(() => {
    if (element.type === 'text') {
      setTextVal((element as TextElement).text);
    }
  }, [element]);

  // Drag handler
  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.isLocked || isEditingText) return;
    if (e.button !== 0) return; // only left click
    e.stopPropagation();
    onSelect(element.id, e);

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elX: element.x,
      elY: element.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - dragStartRef.current.startX) / zoom;
      const dy = (moveEvent.clientY - dragStartRef.current.startY) / zoom;

      let newX = Math.round(dragStartRef.current.elX + dx);
      let newY = Math.round(dragStartRef.current.elY + dy);

      // Snap guides calculation
      const guides: { type: 'x' | 'y'; position: number }[] = [];
      const snapThreshold = 6;

      // Snap horizontal center
      const centerX = newX + element.width / 2;
      const canvasCenterX = canvasWidth / 2;
      if (Math.abs(centerX - canvasCenterX) < snapThreshold) {
        newX = canvasCenterX - element.width / 2;
        guides.push({ type: 'x', position: canvasCenterX });
      }

      // Snap vertical center
      const centerY = newY + element.height / 2;
      const canvasCenterY = canvasHeight / 2;
      if (Math.abs(centerY - canvasCenterY) < snapThreshold) {
        newY = canvasCenterY - element.height / 2;
        guides.push({ type: 'y', position: canvasCenterY });
      }

      // Snap to canvas left/top/right/bottom edges
      if (Math.abs(newX) < snapThreshold) {
        newX = 0;
        guides.push({ type: 'x', position: 0 });
      }
      if (Math.abs(newX + element.width - canvasWidth) < snapThreshold) {
        newX = canvasWidth - element.width;
        guides.push({ type: 'x', position: canvasWidth });
      }
      if (Math.abs(newY) < snapThreshold) {
        newY = 0;
        guides.push({ type: 'y', position: 0 });
      }
      if (Math.abs(newY + element.height - canvasHeight) < snapThreshold) {
        newY = canvasHeight - element.height;
        guides.push({ type: 'y', position: canvasHeight });
      }

      if (onSnapChange) onSnapChange(guides);
      onUpdate(element.id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (onSnapChange) onSnapChange([]);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Resize handler
  const handleResizeStart = (handle: HandleType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.isLocked) return;

    setIsResizing(true);
    resizeStartRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      elX: element.x,
      elY: element.y,
      elW: element.width,
      elH: element.height
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - resizeStartRef.current.startX) / zoom;
      const dy = (moveEvent.clientY - resizeStartRef.current.startY) / zoom;

      let { elX, elY, elW, elH } = resizeStartRef.current;
      const isQR = element.type === 'qr';

      if (handle === 'e' || handle === 'se' || handle === 'ne') {
        elW = Math.max(20, elW + dx);
      }
      if (handle === 'w' || handle === 'sw' || handle === 'nw') {
        const newW = Math.max(20, elW - dx);
        elX += elW - newW;
        elW = newW;
      }
      if (handle === 's' || handle === 'se' || handle === 'sw') {
        elH = Math.max(20, elH + dy);
      }
      if (handle === 'n' || handle === 'ne' || handle === 'nw') {
        const newH = Math.max(20, elH - dy);
        elY += elH - newH;
        elH = newH;
      }

      // For QR, keep square 1:1 ratio
      if (isQR) {
        const size = Math.max(elW, elH);
        elW = size;
        elH = size;
      }

      onUpdate(element.id, {
        x: Math.round(elX),
        y: Math.round(elY),
        width: Math.round(elW),
        height: Math.round(elH)
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Rotation handler
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.isLocked) return;

    const elBox = elementRef.current?.getBoundingClientRect();
    if (!elBox) return;

    const centerX = elBox.left + elBox.width / 2;
    const centerY = elBox.top + elBox.height / 2;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const radians = Math.atan2(moveEvent.clientX - centerX, -(moveEvent.clientY - centerY));
      let degrees = Math.round((radians * (180 / Math.PI)));
      if (degrees < 0) degrees += 360;

      // Snap to 0, 90, 180, 270 degrees
      if (Math.abs(degrees - 0) < 5 || Math.abs(degrees - 360) < 5) degrees = 0;
      else if (Math.abs(degrees - 90) < 5) degrees = 90;
      else if (Math.abs(degrees - 180) < 5) degrees = 180;
      else if (Math.abs(degrees - 270) < 5) degrees = 270;

      onUpdate(element.id, { rotation: degrees });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === 'text') {
      e.stopPropagation();
      setIsEditingText(true);
    }
  };

  if (element.isHidden) return null;

  // Render Inner Content
  const renderContent = () => {
    if (element.type === 'text') {
      const txt = element as TextElement;
      if (isEditingText) {
        return (
          <textarea
            autoFocus
            value={textVal}
            onChange={(e) => {
              setTextVal(e.target.value);
              onUpdate(element.id, { text: e.target.value });
            }}
            onBlur={() => setIsEditingText(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsEditingText(false);
            }}
            className="w-full h-full bg-transparent resize-none border-none outline-none p-0 overflow-hidden"
            style={{
              fontFamily: txt.fontFamily,
              fontSize: `${txt.fontSize}px`,
              fontWeight: txt.fontWeight,
              color: txt.color,
              textAlign: txt.textAlign,
              lineHeight: txt.lineHeight || 1.2,
              letterSpacing: txt.letterSpacing ? `${txt.letterSpacing}px` : undefined,
              textTransform: txt.textTransform
            }}
          />
        );
      }

      return (
        <div
          className="w-full h-full whitespace-pre-wrap select-none flex flex-col justify-center"
          style={{
            fontFamily: txt.fontFamily,
            fontSize: `${txt.fontSize}px`,
            fontWeight: txt.fontWeight,
            fontStyle: txt.fontStyle || 'normal',
            color: txt.color,
            textAlign: txt.textAlign,
            lineHeight: txt.lineHeight || 1.2,
            letterSpacing: txt.letterSpacing ? `${txt.letterSpacing}px` : undefined,
            textTransform: txt.textTransform,
            backgroundColor: txt.backgroundColor || 'transparent',
            borderRadius: `${txt.borderRadius || 0}px`,
            padding: txt.padding ? `${txt.padding}px` : undefined
          }}
        >
          {txt.text}
        </div>
      );
    }

    if (element.type === 'qr') {
      const qr = element as QRElement;
      const size = Math.min(qr.width, qr.height);
      return (
        <div
          className="w-full h-full flex items-center justify-center select-none"
          style={{
            backgroundColor: qr.isTransparentBg ? 'transparent' : qr.bgColor,
            borderRadius: `${qr.borderRadius || 0}px`,
            border: qr.borderWidth && qr.borderColor ? `${qr.borderWidth}px solid ${qr.borderColor}` : undefined
          }}
        >
          <QRCodeSVG
            value={qr.value || 'https://qrstudio.app'}
            fgColor={qr.fgColor}
            bgColor={qr.isTransparentBg ? 'transparent' : qr.bgColor}
            moduleStyle={qr.moduleStyle}
            finderStyle={qr.finderStyle}
            logoUrl={qr.logoUrl}
            size={size}
            errorCorrectionLevel={qr.errorCorrectionLevel}
          />
        </div>
      );
    }

    if (element.type === 'shape') {
      const shape = element as ShapeElement;
      if (shape.shapeType === 'circle') {
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: shape.fill,
              border: shape.strokeWidth > 0 ? `${shape.strokeWidth}px ${shape.strokeStyle} ${shape.stroke}` : undefined,
              borderRadius: '50%'
            }}
          />
        );
      }
      if (shape.shapeType === 'line') {
        return (
          <div className="w-full h-full flex items-center">
            <div
              className="w-full"
              style={{
                height: `${Math.max(1, shape.strokeWidth || 1)}px`,
                backgroundColor: shape.fill || shape.stroke
              }}
            />
          </div>
        );
      }
      return (
        <div
          className="w-full h-full"
          style={{
            backgroundColor: shape.fill,
            border: shape.strokeWidth > 0 ? `${shape.strokeWidth}px ${shape.strokeStyle} ${shape.stroke}` : undefined,
            borderRadius: `${shape.borderRadius || 0}px`
          }}
        />
      );
    }

    if (element.type === 'image') {
      const img = element as ImageElement;
      return (
        <img
          src={img.src}
          alt={img.alt || 'Template Image'}
          className="w-full h-full select-none pointer-events-none"
          style={{
            objectFit: img.objectFit || 'cover',
            borderRadius: `${img.borderRadius || 0}px`
          }}
        />
      );
    }

    if (element.type === 'icon') {
      const ic = element as IconElement;
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ color: ic.color }}
        >
          <div className="w-4/5 h-4/5 rounded-full bg-current opacity-80" />
        </div>
      );
    }

    return null;
  };

  const shadowStyle = element.shadow && element.shadow.blur > 0
    ? `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}`
    : undefined;

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "absolute cursor-move group select-none transition-shadow",
        isDragging ? "opacity-80" : ""
      )}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        opacity: element.opacity ?? 1,
        zIndex: element.zIndex,
        boxShadow: shadowStyle
      }}
    >
      {/* Content wrapper */}
      <div className="w-full h-full relative overflow-hidden">
        {renderContent()}
      </div>

      {/* Selection Bounding Box & Handles */}
      {isSelected && !element.isLocked && (
        <div className="absolute -inset-1 border-2 border-blue-500 pointer-events-none rounded-xs">
          {/* Top Rotation Handle */}
          <div
            onMouseDown={handleRotateStart}
            title="Drag to rotate"
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-xs pointer-events-auto cursor-grab hover:bg-blue-50"
          />

          {/* 8 Bounding Box Resize Handles */}
          <div
            onMouseDown={(e) => handleResizeStart('nw', e)}
            className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-nwse-resize shadow-xs hover:scale-125"
          />
          <div
            onMouseDown={(e) => handleResizeStart('n', e)}
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-ns-resize shadow-xs hover:scale-125"
          />
          <div
            onMouseDown={(e) => handleResizeStart('ne', e)}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-nesw-resize shadow-xs hover:scale-125"
          />
          <div
            onMouseDown={(e) => handleResizeStart('e', e)}
            className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-ew-resize shadow-xs hover:scale-125"
          />
          <div
            onMouseDown={(e) => handleResizeStart('se', e)}
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-nwse-resize shadow-xs hover:scale-125"
          />
          <div
            onMouseDown={(e) => handleResizeStart('s', e)}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-ns-resize shadow-xs hover:scale-125"
          />
          <div
            onMouseDown={(e) => handleResizeStart('sw', e)}
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-nesw-resize shadow-xs hover:scale-125"
          />
          <div
            onMouseDown={(e) => handleResizeStart('w', e)}
            className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-ew-resize shadow-xs hover:scale-125"
          />
        </div>
      )}
    </div>
  );
};
