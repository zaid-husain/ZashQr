import React from 'react';
import { Heart, Sparkles, Copy, ArrowUpRight } from 'lucide-react';
import type { TemplateDocument } from '../../types/template';
import { TemplateThumbnail } from './TemplateThumbnail';
import { cn } from '../../utils/cn';

interface TemplateCardProps {
  template: TemplateDocument;
  isFavorite: boolean;
  onSelect: (template: TemplateDocument) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDuplicate?: (template: TemplateDocument, e: React.MouseEvent) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onDuplicate
}) => {
  const aspectRatio = template.width / template.height;
  const isWide = aspectRatio > 1.2;
  const isTall = aspectRatio < 0.8;

  const getDimensionLabel = () => {
    if (template.category.includes('Story')) return '9:16 Story';
    if (template.category.includes('Post')) return '1:1 Square';
    if (template.category.includes('Business')) return 'Card 3.5×2';
    if (template.category.includes('Banner')) return '16:9 Banner';
    if (template.category.includes('Flyer') || template.category.includes('Poster')) return 'Poster A4';
    return `${template.width}×${template.height}`;
  };

  return (
    <div
      onClick={() => onSelect(template)}
      className="group relative bg-card hover:bg-card/80 border border-border/80 hover:border-primary/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Visual Thumbnail Area */}
      <div className="relative w-full bg-muted/40 aspect-[4/5] overflow-hidden flex items-center justify-center p-3 sm:p-4">
        {/* Subtle checkered pattern backdrop for transparency */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--muted-foreground) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Thumbnail Container */}
        <div
          className="w-full h-full max-h-full rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-transform duration-300 group-hover:scale-[1.02] flex items-center justify-center"
          style={{
            maxWidth: isWide ? '100%' : isTall ? '82%' : '90%'
          }}
        >
          <TemplateThumbnail template={template} className="w-full h-full" />
        </div>

        {/* Top Badges & Actions Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-background/90 backdrop-blur-md text-foreground shadow-xs border border-border/50">
            {template.category}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onDuplicate && (
              <button
                type="button"
                onClick={(e) => onDuplicate(template, e)}
                title="Duplicate template"
                className="w-8 h-8 rounded-full bg-background/90 backdrop-blur-md text-foreground/80 hover:text-foreground hover:bg-background border border-border/60 flex items-center justify-center shadow-xs transition-all transform hover:scale-105"
              >
                <Copy size={13} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => onToggleFavorite(template.id, e)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={cn(
                "w-8 h-8 rounded-full bg-background/90 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-xs transition-all transform hover:scale-105",
                isFavorite
                  ? "text-red-500 hover:text-red-600 fill-red-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart size={14} className={isFavorite ? "fill-red-500" : ""} />
            </button>
          </div>
        </div>

        {/* Hover Quick "Use Template" CTA */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-20">
          <span className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Sparkles size={14} />
            <span>Customize Template</span>
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between border-t border-border/40 bg-card">
        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-sm font-semibold text-foreground truncate tracking-tight group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground font-medium">
            <span>{getDimensionLabel()}</span>
            <span>•</span>
            <span className="capitalize">{template.style}</span>
          </div>
        </div>

        <div className="shrink-0">
          <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-0.5">
            Use <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
};
