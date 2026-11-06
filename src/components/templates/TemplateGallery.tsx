import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  SlidersHorizontal,
  Heart,
  FolderPlus,
  Plus,
  X,
  Layers,
  ArrowRight,
  Clock,
  LayoutGrid,
  ChevronDown,
  Check,
  Tag
} from 'lucide-react';
import type { CategoryType, TemplateDocument } from '../../types/template';
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

const POPULAR_CATEGORIES: CategoryType[] = [
  'Flyers',
  'Posters',
  'Business Cards',
  'Instagram Post',
  'Restaurant Menu',
  'Event Invitation'
];

type GalleryTab = 'all' | 'favorites' | 'my-templates' | 'recent';

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onOpenTemplate,
  onCreateBlank,
  initialCategory
}) => {
  const [activeTab, setActiveTab] = useState<GalleryTab>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [styleDraft, setStyleDraft] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [catDraft, setCatDraft] = useState<string>('All');
  const [stylePanelOpen, setStylePanelOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => getFavoriteIds());
  const [myTemplates, setMyTemplates] = useState<TemplateDocument[]>(() => getMyTemplates());
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentTemplateIds());
  const [blankModalOpen, setBlankModalOpen] = useState(false);

  // Keep draft in sync when opening
  useEffect(() => {
    if (catDropdownOpen) setCatDraft(selectedCategory);
  }, [catDropdownOpen, selectedCategory]);

  // Close dropdowns on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setCatDropdownOpen(false);
        setStylePanelOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const availableStyles = useMemo(() => {
    const styles = new Set<string>();
    [...ALL_TEMPLATES, ...myTemplates].forEach((t) => styles.add(t.style));
    return Array.from(styles).sort();
  }, [myTemplates]);

  const filteredCategories = useMemo(() => {
    const q = catSearch.trim().toLowerCase();
    if (!q) return ALL_CATEGORIES;
    return ALL_CATEGORIES.filter((c) => c.toLowerCase().includes(q));
  }, [catSearch]);

  const activeFilterCount = selectedStyles.length + (selectedCategory !== 'All' ? 1 : 0);

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
      // Style match (multi-select)
      if (selectedStyles.length > 0 && !selectedStyles.includes(t.style)) {
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
  }, [activeTab, selectedCategory, selectedStyles, searchQuery, favorites, myTemplates, recentIds]);

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
      {/* Compact Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-gradient-to-r from-card via-card/90 to-muted/30 px-5 py-5 sm:px-8 sm:py-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Print & Digital QR Templates
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                <Layers size={11} />
                {ALL_TEMPLATES.length + myTemplates.length}+ templates
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Posters, flyers, menus, cards and social posts with live editable QR codes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setBlankModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-sm hover:opacity-90 transition-all shrink-0"
          >
            <Plus size={15} />
            <span>Start Blank Design</span>
          </button>
        </div>
      </div>

      {/* Unified Filters Toolbar */}
      <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-xs space-y-3">
        {/* Row 1: Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
            {([
              { id: 'all' as GalleryTab, label: 'All Templates', icon: LayoutGrid, count: ALL_TEMPLATES.length + myTemplates.length },
              { id: 'favorites' as GalleryTab, label: 'Favorites', icon: Heart, count: favorites.length },
              { id: 'my-templates' as GalleryTab, label: 'My Templates', icon: FolderPlus, count: myTemplates.length },
              { id: 'recent' as GalleryTab, label: 'Recent', icon: Clock, count: recentIds.length }
            ]).map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); if (tab.id === 'all') setSelectedCategory('All'); }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0",
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon size={13} className={tab.id === 'favorites' && favorites.length > 0 && !active ? "text-red-500" : ""} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={cn("px-1.5 py-0.5 rounded-md text-[10px]", active ? "bg-background/20" : "bg-border/60 text-foreground")}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full h-9 pl-9 pr-8 rounded-lg border border-border/80 bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground transition-shadow"
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

        {/* Row 2: Category chips + dropdowns + count */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Popular category chips */}
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors",
              selectedCategory === 'All'
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            All
          </button>
          {POPULAR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors",
                selectedCategory === cat
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {cat}
            </button>
          ))}

          {/* All Categories — opens portal drawer */}
          <button
            type="button"
            onClick={() => { setCatDropdownOpen(true); setCatSearch(''); }}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 border",
              catDropdownOpen || (selectedCategory !== 'All' && !POPULAR_CATEGORIES.includes(selectedCategory as CategoryType))
                ? "border-primary/40 text-primary bg-primary/5"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Tag size={11} />
            <span>{selectedCategory !== 'All' && !POPULAR_CATEGORIES.includes(selectedCategory as CategoryType) ? selectedCategory : 'All Categories'}</span>
            <ChevronDown size={11} className={cn("transition-transform", catDropdownOpen && "rotate-180")} />
          </button>

          {/* Style Filters — opens portal drawer */}
          <button
            type="button"
            onClick={() => {
              setStylePanelOpen(true);
              setStyleDraft(selectedStyles);
            }}
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 border",
              stylePanelOpen || selectedStyles.length > 0
                ? "border-primary/40 text-primary bg-primary/5"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <SlidersHorizontal size={11} />
            <span>Filters</span>
            {selectedStyles.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">
                {selectedStyles.length}
              </span>
            )}
          </button>

          <div className="ml-auto text-[11px] text-muted-foreground font-medium">
            <strong className="text-foreground">{filteredTemplates.length}</strong> designs
          </div>
        </div>

        {/* Row 3: Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/50">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active:</span>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground text-background text-[10px] font-semibold hover:opacity-80 transition-opacity"
              >
                {selectedCategory}
                <X size={10} />
              </button>
            )}
            {selectedStyles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setSelectedStyles((prev) => prev.filter((s) => s !== style))}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-semibold hover:bg-primary/20 transition-colors"
              >
                {style}
                <X size={10} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setSelectedCategory('All'); setSelectedStyles([]); }}
              className="text-[10px] font-medium text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
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
            {(searchQuery || selectedCategory !== 'All' || selectedStyles.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedStyles([]);
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

      {/* Category Drawer (portal) */}
      {catDropdownOpen && createPortal(
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setCatDropdownOpen(false)}
          />
          {/* Drawer panel: right side on desktop, bottom sheet on mobile */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right-8 fade-in duration-300 max-sm:inset-y-auto max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[85dvh] max-sm:rounded-t-2xl max-sm:border-l-0 max-sm:border-t max-sm:animate-in max-sm:slide-in-from-bottom-8">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2">
                <Tag size={15} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">All Categories</h3>
              </div>
              <button
                type="button"
                onClick={() => setCatDropdownOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close categories"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-border/40 shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  placeholder="Search categories..."
                  autoFocus
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/80 bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Scrollable options */}
            <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setCatDraft('All')}
                  className={cn(
                    "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                    catDraft === 'All' ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className={cn(
                    "w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-colors",
                    catDraft === 'All' ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                  )}>
                    {catDraft === 'All' && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className="font-semibold">All Categories</span>
                </button>
                {filteredCategories.map((cat) => {
                  const checked = catDraft === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCatDraft(cat)}
                      className={cn(
                        "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                        checked ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <span className={cn(
                        "w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-colors",
                        checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                      )}>
                        {checked && <Check size={10} strokeWidth={3} />}
                      </span>
                      <span className="truncate">{cat}</span>
                    </button>
                  );
                })}
                {filteredCategories.length === 0 && (
                  <p className="px-2.5 py-3 text-[11px] text-muted-foreground text-center">No categories match "{catSearch}".</p>
                )}
              </div>
            </div>

            {/* Sticky footer actions */}
            <div className="shrink-0 border-t border-border/60 bg-background px-4 py-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCatDraft('All')}
                className="h-9 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => { setSelectedCategory(catDraft); setCatDropdownOpen(false); }}
                className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Style Filter Drawer (portal) */}
      {stylePanelOpen && createPortal(
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setStylePanelOpen(false)}
          />
          {/* Drawer panel: right side on desktop, bottom sheet on mobile */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-80 bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right-8 fade-in duration-300 max-sm:inset-y-auto max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[85dvh] max-sm:rounded-t-2xl max-sm:border-l-0 max-sm:border-t max-sm:animate-in max-sm:slide-in-from-bottom-8">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Filter by Style</h3>
                {styleDraft.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                    {styleDraft.length} selected
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setStylePanelOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable options */}
            <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
              <div className="space-y-0.5">
                {availableStyles.map((style) => {
                  const checked = styleDraft.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() =>
                        setStyleDraft((prev) =>
                          checked ? prev.filter((s) => s !== style) : [...prev, style]
                        )
                      }
                      className={cn(
                        "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                        checked ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <span className={cn(
                        "w-4.5 h-4.5 w-[18px] h-[18px] rounded border flex items-center justify-center shrink-0 transition-colors",
                        checked ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                      )}>
                        {checked && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span className="truncate">{style}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sticky footer actions */}
            <div className="shrink-0 border-t border-border/60 bg-background px-4 py-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStyleDraft([])}
                className="h-9 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => { setSelectedStyles(styleDraft); setStylePanelOpen(false); }}
                className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Apply{styleDraft.length > 0 ? ` (${styleDraft.length})` : ''}
              </button>
            </div>
          </div>
        </div>,
        document.body
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
