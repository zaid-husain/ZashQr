import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  TemplateDocument,
  TemplateElement,
  CanvasBackground
} from '../types/template';
import { saveEditorDraft } from '../utils/storage';

export interface SnapGuide {
  type: 'x' | 'y';
  position: number;
}

export function useTemplateEditor(initialTemplate: TemplateDocument) {
  // History states
  const [past, setPast] = useState<TemplateDocument[]>([]);
  const [present, setPresent] = useState<TemplateDocument>(() => {
    return initialTemplate;
  });
  const [future, setFuture] = useState<TemplateDocument[]>([]);

  // Selection & Canvas UI state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Auto-save debounced timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Save to history helper
  const recordChange = useCallback((newDoc: TemplateDocument) => {
    setPast((prev) => [...prev.slice(-35), present]);
    setPresent(newDoc);
    setFuture([]);
    setIsSaved(false);

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      saveEditorDraft(newDoc);
      setIsSaved(true);
    }, 1000);
  }, [present]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setFuture((prev) => [present, ...prev]);
    setPresent(previous);
    setIsSaved(false);
  }, [past, present]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast((prev) => [...prev, present]);
    setPresent(next);
    setFuture(newFuture);
    setIsSaved(false);
  }, [future, present]);

  // Selected element derived
  const selectedElement = present.elements.find((el) => el.id === selectedId) || null;

  // Selection setter
  const selectElement = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  // Update specific element
  const updateElement = useCallback(
    (id: string, updates: Partial<TemplateElement>) => {
      const updatedElements = present.elements.map((el) => {
        if (el.id !== id) return el;
        return { ...el, ...updates } as TemplateElement;
      });
      const newDoc: TemplateDocument = {
        ...present,
        elements: updatedElements,
        updatedAt: Date.now()
      };
      recordChange(newDoc);
    },
    [present, recordChange]
  );

  // Add a new element
  const addElement = useCallback(
    (elementData: Partial<TemplateElement> & { type: TemplateElement['type'] }) => {
      const maxZIndex = present.elements.reduce((max, el) => Math.max(max, el.zIndex || 0), 0);
      const newId = `elem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      const newElement: TemplateElement = {
        id: newId,
        name: elementData.name || `${elementData.type.toUpperCase()}`,
        x: elementData.x ?? Math.round(present.width / 2 - (elementData.width ?? 180) / 2),
        y: elementData.y ?? Math.round(present.height / 2 - (elementData.height ?? 60) / 2),
        width: elementData.width ?? 200,
        height: elementData.height ?? 60,
        rotation: elementData.rotation ?? 0,
        opacity: elementData.opacity ?? 1,
        zIndex: maxZIndex + 1,
        ...elementData
      } as TemplateElement;

      const newDoc: TemplateDocument = {
        ...present,
        elements: [...present.elements, newElement],
        updatedAt: Date.now()
      };
      recordChange(newDoc);
      setSelectedId(newId);
    },
    [present, recordChange]
  );

  // Duplicate an element
  const duplicateElement = useCallback(
    (id: string) => {
      const target = present.elements.find((el) => el.id === id);
      if (!target) return;

      const maxZIndex = present.elements.reduce((max, el) => Math.max(max, el.zIndex || 0), 0);
      const newId = `elem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const duplicated: TemplateElement = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        x: target.x + 20,
        y: target.y + 20,
        zIndex: maxZIndex + 1
      };

      const newDoc: TemplateDocument = {
        ...present,
        elements: [...present.elements, duplicated],
        updatedAt: Date.now()
      };
      recordChange(newDoc);
      setSelectedId(newId);
    },
    [present, recordChange]
  );

  // Delete an element
  const deleteElement = useCallback(
    (id: string) => {
      const remaining = present.elements.filter((el) => el.id !== id);
      const newDoc: TemplateDocument = {
        ...present,
        elements: remaining,
        updatedAt: Date.now()
      };
      recordChange(newDoc);
      if (selectedId === id) setSelectedId(null);
    },
    [present, recordChange, selectedId]
  );

  // Reorder element z-index
  const reorderElement = useCallback(
    (id: string, direction: 'front' | 'back' | 'forward' | 'backward') => {
      const index = present.elements.findIndex((el) => el.id === id);
      if (index === -1) return;

      const newElements = [...present.elements];
      const target = newElements[index];

      if (direction === 'front') {
        const maxZ = newElements.reduce((m, el) => Math.max(m, el.zIndex), 0);
        target.zIndex = maxZ + 1;
      } else if (direction === 'back') {
        const minZ = newElements.reduce((m, el) => Math.min(m, el.zIndex), 0);
        target.zIndex = Math.max(0, minZ - 1);
      } else if (direction === 'forward') {
        target.zIndex += 1;
      } else if (direction === 'backward') {
        target.zIndex = Math.max(0, target.zIndex - 1);
      }

      const newDoc: TemplateDocument = {
        ...present,
        elements: newElements,
        updatedAt: Date.now()
      };
      recordChange(newDoc);
    },
    [present, recordChange]
  );

  // Toggle lock
  const toggleLockElement = useCallback(
    (id: string) => {
      updateElement(id, { isLocked: !present.elements.find((el) => el.id === id)?.isLocked });
    },
    [present.elements, updateElement]
  );

  // Toggle hide
  const toggleHideElement = useCallback(
    (id: string) => {
      updateElement(id, { isHidden: !present.elements.find((el) => el.id === id)?.isHidden });
    },
    [present.elements, updateElement]
  );

  // Update Background
  const updateBackground = useCallback(
    (background: CanvasBackground) => {
      const newDoc: TemplateDocument = {
        ...present,
        background,
        updatedAt: Date.now()
      };
      recordChange(newDoc);
    },
    [present, recordChange]
  );

  // Update Dimensions
  const updateDimensions = useCallback(
    (width: number, height: number) => {
      const newDoc: TemplateDocument = {
        ...present,
        width,
        height,
        updatedAt: Date.now()
      };
      recordChange(newDoc);
    },
    [present, recordChange]
  );

  // Update Document Meta
  const updateDocumentMeta = useCallback(
    (meta: Partial<Pick<TemplateDocument, 'name' | 'category' | 'style' | 'tags'>>) => {
      const newDoc: TemplateDocument = {
        ...present,
        ...meta,
        updatedAt: Date.now()
      };
      recordChange(newDoc);
    },
    [present, recordChange]
  );

  // Load new template into editor
  const loadTemplate = useCallback((template: TemplateDocument) => {
    setPast([]);
    setPresent(template);
    setFuture([]);
    setSelectedId(null);
    setIsSaved(true);
  }, []);

  // Zoom controls
  const zoomIn = useCallback(() => setZoom((z) => Math.min(2.5, Math.round((z + 0.1) * 10) / 10)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.2, Math.round((z - 0.1) * 10) / 10)), []);
  const zoomFit = useCallback((viewportWidth: number, viewportHeight: number) => {
    const margin = 80;
    const scaleX = (viewportWidth - margin) / present.width;
    const scaleY = (viewportHeight - margin) / present.height;
    const fitScale = Math.min(scaleX, scaleY, 1.2);
    setZoom(Math.max(0.3, Math.round(fitScale * 100) / 100));
  }, [present.width, present.height]);

  // Keyboard shortcut listeners (Undo/Redo/Delete/Duplicate/Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        if (selectedId) {
          e.preventDefault();
          duplicateElement(selectedId);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && !selectedElement?.isLocked) {
          e.preventDefault();
          deleteElement(selectedId);
        }
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      } else if (selectedId && !selectedElement?.isLocked && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const currentX = selectedElement?.x || 0;
        const currentY = selectedElement?.y || 0;
        if (e.key === 'ArrowUp') updateElement(selectedId, { y: currentY - step });
        if (e.key === 'ArrowDown') updateElement(selectedId, { y: currentY + step });
        if (e.key === 'ArrowLeft') updateElement(selectedId, { x: currentX - step });
        if (e.key === 'ArrowRight') updateElement(selectedId, { x: currentX + step });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedId, selectedElement, duplicateElement, deleteElement, updateElement]);

  return {
    document: present,
    selectedId,
    selectedElement,
    zoom,
    snapGuides,
    isSaved,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    selectElement,
    updateElement,
    addElement,
    duplicateElement,
    deleteElement,
    reorderElement,
    toggleLockElement,
    toggleHideElement,
    updateBackground,
    updateDimensions,
    updateDocumentMeta,
    loadTemplate,
    undo,
    redo,
    setZoom,
    zoomIn,
    zoomOut,
    zoomFit,
    setSnapGuides
  };
}
