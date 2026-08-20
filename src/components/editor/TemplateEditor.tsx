import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { TemplateDocument } from '../../types/template';
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
import { EditorHeader } from './EditorHeader';
import { LeftSidebar } from './LeftSidebar/LeftSidebar';
import { Canvas } from './Canvas';
import { RightPanel } from './RightPanel/RightPanel';
import { MobileBottomBar, type MobileTab } from './Mobile/MobileBottomBar';
import { MobilePropertiesSheet } from './Mobile/MobilePropertiesSheet';
import { saveMyTemplate } from '../../utils/storage';
import { cn } from '../../utils/cn';

interface TemplateEditorProps {
  initialTemplate: TemplateDocument;
  onBack: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  initialTemplate,
  onBack
}) => {
  const editor = useTemplateEditor(initialTemplate);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>(null);

  // Auto-fit canvas on initial open and screen resizes
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      const availW = isMobile ? window.innerWidth - 32 : window.innerWidth - 640;
      const availH = isMobile ? window.innerHeight - 130 : window.innerHeight - 120;
      if (availW > 100 && availH > 100) {
        editor.zoomFit(availW, availH);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [editor.document.width, editor.document.height]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const handleSaveAsMyTemplate = () => {
    saveMyTemplate({
      ...editor.document,
      name: `${editor.document.name} (Custom)`,
      isCustom: true
    });
    showToast('Saved to My Templates');
  };

  const handleSelectElementOnCanvas = (id: string | null) => {
    editor.selectElement(id);
    if (id && window.innerWidth < 1024) {
      setActiveMobileTab('properties');
    }
  };

  const handleApplyBrandKit = (
    colors: { primary: string; secondary: string; accent: string; text: string; bg: string },
    font: string,
    logo?: string
  ) => {
    const updatedElements = editor.document.elements.map((el) => {
      if (el.type === 'text') {
        const isHeading = el.name.toLowerCase().includes('heading') || el.name.toLowerCase().includes('title');
        const isBadge = el.name.toLowerCase().includes('badge') || el.name.toLowerCase().includes('pill');
        return {
          ...el,
          fontFamily: font,
          color: isHeading ? colors.text : isBadge ? colors.primary : el.color,
          backgroundColor: isBadge ? `${colors.primary}20` : el.backgroundColor
        };
      }
      if (el.type === 'qr') {
        return {
          ...el,
          fgColor: colors.primary,
          logoUrl: logo || el.logoUrl
        };
      }
      if (el.type === 'shape') {
        return {
          ...el,
          fill: el.name.toLowerCase().includes('accent') ? colors.accent : el.fill
        };
      }
      return el;
    });

    editor.updateDocumentMeta({ name: editor.document.name });
    editor.updateBackground({ type: 'solid', color: colors.bg });
    updatedElements.forEach((el) => {
      editor.updateElement(el.id, el);
    });

    showToast('Applied Brand Kit to Design');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground overflow-hidden">
      {/* Toast Notification */}
      <div
        className={cn(
          "fixed bottom-20 sm:bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary text-primary-foreground shadow-xl border border-border/20 text-xs font-semibold transition-all duration-300 transform",
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Check size={16} className="text-green-400" />
        <span>{toast.message}</span>
      </div>

      {/* Editor Header */}
      <EditorHeader
        document={editor.document}
        isSaved={editor.isSaved}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        zoom={editor.zoom}
        onBack={onBack}
        onUndo={editor.undo}
        onRedo={editor.redo}
        onZoomIn={editor.zoomIn}
        onZoomOut={editor.zoomOut}
        onZoomFit={() => {
          const isMobile = window.innerWidth < 1024;
          editor.zoomFit(
            isMobile ? window.innerWidth - 32 : window.innerWidth - 640,
            isMobile ? window.innerHeight - 130 : window.innerHeight - 120
          );
        }}
        onSetZoom={editor.setZoom}
        onUpdateTitle={(title) => editor.updateDocumentMeta({ name: title })}
        onSaveAsMyTemplate={handleSaveAsMyTemplate}
        showToast={showToast}
      />

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Desktop Only >= 1024px) */}
        <div className="hidden lg:flex">
          <LeftSidebar
            currentDocument={editor.document}
            selectedId={editor.selectedId}
            onSelectTemplate={editor.loadTemplate}
            onAddElement={editor.addElement}
            onUpdateBackground={editor.updateBackground}
            onSelectElement={editor.selectElement}
            onReorderElement={editor.reorderElement}
            onToggleLock={editor.toggleLockElement}
            onToggleHide={editor.toggleHideElement}
            onDeleteElement={editor.deleteElement}
            onApplyBrandKit={handleApplyBrandKit}
          />
        </div>

        {/* Center Canvas */}
        <Canvas
          document={editor.document}
          selectedId={editor.selectedId}
          zoom={editor.zoom}
          snapGuides={editor.snapGuides}
          onSelectElement={handleSelectElementOnCanvas}
          onUpdateElement={editor.updateElement}
          onSnapChange={editor.setSnapGuides}
          onDuplicateElement={editor.duplicateElement}
          onDeleteElement={editor.deleteElement}
          onReorderElement={editor.reorderElement}
        />

        {/* Right Inspector Panel (Desktop Only >= 1024px) */}
        <div className="hidden lg:flex">
          <RightPanel
            document={editor.document}
            selectedElement={editor.selectedElement}
            onUpdateElement={editor.updateElement}
            onDuplicateElement={editor.duplicateElement}
            onDeleteElement={editor.deleteElement}
            onUpdateBackground={editor.updateBackground}
            onUpdateDimensions={editor.updateDimensions}
            onUpdateMeta={editor.updateDocumentMeta}
          />
        </div>
      </div>

      {/* Mobile Bottom Editing Toolbar (< 1024px) */}
      <MobileBottomBar
        activeTab={activeMobileTab}
        onSelectTab={setActiveMobileTab}
        hasSelectedElement={!!editor.selectedElement}
      />

      {/* Mobile Properties / Tools Bottom Sheet (< 1024px) */}
      <MobilePropertiesSheet
        activeTab={activeMobileTab}
        onClose={() => setActiveMobileTab(null)}
        document={editor.document}
        selectedElement={editor.selectedElement}
        onUpdateElement={editor.updateElement}
        onDuplicateElement={editor.duplicateElement}
        onDeleteElement={editor.deleteElement}
        onUpdateBackground={editor.updateBackground}
        onUpdateDimensions={editor.updateDimensions}
        onUpdateMeta={editor.updateDocumentMeta}
        onAddElement={editor.addElement}
        onSelectTemplate={editor.loadTemplate}
        onSelectElement={editor.selectElement}
        onReorderElement={editor.reorderElement}
        onToggleLock={editor.toggleLockElement}
        onToggleHide={editor.toggleHideElement}
        onApplyBrandKit={handleApplyBrandKit}
      />
    </div>
  );
};
