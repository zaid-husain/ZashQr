import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { TemplateDocument } from '../../../types/template';
import { ALL_TEMPLATES, ALL_CATEGORIES } from '../../../data/templates';
import { TemplateThumbnail } from '../../templates/TemplateThumbnail';
import { cn } from '../../../utils/cn';

interface TemplatesTabProps {
  onSelectTemplate: (template: TemplateDocument) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onSelectTemplate }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const filtered = ALL_TEMPLATES.filter((t) => {
    if (category !== 'All' && t.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Template Library</h3>
        <p className="text-xs text-muted-foreground">Pick a ready-made layout to replace canvas.</p>
      </div>

      {/* Search Input Container */}
      <div className="relative flex items-center w-full">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search 50+ templates..."
          className="w-full h-9 pl-9 pr-8 rounded-xl border border-border bg-muted/30 text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground shadow-xs placeholder:text-muted-foreground"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Category Pills (Clean smooth scrollbar-free) */}
      <div
        className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          type="button"
          onClick={() => setCategory('All')}
          className={cn(
            "px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0",
            category === 'All'
              ? "bg-foreground text-background font-semibold shadow-xs"
              : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all shrink-0",
              category === cat
                ? "bg-foreground text-background font-semibold shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
        {filtered.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTemplate(t)}
            className="group text-left border border-border/70 hover:border-primary/80 rounded-2xl overflow-hidden bg-card hover:bg-muted/20 p-2 transition-all shadow-xs hover:shadow-md transform hover:-translate-y-0.5"
          >
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center mb-2 border border-border/40">
              <TemplateThumbnail template={t} className="w-full h-full object-contain" />
            </div>
            <div className="space-y-0.5 px-0.5">
              <div className="text-[11px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {t.name}
              </div>
              <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                <span className="truncate">{t.category}</span>
                <span className="font-mono">{t.width}×{t.height}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
