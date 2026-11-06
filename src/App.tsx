import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { TemplateDocument, CategoryType } from './types/template';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AboutModal } from './components/layout/AboutModal';
import { QRGeneratorView } from './components/generator/QRGeneratorView';
import { TemplateGallery } from './components/templates/TemplateGallery';
import { TemplateEditor } from './components/editor/TemplateEditor';
import { getEditorDraft, saveEditorDraft, clearEditorDraft } from './utils/storage';
import { cn } from './utils/cn';
import { SEO } from './components/seo/SEO';
import { createSoftwareAppSchema, createOrganizationSchema } from './utils/seo-schema';

// Helper component for Template Category route
interface TemplateCategoryViewProps {
  onOpenTemplate: (template: TemplateDocument) => void;
  onCreateBlank: (width: number, height: number, category: CategoryType, name: string) => void;
}

const TemplateCategoryView: React.FC<TemplateCategoryViewProps> = ({ onOpenTemplate, onCreateBlank }) => {
  const location = useLocation();
  const categorySlug = location.pathname.split('/').pop()?.replace(/-/g, ' ');
  
  const formatCategory = (slug: string) => {
    return slug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formattedCategory = categorySlug ? formatCategory(categorySlug) : 'All';

  return (
    <>
      <SEO 
        title={`ZashQr Templates – Professional ${formattedCategory} QR Designs`}
        description={`Customize beautifully designed ${formattedCategory} QR code templates for your business, event, or personal use. Ready to download in PNG or SVG.`}
        canonicalUrl={`https://qrstudio.zashly.com${location.pathname}`}
      />
      <TemplateGallery
        initialCategory={formattedCategory}
        onOpenTemplate={onOpenTemplate}
        onCreateBlank={onCreateBlank}
      />
    </>
  );
};

// Route wrapper for /about
const AboutPageRoute: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="About ZashQr – Built by Zashly"
        description="ZashQr is part of the Zashly ecosystem. Discover how we built a fast, free, and completely private QR code generator."
        canonicalUrl="https://qrstudio.zashly.com/about"
      />
      <QRGeneratorView showToast={showToast} />
      <AboutModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate('/');
        }}
      />
    </>
  );
};

// Route wrapper for /privacy
const PrivacyPageRoute: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Privacy Policy – ZashQr"
        description="ZashQr is 100% private and client-side. No tracking, no backend database, and zero data leaves your browser."
        canonicalUrl="https://qrstudio.zashly.com/privacy"
      />
      <QRGeneratorView showToast={showToast} />
      <AboutModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate('/');
        }}
      />
    </>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('qr_dark_mode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  const [activeEditorTemplate, setActiveEditorTemplate] = useState<TemplateDocument | null>(() => {
    const draft = getEditorDraft();
    if (draft && window.location.hash === '#editor') return draft;
    return null;
  });

  const [aboutOpen, setAboutOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  
  const location = useLocation();

  // Sync hash with editor state
  useEffect(() => {
    if (activeEditorTemplate) {
      if (window.location.hash !== '#editor') {
        window.location.hash = 'editor';
      }
    } else {
      if (window.location.hash === '#editor') {
        window.history.replaceState(null, '', location.pathname + location.search);
      }
    }
  }, [activeEditorTemplate, location.pathname, location.search]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('qr_dark_mode', String(darkMode));
  }, [darkMode]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const handleOpenTemplate = (template: TemplateDocument) => {
    setActiveEditorTemplate(template);
    saveEditorDraft(template);
  };

  const handleBackFromEditor = () => {
    setActiveEditorTemplate(null);
    clearEditorDraft();
  };

  const handleCreateBlank = (
    width: number,
    height: number,
    category: CategoryType,
    name: string
  ) => {
    const blankDoc: TemplateDocument = {
      id: `blank-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      category,
      style: 'Modern',
      tags: ['blank', 'custom', category.toLowerCase()],
      width,
      height,
      background: { type: 'solid', color: '#ffffff' },
      elements: [
        {
          id: `qr-init-${Date.now()}`,
          type: 'qr',
          name: 'QR Code',
          x: Math.round(width / 2 - 100),
          y: Math.round(height / 2 - 100),
          width: 200,
          height: 200,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          qrType: 'url',
          value: 'https://qrstudio.app',
          raw: { url: 'https://qrstudio.app' },
          fgColor: '#09090b',
          bgColor: '#ffffff',
          moduleStyle: 'rounded',
          finderStyle: 'rounded',
          errorCorrectionLevel: 'H',
          padding: 14,
          borderRadius: 16
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isCustom: true
    };
    setActiveEditorTemplate(blankDoc);
    saveEditorDraft(blankDoc);
  };

  // Structured data for home page
  const homeSchema = [createOrganizationSchema(), createSoftwareAppSchema()];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Toast Notification */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-primary text-primary-foreground shadow-lg border border-border/20 text-sm font-medium transition-all duration-300 transform",
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Check size={16} className="text-green-400" />
        <span>{toast.message}</span>
      </div>

      {/* Top Navbar */}
      <Header
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
        onOpenAbout={() => setAboutOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!activeEditorTemplate && (
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <SEO structuredData={homeSchema} />
                  <QRGeneratorView showToast={showToast} />
                </>
              } 
            />
            <Route 
              path="/generator" 
              element={
                <>
                  <SEO 
                    title="ZashQr – Free QR Code Generator" 
                    canonicalUrl="https://qrstudio.zashly.com/generator" 
                  />
                  <QRGeneratorView showToast={showToast} />
                </>
              } 
            />
            <Route 
              path="/templates" 
              element={
                <>
                  <SEO 
                    title="ZashQr Templates – Professional QR Designs"
                    description="Explore 100+ professional, fully editable QR code templates. Create beautiful QR posters, menus, flyers, business cards, and more."
                    canonicalUrl="https://qrstudio.zashly.com/templates"
                  />
                  <TemplateGallery
                    onOpenTemplate={handleOpenTemplate}
                    onCreateBlank={handleCreateBlank}
                  />
                </>
              } 
            />
            <Route 
              path="/templates/:category" 
              element={
                <TemplateCategoryView 
                  onOpenTemplate={handleOpenTemplate}
                  onCreateBlank={handleCreateBlank}
                />
              } 
            />
            <Route 
              path="/about" 
              element={<AboutPageRoute showToast={showToast} />} 
            />
            <Route 
              path="/privacy" 
              element={<PrivacyPageRoute showToast={showToast} />} 
            />
            {/* Fallback */}
            <Route path="*" element={<QRGeneratorView showToast={showToast} />} />
          </Routes>
        )}
      </main>

      {/* Full-screen Canva-like Template Editor */}
      {activeEditorTemplate && (
        <TemplateEditor
          initialTemplate={activeEditorTemplate}
          onBack={handleBackFromEditor}
        />
      )}

      {/* Header/Drawer About Modal */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      {/* Footer (hidden when full editor is active) */}
      {!activeEditorTemplate && (
        <Footer />
      )}
    </div>
  );
}
