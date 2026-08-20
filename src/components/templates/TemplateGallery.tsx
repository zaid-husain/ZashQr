import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Heart,
  FolderPlus,
  Sparkles,
  Plus,
  X,
  Layers,
  ArrowRight,
  Clock,
  LayoutGrid
} from 'lucide-react';
import type { CategoryType, TemplateDocument, TemplateStyle } from '../../types/template';
import { ALL_TEMPLATES, ALL_CATEGORIES } from '../../data/templates';
import { TemplateCard } from './TemplateCard';
import {
  getFavoriteIds,
  toggleFavoriteId,
  getMyTemplates,
  saveMyTemplate,
  getRecentTemplateIds,
  addRecentTemplateId
} from '../../utils/storage';
import { cn } from '../../utils/cn';

interface TemplateGalleryProps {
  onOpenTemplate: (template: TemplateDocument) => void;
  onCreateBlank: (width: number, height: number, category: CategoryType, name: string) => void;
  initialCategory?: string;
}

const STYLES: (TemplateStyle | 'All')[] = [
  'All',
  'Minimal',
  'Corporate',
  'Modern',
  'Creative',
  'Luxury',
  'Bold',
  'Elegant',
  'Dark',
  'Light',
  'Colorful',
  'Glassmorphism',
  'Monochrome',
  'Vintage',
  'Abstract',
  'Tech'
];

