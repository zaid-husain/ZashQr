import React, { useRef } from 'react';
import { Upload, Wand2 } from 'lucide-react';
import { useBrandKit } from '../../../hooks/useBrandKit';
import { ColorPicker } from '../../ui/ColorPicker';

interface BrandKitTabProps {
  onApplyBrandKit: (
    colors: { primary: string; secondary: string; accent: string; text: string; bg: string },
    font: string,
    logo?: string
  ) => void;
}

export const BrandKitTab: React.FC<BrandKitTabProps> = ({ onApplyBrandKit }) => {
  const { brandKit, updateBrandKit } = useBrandKit();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateBrandKit({ logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    onApplyBrandKit(
      {
        primary: brandKit.primaryColor,
        secondary: brandKit.secondaryColor,
        accent: brandKit.accentColor,
        text: brandKit.textColor,
        bg: brandKit.backgroundColor
      },
      brandKit.fontFamily,
      brandKit.logoUrl
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Brand Kit</h3>
        <p className="text-xs text-muted-foreground">Save your brand identity and apply it in one click.</p>
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={handleApply}
        className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
      >
        <Wand2 size={15} />
        <span>Apply Brand Kit to Canvas</span>
      </button>

      {/* Brand Name */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-foreground/80">Brand Name</label>
        <input
          type="text"
          value={brandKit.name}
          onChange={(e) => updateBrandKit({ name: e.target.value })}
          className="w-full h-8 px-2.5 rounded-lg border border-border bg-muted/30 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Brand Colors */}
      <div className="space-y-3 pt-2">
        <ColorPicker
          label="Primary Brand Color"
          value={brandKit.primaryColor}
          onChange={(col) => updateBrandKit({ primaryColor: col })}
        />

        <ColorPicker
          label="Secondary Brand Color"
          value={brandKit.secondaryColor}
          onChange={(col) => updateBrandKit({ secondaryColor: col })}
        />

        <ColorPicker
          label="Accent Color"
          value={brandKit.accentColor}
          onChange={(col) => updateBrandKit({ accentColor: col })}
        />
      </div>

      {/* Brand Font */}
      <div className="space-y-1 pt-2">
        <label className="text-xs font-medium text-foreground/80">Brand Font</label>
        <select
          value={brandKit.fontFamily}
          onChange={(e) => updateBrandKit({ fontFamily: e.target.value })}
          className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="Inter">Inter (Clean Modern)</option>
          <option value="Roboto">Roboto (Geometric Sans)</option>
          <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
          <option value="Outfit">Outfit (Tech Rounded)</option>
          <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
          <option value="Montserrat">Montserrat (Bold Header)</option>
          <option value="Courier Prime">Courier Prime (Monospace)</option>
        </select>
      </div>

      {/* Brand Logo */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-medium text-foreground/80">Brand Logo</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
        {brandKit.logoUrl ? (
          <div className="flex items-center justify-between p-2 rounded-xl border border-border bg-muted/30">
            <img src={brandKit.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-white p-1" />
            <button
              type="button"
              onClick={() => updateBrandKit({ logoUrl: undefined })}
              className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-border hover:border-primary/60 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors"
          >
            <Upload size={14} />
            <span>Upload Logo</span>
          </button>
        )}
      </div>
    </div>
  );
};
