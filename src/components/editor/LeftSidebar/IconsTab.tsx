import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { ICON_CATEGORIES } from '../../../data/sampleIcons';
import type { IconElement } from '../../../types/template';

interface IconsTabProps {
  onAddElement: (data: Partial<IconElement> & { type: 'icon' }) => void;
}

export const IconsTab: React.FC<IconsTabProps> = ({ onAddElement }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(ICON_CATEGORIES[0].name);
  const [search, setSearch] = useState('');

  const currentCategoryObj = ICON_CATEGORIES.find((c) => c.name === selectedCategory) || ICON_CATEGORIES[0];

  const filteredIcons = currentCategoryObj.icons.filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Icon Library</h3>
        <p className="text-xs text-muted-foreground">Pick clean vector icons for your design.</p>
      </div>

      {/* Search Icons */}
      <div className="relative flex items-center w-full">
        <LucideIcons.Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vector icons..."
          className="w-full h-9 pl-9 pr-8 rounded-xl border border-border bg-muted/30 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring shadow-xs placeholder:text-muted-foreground"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <LucideIcons.X size={13} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {ICON_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.name
                ? 'bg-foreground text-background font-semibold'
                : 'bg-muted/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-4 gap-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
        {filteredIcons.map((iconName) => {
          const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
          return (
            <button
              key={iconName}
              type="button"
              onClick={() =>
                onAddElement({
                  type: 'icon',
                  name: iconName,
                  iconName,
                  color: '#18181b',
                  width: 48,
                  height: 48
                })
              }
              title={iconName}
              className="p-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground/80 hover:text-primary hover:border-primary/40 flex flex-col items-center justify-center gap-1 transition-all shadow-xs group"
            >
              <IconComponent size={20} className="group-hover:scale-115 transition-transform" />
              <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                {iconName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
