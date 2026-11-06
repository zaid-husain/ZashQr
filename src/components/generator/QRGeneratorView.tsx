import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Download,
  Copy,
  Link,
  Type,
  Mail,
  Phone,
  Wifi,
  Image as ImageIcon,
  ChevronDown,
  Check,
  Sparkles,
  X,
  AlertTriangle,
  Palette,
  Shapes,
  Settings2,
  RotateCcw,
  Save,
  Trash2,
  Contrast,
  Droplet
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Textarea } from '../ui/Textarea';
import { QRCodeSVG } from '../preview/QRCodeSVG';
import type { QRType, QRData, QRCodeOptions, ModuleStyle, FinderStyle } from '../../types';
import { formatQRValue } from '../../utils/qr-helpers';
import { downloadPNG, downloadSVG, copyToClipboard } from '../../utils/export-helpers';
import { cn } from '../../utils/cn';

interface QRGeneratorViewProps {
  showToast: (msg: string) => void;
}

function calculateContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    if (cleanHex.length !== 6) return 0.5;
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  try {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (brighter + 0.05) / (darker + 0.05);
  } catch {
    return 5;
  }
}

export const QRGeneratorView: React.FC<QRGeneratorViewProps> = ({ showToast }) => {
  const [data, setData] = useState<QRData>({
    type: 'url',
    value: 'https://example.com',
    raw: {
      url: 'https://example.com',
      text: '',
      email: { to: '', subject: '', body: '' },
      phone: '',
      wifi: { ssid: '', pass: '', encryption: 'WPA' }
    }
  });

  const [options, setOptions] = useState<QRCodeOptions>({
    fgColor: '#000000',
    bgColor: '#ffffff',
    moduleStyle: 'rounded',
    finderStyle: 'rounded',
    logoEnabled: true,
    logoScale: 0.26,
    logoPadding: 4,
    quietZone: 16,
    size: 200,
    errorCorrectionLevel: 'M'
  });

  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [downloadFormatOpen, setDownloadFormatOpen] = useState(false);
  const [customTab, setCustomTab] = useState<'colors' | 'patterns' | 'logo' | 'advanced'>('colors');
  const [exportSize, setExportSize] = useState(1200);
  const [savedCombos, setSavedCombos] = useState<{ fg: string; bg: string }[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('zashqr_color_combos') || '[]');
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Close download menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setDownloadFormatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update final string value when raw inputs change
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      value: formatQRValue(prev.raw, prev.type)
    }));
  }, [data.raw, data.type]);

  const updateRaw = (field: keyof QRData['raw'], val: any) => {
    setData((prev) => ({
      ...prev,
      raw: { ...prev.raw, [field]: val }
    }));
  };

  const updateType = (type: QRType) => {
    setData((prev) => ({
      ...prev,
      type,
      raw: {
        ...prev.raw,
        url: type === 'url' && !prev.raw.url ? 'https://example.com' : prev.raw.url
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        setOptions((prev) => ({ ...prev, logoUrl: result, errorCorrectionLevel: 'H' }));
        showToast('Logo added');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    setOptions((prev) => ({ ...prev, logoUrl: undefined, errorCorrectionLevel: 'M' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Logo removed');
  };

  const handleCopy = async () => {
    if (!data.value) return;
    const success = await copyToClipboard('qr-preview-svg', 1024);
    if (success) {
      setCopied(true);
      showToast('QR code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      showToast('Unable to copy directly (browser permission)');
    }
  };

  const persistCombos = (combos: { fg: string; bg: string }[]) => {
    setSavedCombos(combos);
    localStorage.setItem('zashqr_color_combos', JSON.stringify(combos));
  };

  const handleSaveCombo = () => {
    const combo = { fg: options.fgColor, bg: options.bgColor };
    const exists = savedCombos.some((c) => c.fg === combo.fg && c.bg === combo.bg);
    if (exists) {
      showToast('This color combo is already saved');
      return;
    }
    persistCombos([combo, ...savedCombos].slice(0, 8));
    showToast('Color combo saved');
  };

  const handleResetOptions = () => {
    setOptions({
      fgColor: '#000000',
      bgColor: '#ffffff',
      moduleStyle: 'rounded',
      finderStyle: 'rounded',
      logoEnabled: true,
      logoScale: 0.26,
      logoPadding: 4,
      quietZone: 16,
      size: 200,
      errorCorrectionLevel: 'M'
    });
    setLogoPreview(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Customization reset to defaults');
  };

  const isTransparentBg = options.bgColor === 'transparent';
  const effectiveFinderColor = options.finderColor || options.fgColor;

  const handleDownload = (format: 'png' | 'svg') => {
    setDownloadFormatOpen(false);
    if (!data.value) return;
    if (format === 'png') {
      downloadPNG('qr-preview-svg', 'qr-code', exportSize);
      showToast(`QR code downloaded as PNG (${exportSize}px)`);
    } else {
      downloadSVG('qr-preview-svg', 'qr-code');
      showToast('QR code downloaded as SVG');
    }
  };

  // Color presets (Apple & Vercel inspired)
  const colorPresets = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff' },
    { name: 'Midnight', fg: '#0f172a', bg: '#f8fafc' },
    { name: 'Ocean', fg: '#0284c7', bg: '#f0f9ff' },
    { name: 'Forest', fg: '#15803d', bg: '#f0fdf4' },
    { name: 'Sunset', fg: '#c2410c', bg: '#fff7ed' },
    { name: 'Dark Slate', fg: '#ffffff', bg: '#18181b' }
  ];

  const contrastRatio = calculateContrastRatio(options.fgColor, options.bgColor);
  const isLowContrast = contrastRatio < 2.8;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
      {/* Left Section: inputs + customization */}
      <div className="lg:col-span-8 space-y-3">
        {/* Top Row: Content Type + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Step 1: Type Selection */}
        <Card className="border border-border/80 shadow-xs min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">1</span>
              <span>Select Content Type</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Choose the information you want to encode in your QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { type: 'url' as QRType, label: 'Website', icon: Link },
                { type: 'text' as QRType, label: 'Text', icon: Type },
                { type: 'email' as QRType, label: 'Email', icon: Mail },
                { type: 'phone' as QRType, label: 'Phone', icon: Phone },
                { type: 'wifi' as QRType, label: 'Wi-Fi', icon: Wifi }
              ].map((item) => {
                const Icon = item.icon;
                const active = data.type === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => updateType(item.type)}
                    className={cn(
                      "flex flex-col items-center justify-center h-14 px-1 rounded-lg border text-[11px] font-medium transition-all duration-150",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "border-border/60 hover:border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon size={15} className="mb-1" />
                    <span className="truncate w-full text-center">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Content Inputs */}
        <Card className="border border-border/80 shadow-xs min-w-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">2</span>
              <span>Enter Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.type === 'url' && (
              <div className="space-y-2">
                <Label htmlFor="url-input" className="text-xs font-medium">Website URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={data.raw.url}
                  onChange={(e) => updateRaw('url', e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            )}

            {data.type === 'text' && (
              <div className="space-y-2">
                <Label htmlFor="text-input" className="text-xs font-medium">Plain Text Message</Label>
                <Textarea
                  id="text-input"
                  rows={3}
                  placeholder="Enter any text message..."
                  value={data.raw.text}
                  onChange={(e) => updateRaw('text', e.target.value)}
                  className="text-sm resize-none"
                />
              </div>
            )}

            {data.type === 'email' && (
              <div className="space-y-3">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="email-to" className="text-xs font-medium">Recipient Email</Label>
                    <Input
                      id="email-to"
                      type="email"
                      placeholder="recipient@example.com"
                      value={data.raw.email.to}
                      onChange={(e) => updateRaw('email', { ...data.raw.email, to: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email-subj" className="text-xs font-medium">Subject</Label>
                    <Input
                      id="email-subj"
                      placeholder="Hello from ZashQr"
                      value={data.raw.email.subject}
                      onChange={(e) => updateRaw('email', { ...data.raw.email, subject: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email-body" className="text-xs font-medium">Body Message</Label>
                  <Textarea
                    id="email-body"
                    rows={2}
                    placeholder="Optional message body..."
                    value={data.raw.email.body}
                    onChange={(e) => updateRaw('email', { ...data.raw.email, body: e.target.value })}
                  />
                </div>
              </div>
            )}

            {data.type === 'phone' && (
              <div className="space-y-2">
                <Label htmlFor="phone-input" className="text-xs font-medium">Phone Number</Label>
                <Input
                  id="phone-input"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={data.raw.phone}
                  onChange={(e) => updateRaw('phone', e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            )}

            {data.type === 'wifi' && (
              <div className="space-y-3">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="wifi-ssid" className="text-xs font-medium">Network Name (SSID)</Label>
                    <Input
                      id="wifi-ssid"
                      placeholder="e.g. MyHomeNetwork"
                      value={data.raw.wifi.ssid}
                      onChange={(e) => updateRaw('wifi', { ...data.raw.wifi, ssid: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="wifi-pass" className="text-xs font-medium">Password</Label>
                    <Input
                      id="wifi-pass"
                      type="password"
                      placeholder="Network password"
                      value={data.raw.wifi.pass}
                      onChange={(e) => updateRaw('wifi', { ...data.raw.wifi, pass: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Encryption Type</Label>
                  <div className="flex gap-2">
                    {(['WPA', 'WEP', 'nopass'] as const).map((enc) => (
                      <button
                        key={enc}
                        type="button"
                        onClick={() => updateRaw('wifi', { ...data.raw.wifi, encryption: enc })}
                        className={cn(
                          "px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors",
                          data.raw.wifi.encryption === enc
                            ? "bg-foreground text-background font-semibold"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {enc === 'nopass' ? 'None (Open)' : enc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Step 3: Design & Styling — tabbed customization (full width of left section) */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">3</span>
                <span>Customize Appearance</span>
              </div>
              <button
                type="button"
                onClick={handleResetOptions}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Category Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border/50 overflow-x-auto">
              {([
                { id: 'colors' as const, label: 'Colors', icon: Palette },
                { id: 'patterns' as const, label: 'Patterns', icon: Shapes },
                { id: 'logo' as const, label: 'Logo', icon: ImageIcon },
                { id: 'advanced' as const, label: 'Advanced', icon: Settings2 }
              ]).map((tab) => {
                const Icon = tab.icon;
                const active = customTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCustomTab(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all duration-150 min-w-fit",
                      active
                        ? "bg-background text-foreground shadow-xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground border border-transparent"
                    )}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Colors & Themes */}
            {customTab === 'colors' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Curated Palettes</Label>
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                    {colorPresets.map((preset) => {
                      const active = options.fgColor === preset.fg && options.bgColor === preset.bg;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setOptions((prev) => ({ ...prev, fgColor: preset.fg, bgColor: preset.bg }))}
                          title={preset.name}
                          className={cn(
                            "relative w-8 h-8 rounded-full border-2 transition-all shrink-0",
                            active ? "border-primary scale-110" : "border-border/60 hover:scale-105"
                          )}
                          style={{ backgroundColor: preset.fg }}
                        >
                          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white/60" style={{ backgroundColor: preset.bg }} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fg-color" className="text-xs font-medium">Foreground</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="fg-color"
                        value={options.fgColor}
                        onChange={(e) => setOptions((prev) => ({ ...prev, fgColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-border cursor-pointer p-0.5 bg-background shadow-xs shrink-0"
                      />
                      <Input
                        type="text"
                        value={options.fgColor}
                        onChange={(e) => setOptions((prev) => ({ ...prev, fgColor: e.target.value }))}
                        className="font-mono text-xs uppercase !h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="bg-color" className="text-xs font-medium">Background</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="bg-color"
                        value={isTransparentBg ? '#ffffff' : options.bgColor}
                        disabled={isTransparentBg}
                        onChange={(e) => setOptions((prev) => ({ ...prev, bgColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-border cursor-pointer p-0.5 bg-background shadow-xs shrink-0 disabled:opacity-40"
                      />
                      <Input
                        type="text"
                        value={options.bgColor}
                        disabled={isTransparentBg}
                        onChange={(e) => setOptions((prev) => ({ ...prev, bgColor: e.target.value }))}
                        className="font-mono text-xs uppercase !h-8 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    title="Invert colors"
                    disabled={isTransparentBg}
                    onClick={() => setOptions((prev) => ({ ...prev, fgColor: prev.bgColor === 'transparent' ? prev.fgColor : prev.bgColor, bgColor: prev.fgColor }))}
                    className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60 transition-all disabled:opacity-40"
                  >
                    <Contrast size={13} />
                  </button>
                  <button
                    type="button"
                    title={isTransparentBg ? 'Solid background' : 'Transparent background'}
                    onClick={() => setOptions((prev) => ({
                      ...prev,
                      bgColor: isTransparentBg ? '#ffffff' : 'transparent'
                    }))}
                    className={cn(
                      "w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
                      isTransparentBg
                        ? "border-primary/50 text-primary bg-primary/5"
                        : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60"
                    )}
                  >
                    <Droplet size={13} />
                  </button>
                  <button
                    type="button"
                    title="Save color combo"
                    onClick={handleSaveCombo}
                    className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60 transition-all"
                  >
                    <Save size={13} />
                  </button>
                </div>

                {savedCombos.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Saved Combos</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {savedCombos.map((combo, i) => (
                        <div key={i} className="group relative">
                          <button
                            type="button"
                            onClick={() => setOptions((prev) => ({ ...prev, fgColor: combo.fg, bgColor: combo.bg }))}
                            title={`${combo.fg} on ${combo.bg}`}
                            className="w-8 h-8 rounded-lg border border-border/60 shadow-xs transition-transform hover:scale-105"
                            style={{ backgroundColor: combo.bg }}
                          >
                            <div className="w-3 h-3 rounded-full mx-auto mt-2.5" style={{ backgroundColor: combo.fg }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => persistCombos(savedCombos.filter((_, idx) => idx !== i))}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete saved combo"
                          >
                            <Trash2 size={9} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Patterns & Shapes */}
            {customTab === 'patterns' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Data Pattern Style</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['square', 'rounded', 'dots'] as ModuleStyle[]).map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setOptions((prev) => ({ ...prev, moduleStyle: style }))}
                        className={cn(
                          "py-1.5 rounded-md border text-[11px] font-medium capitalize transition-all",
                          options.moduleStyle === style
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border/60 hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1.5 block">Corner Finder Style</Label>
                    <div className="grid grid-cols-2 gap-1">
                      {(['square', 'rounded'] as FinderStyle[]).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setOptions((prev) => ({ ...prev, finderStyle: style }))}
                          className={cn(
                            "py-1.5 rounded-md border text-[11px] font-medium capitalize transition-all",
                            options.finderStyle === style
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border/60 hover:bg-muted text-muted-foreground"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="finder-color" className="text-xs font-medium mb-1.5 block">Finder Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="finder-color"
                        value={effectiveFinderColor}
                        onChange={(e) => setOptions((prev) => ({ ...prev, finderColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-border cursor-pointer p-0.5 bg-background shadow-xs shrink-0"
                      />
                      <Input
                        type="text"
                        value={effectiveFinderColor}
                        onChange={(e) => setOptions((prev) => ({ ...prev, finderColor: e.target.value }))}
                        className="font-mono text-xs uppercase !h-8"
                      />
                      {options.finderColor && (
                        <button
                          type="button"
                          onClick={() => setOptions((prev) => ({ ...prev, finderColor: undefined }))}
                          className="text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                        >
                          Match QR
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logo & Branding */}
            {customTab === 'logo' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload-input"
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 rounded-md text-xs gap-1.5"
                  >
                    <ImageIcon size={12} />
                    <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                  </Button>
                  {logoPreview && (
                    <>
                      <div className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-lg bg-muted/60 border border-border">
                        <img src={logoPreview} alt="Logo preview" className="w-5 h-5 rounded object-contain" />
                        <span className="text-[11px] text-muted-foreground">Attached</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-[11px] text-red-500 hover:text-red-600 flex items-center gap-0.5 transition-colors"
                      >
                        <X size={11} /> Remove
                      </button>
                    </>
                  )}
                </div>

                {logoPreview ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Show logo in QR</Label>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={options.logoEnabled !== false}
                        onClick={() => setOptions((prev) => ({ ...prev, logoEnabled: !(prev.logoEnabled !== false) }))}
                        className={cn(
                          "relative w-8 h-[18px] rounded-full transition-colors",
                          options.logoEnabled !== false ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform",
                          options.logoEnabled !== false ? "translate-x-[18px]" : "translate-x-0.5"
                        )} />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">Logo Size</Label>
                        <span className="text-[11px] text-muted-foreground font-mono">{Math.round((options.logoScale ?? 0.26) * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={15}
                        max={38}
                        value={Math.round((options.logoScale ?? 0.26) * 100)}
                        onChange={(e) => setOptions((prev) => ({ ...prev, logoScale: Number(e.target.value) / 100 }))}
                        className="w-full h-1.5 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">Badge Padding</Label>
                        <span className="text-[11px] text-muted-foreground font-mono">{options.logoPadding ?? 4}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={16}
                        value={options.logoPadding ?? 4}
                        onChange={(e) => setOptions((prev) => ({ ...prev, logoPadding: Number(e.target.value) }))}
                        className="w-full h-1.5 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
                      />
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Uploading a logo automatically switches error correction to Level H for reliable scanning.
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Upload a PNG or SVG logo to embed it in the center of your QR code.
                  </p>
                )}
              </div>
            )}

            {/* Advanced Settings */}
            {customTab === 'advanced' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div>
                  <Label className="text-xs font-medium mb-1.5 flex items-center justify-between">
                    <span>Error Correction</span>
                    <span className="text-[11px] text-muted-foreground font-mono">Level {options.errorCorrectionLevel}</span>
                  </Label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setOptions((prev) => ({ ...prev, errorCorrectionLevel: lvl }))}
                        className={cn(
                          "py-1.5 rounded-md border text-[11px] font-medium transition-all",
                          options.errorCorrectionLevel === lvl
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border/60 hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Higher levels recover from damage but produce denser codes. H is recommended with a logo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs font-medium">Quiet Zone</Label>
                      <span className="text-[11px] text-muted-foreground font-mono">{options.quietZone ?? 16}px</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={32}
                      value={options.quietZone ?? 16}
                      onChange={(e) => setOptions((prev) => ({ ...prev, quietZone: Number(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs font-medium">QR Size</Label>
                      <span className="text-[11px] text-muted-foreground font-mono">{options.size}px</span>
                    </div>
                    <input
                      type="range"
                      min={160}
                      max={280}
                      step={10}
                      value={options.size}
                      onChange={(e) => setOptions((prev) => ({ ...prev, size: Number(e.target.value) }))}
                      className="w-full h-1.5 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium mb-1.5 block">PNG Export Resolution</Label>
                  <div className="grid grid-cols-3 gap-1">
                    {[1200, 1600, 2048].map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setExportSize(res)}
                        className={cn(
                          "py-1.5 rounded-md border text-[11px] font-medium transition-all",
                          exportSize === res
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border/60 hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {res}px
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Formats: PNG, SVG (vector)</span>
                  <span>Copy: PNG to clipboard</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Live QR Preview & Actions */}
      <div className="lg:col-span-4 order-first lg:order-none h-full space-y-3">
        <Card className="border border-border/80 shadow-md overflow-hidden h-full flex flex-col">
          <CardHeader className="pb-2 border-b border-border/40 bg-muted/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" />
                <span>Live Preview</span>
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    data.value ? "bg-green-400" : "bg-zinc-400"
                  )} />
                  <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    data.value ? "bg-green-500" : "bg-zinc-500"
                  )} />
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {data.value ? 'Live' : 'Standby'}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-muted/20">
            {data.value ? (
              <div className="p-4 rounded-2xl shadow-sm border border-border/60 bg-white dark:bg-zinc-950 transition-all duration-300 transform hover:scale-[1.01]">
                <QRCodeSVG
                  value={data.value}
                  fgColor={options.fgColor}
                  bgColor={options.bgColor}
                  moduleStyle={options.moduleStyle}
                  finderStyle={options.finderStyle}
                  finderColor={options.finderColor}
                  logoUrl={options.logoUrl}
                  logoEnabled={options.logoEnabled}
                  logoScale={options.logoScale}
                  logoPadding={options.logoPadding}
                  quietZone={options.quietZone}
                  size={options.size}
                  errorCorrectionLevel={options.errorCorrectionLevel}
                />
              </div>
            ) : (
              <div className="w-[200px] h-[200px] rounded-xl border-2 border-dashed border-border/80 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                <QrCode size={44} strokeWidth={1.5} className="mb-3 opacity-40" />
                <p className="text-sm font-medium text-foreground">Your QR code will appear here</p>
                <p className="text-xs text-muted-foreground mt-1">Enter content to get started.</p>
              </div>
            )}

            <div className="mt-3 text-center h-4">
              {data.value ? (
                <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                  <Check size={13} /> Ready to download
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Waiting for input...</span>
              )}
            </div>
          </CardContent>

          {/* Download & Actions Footer */}
          <CardFooter className="p-4 bg-muted/20 border-t border-border/40 flex gap-2.5">
            <div className="flex-1 relative" ref={downloadMenuRef}>
              <Button
                type="button"
                disabled={!data.value}
                onClick={() => setDownloadFormatOpen(!downloadFormatOpen)}
                className="w-full h-9 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <Download size={16} />
                <span>Download QR</span>
                <ChevronDown size={14} className={cn("transition-transform duration-200 opacity-70", downloadFormatOpen ? "rotate-180" : "")} />
              </Button>

              {/* Format Dropdown Menu */}
              {downloadFormatOpen && data.value && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-popover text-popover-foreground rounded-xl border border-border shadow-xl p-1.5 space-y-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <button
                    type="button"
                    onClick={() => handleDownload('png')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium hover:bg-muted transition-colors text-left"
                  >
                    <span className="font-semibold">PNG Image</span>
                    <span className="text-muted-foreground text-[11px]">High-Res (1200px)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload('svg')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium hover:bg-muted transition-colors text-left"
                  >
                    <span className="font-semibold">SVG Vector</span>
                    <span className="text-muted-foreground text-[11px]">Scalable print</span>
                  </button>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={!data.value}
              onClick={handleCopy}
              title="Copy QR image to clipboard"
              className="h-9 px-3.5 rounded-lg border-border/80 hover:bg-muted flex items-center gap-1.5 text-xs font-medium"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </Button>
          </CardFooter>
        </Card>

        {/* Quality Protection / Contrast Warning */}
        {isLowContrast && data.value && (
          <div className="p-3.5 rounded-xl border border-amber-300/80 bg-amber-50/80 dark:bg-amber-950/40 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Low contrast warning: </span>
              <span>The contrast between foreground and background is low ({contrastRatio.toFixed(1)}:1). This may affect scanner readability.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