type GalleryTab = 'all' | 'favorites' | 'my-templates' | 'recent';

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onOpenTemplate,
  onCreateBlank,
  initialCategory
}) => {
  const [activeTab, setActiveTab] = useState<GalleryTab>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteIds());
  const [myTemplates, setMyTemplates] = useState<TemplateDocument[]>(() => getMyTemplates());
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentTemplateIds());
  const [blankModalOpen, setBlankModalOpen] = useState(false);

  // Sync storage on tab switches
  useEffect(() => {
    setFavorites(getFavoriteIds());
    setMyTemplates(getMyTemplates());
    setRecentIds(getRecentTemplateIds());
  }, [activeTab]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteId(id);
    setFavorites(getFavoriteIds());
  };

  const handleDuplicate = (template: TemplateDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: TemplateDocument = {
      ...template,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: `${template.name} (Copy)`,
      isCustom: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    saveMyTemplate(duplicated);
    setMyTemplates(getMyTemplates());
  };

  const handleSelectTemplate = (template: TemplateDocument) => {
    addRecentTemplateId(template.id);
    onOpenTemplate(template);
  };

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let list: TemplateDocument[] = [];

    if (activeTab === 'my-templates') {
      list = myTemplates;
    } else if (activeTab === 'favorites') {
      const favSet = new Set(favorites);
      list = [...myTemplates, ...ALL_TEMPLATES].filter((t) => favSet.has(t.id));
    } else if (activeTab === 'recent') {
      const recentSet = new Set(recentIds);
      list = [...myTemplates, ...ALL_TEMPLATES].filter((t) => recentSet.has(t.id));
    } else {
      // All templates (built-in + user custom)
      list = [...myTemplates, ...ALL_TEMPLATES];
    }

    return list.filter((t) => {
      // Category match
      if (selectedCategory !== 'All' && t.category !== selectedCategory) {
        return false;
      }
      // Style match
      if (selectedStyle !== 'All' && t.style !== selectedStyle) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        const matchesStyle = t.style.toLowerCase().includes(q);
        const matchesTags = t.tags?.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesStyle && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [activeTab, selectedCategory, selectedStyle, searchQuery, favorites, myTemplates, recentIds]);

  const blankPresets = [
    { label: 'Flyer / Poster (A4)', width: 600, height: 840, category: 'Flyers' as CategoryType },
    { label: 'Instagram Post (1:1)', width: 600, height: 600, category: 'Instagram Post' as CategoryType },
    { label: 'Instagram Story (9:16)', width: 540, height: 960, category: 'Instagram Story' as CategoryType },
    { label: 'Business Card (3.5×2)', width: 640, height: 380, category: 'Business Cards' as CategoryType },
    { label: 'Table Tent / Menu', width: 500, height: 700, category: 'Table Tent' as CategoryType },
    { label: 'Certificate / Award', width: 800, height: 560, category: 'Certificate' as CategoryType },
    { label: 'QR Sticker (Square)', width: 500, height: 500, category: 'QR Sticker' as CategoryType },
    { label: 'LinkedIn Banner (16:9)', width: 800, height: 400, category: 'LinkedIn Banner' as CategoryType }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner / Header */}
      <div className="relative rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-b from-card via-card/90 to-background p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles size={14} />
            <span>Canva-Inspired QR Design Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Print & Digital QR Templates
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Create high-converting posters, flyers, menus, business cards, stickers, and social posts with live editable QR codes in seconds.
          </p>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setBlankModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-sm hover:opacity-90 transition-all transform hover:scale-[1.02]"
            >
              <Plus size={16} />
              <span>Start Blank Design</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-2 rounded-xl bg-muted/50 border border-border/60">
              <Layers size={14} />
              <span className="font-semibold text-foreground">{ALL_TEMPLATES.length}+</span>
              <span>Ready-Made Templates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Filters Toolbar */}
      <div className="bg-muted/10 border border-border/60 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        {/* Top Row: Navigation Tabs & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => { setActiveTab('all'); setSelectedCategory('All'); }}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5",
                activeTab === 'all'
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <LayoutGrid size={14} />
              <span>All Templates</span>
              <span className={cn("px-1.5 py-0.5 rounded-md text-[10px]", activeTab === 'all' ? "bg-background/20" : "bg-border/60 text-foreground")}>
                {ALL_TEMPLATES.length + myTemplates.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5",
                activeTab === 'favorites'
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Heart size={14} className={favorites.length > 0 ? (activeTab === 'favorites' ? "fill-current" : "text-red-500 fill-red-500") : ""} />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className={cn("px-1.5 py-0.5 rounded-md text-[10px]", activeTab === 'favorites' ? "bg-background/20" : "bg-border/60 text-foreground")}>
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('my-templates')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5",
                activeTab === 'my-templates'
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <FolderPlus size={14} />
              <span>My Templates</span>
              {myTemplates.length > 0 && (
                <span className={cn("px-1.5 py-0.5 rounded-md text-[10px]", activeTab === 'my-templates' ? "bg-background/20" : "bg-border/60 text-foreground")}>
                  {myTemplates.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('recent')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5",
                activeTab === 'recent'
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Clock size={14} />
              <span>Recent</span>
            </button>
          </div>

          <div className="relative w-full lg:w-80 shrink-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50+ templates..."
              className="w-full h-9 pl-9 pr-8 rounded-xl border border-border/80 bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground shadow-xs transition-shadow"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Middle Row: Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors",
              selectedCategory === 'All'
                ? "bg-foreground text-background shadow-xs"
                : "bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            All Categories
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors",
                selectedCategory === cat
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bottom Row: Styles & Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border/60">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="font-semibold text-foreground/80 flex items-center gap-1 text-[10px] uppercase tracking-wider pr-2">
              <SlidersHorizontal size={12} /> Style
            </span>
            {STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setSelectedStyle(style)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap",
                  selectedStyle === style
                    ? "bg-primary/10 text-primary font-bold border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-muted-foreground font-medium shrink-0 flex items-center justify-end">
            Showing <strong className="text-foreground ml-1 mr-1">{filteredTemplates.length}</strong> designs
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isFavorite={favorites.includes(template.id)}
              onSelect={handleSelectTemplate}
              onToggleFavorite={handleToggleFavorite}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center border-2 border-dashed border-border/80 rounded-3xl bg-muted/20 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">No templates found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No designs match "${searchQuery}". Try clearing search or selecting a different category.`
                : activeTab === 'favorites'
                ? "You haven't added any favorite templates yet. Click the heart on any card to save it."
                : activeTab === 'my-templates'
                ? "You haven't saved any custom templates yet. Customize any template or create a blank one."
                : "No designs match the selected filters."}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            {(searchQuery || selectedCategory !== 'All' || selectedStyle !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedStyle('All');
                }}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground transition-colors"
              >
                Reset Filters
              </button>
            )}

            <button
              type="button"
              onClick={() => setBlankModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 transition-colors"
            >
              Start Blank Canvas
            </button>
          </div>
        </div>
      )}

      {/* Blank Canvas Modal */}
      {blankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <Plus size={16} />
                </div>
                <h3 className="text-base font-bold">Choose Canvas Size</h3>
              </div>
              <button
                type="button"
                onClick={() => setBlankModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Select standard print or social media dimensions to start designing with our Canva-like editor.
            </p>

            <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {blankPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setBlankModalOpen(false);
                    onCreateBlank(preset.width, preset.height, preset.category, `Custom ${preset.category}`);
                  }}
                  className="p-3.5 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/40 text-left transition-all group flex flex-col justify-between h-24"
                >
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {preset.label}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-mono">{preset.width} × {preset.height} px</span>
                    <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
