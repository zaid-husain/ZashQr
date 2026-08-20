import React, { useRef } from 'react';
import { Upload, Sparkles } from 'lucide-react';
import type { ImageElement } from '../../../types/template';

interface ImagesTabProps {
  onAddElement: (data: Partial<ImageElement> & { type: 'image' }) => void;
}

export const ImagesTab: React.FC<ImagesTabProps> = ({ onAddElement }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onAddElement({
          type: 'image',
          name: file.name.replace(/\.[^/.]+$/, ''),
          src: result,
          width: 220,
          height: 180,
          borderRadius: 12,
          objectFit: 'cover'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Curated clean sample assets
  const sampleBadges = [
    {
      name: 'Eco Organic Badge',
      src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Coffee Cup Aesthetic',
      src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Luxury Architecture',
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Culinary Dish',
      src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Uploads & Photos</h3>
        <p className="text-xs text-muted-foreground">Upload logos, product photos, or custom graphics.</p>
      </div>

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-4 rounded-xl border-2 border-dashed border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 text-center transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload size={18} />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">Upload an Image</div>
            <div className="text-[10px] text-muted-foreground">PNG, JPG, SVG, WebP up to 10MB</div>
          </div>
        </button>
      </div>

      <div className="pt-2">
        <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1">
          <Sparkles size={13} className="text-primary" />
          <span>Curated Sample Photos</span>
        </h4>

        <div className="grid grid-cols-2 gap-2">
          {sampleBadges.map((badge) => (
            <button
              key={badge.name}
              type="button"
              onClick={() =>
                onAddElement({
                  type: 'image',
                  name: badge.name,
                  src: badge.src,
                  width: 200,
                  height: 160,
                  borderRadius: 12,
                  objectFit: 'cover'
                })
              }
              className="group border border-border/80 hover:border-primary rounded-xl overflow-hidden bg-muted/20 hover:bg-card p-1 text-left transition-all shadow-xs"
            >
              <img
                src={badge.src}
                alt={badge.name}
                className="w-full h-20 object-cover rounded-lg mb-1 group-hover:scale-105 transition-transform"
              />
              <div className="text-[10px] font-semibold text-foreground truncate px-1">
                {badge.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
