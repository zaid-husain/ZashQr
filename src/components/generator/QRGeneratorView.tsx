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
  SlidersHorizontal,
  X,
  AlertTriangle
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
    size: 260,
    errorCorrectionLevel: 'M'
  });

  const [logoPreview, setLogoPreview] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [downloadFormatOpen, setDownloadFormatOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const handleDownload = (format: 'png' | 'svg') => {
    setDownloadFormatOpen(false);
    if (!data.value) return;
    if (format === 'png') {
      downloadPNG('qr-preview-svg', 'qr-code', 1200);
      showToast('QR code downloaded as PNG');
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Controls (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Step 1: Type Selection */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
              <span>Select Content Type</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Choose the information you want to encode in your QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
                      "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all duration-150",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "border-border/60 hover:border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon size={18} className="mb-1.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Content Inputs */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
              <span>Enter Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  rows={4}
                  placeholder="Enter any text message..."
                  value={data.raw.text}
                  onChange={(e) => updateRaw('text', e.target.value)}
                  className="text-sm resize-none"
                />
              </div>
            )}

            {data.type === 'email' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email-to" className="text-xs font-medium">Recipient Email</Label>
                  <Input
                    id="email-to"
                    type="email"
                    placeholder="recipient@example.com"
                    value={data.raw.email.to}
                    onChange={(e) => updateRaw('email', { ...data.raw.email, to: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-subj" className="text-xs font-medium">Subject</Label>
                  <Input
                    id="email-subj"
                    placeholder="Hello from QR Studio"
                    value={data.raw.email.subject}
                    onChange={(e) => updateRaw('email', { ...data.raw.email, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-body" className="text-xs font-medium">Body Message</Label>
                  <Textarea
                    id="email-body"
                    rows={3}
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
                <div className="space-y-1.5">
                  <Label htmlFor="wifi-ssid" className="text-xs font-medium">Network Name (SSID)</Label>
                  <Input
                    id="wifi-ssid"
                    placeholder="e.g. MyHomeNetwork"
                    value={data.raw.wifi.ssid}
                    onChange={(e) => updateRaw('wifi', { ...data.raw.wifi, ssid: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="wifi-pass" className="text-xs font-medium">Password</Label>
                  <Input
                    id="wifi-pass"
                    type="password"
                    placeholder="Network password"
                    value={data.raw.wifi.pass}
                    onChange={(e) => updateRaw('wifi', { ...data.raw.wifi, pass: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
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

        {/* Step 3: Design & Styling */}
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                <span>Customize Appearance</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <SlidersHorizontal size={13} />
                <span>{showAdvanced ? 'Hide advanced' : 'More options'}</span>
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Color Presets */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Curated Palettes</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setOptions((prev) => ({ ...prev, fgColor: preset.fg, bgColor: preset.bg }))}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-xl border text-center transition-all group",
                      options.fgColor === preset.fg && options.bgColor === preset.bg
                        ? "border-primary ring-1 ring-primary shadow-xs"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="w-6 h-6 rounded-full border border-border/60 flex items-center justify-center p-0.5 overflow-hidden mb-1 shadow-xs">
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: preset.fg }} />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="fg-color" className="text-xs font-medium">Foreground Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="fg-color"
                    value={options.fgColor}
                    onChange={(e) => setOptions((prev) => ({ ...prev, fgColor: e.target.value }))}
                    className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5 bg-background shadow-xs"
                  />
                  <Input
                    type="text"
                    value={options.fgColor}
                    onChange={(e) => setOptions((prev) => ({ ...prev, fgColor: e.target.value }))}
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bg-color" className="text-xs font-medium">Background Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="bg-color"
                    value={options.bgColor}
                    onChange={(e) => setOptions((prev) => ({ ...prev, bgColor: e.target.value }))}
                    className="w-9 h-9 rounded-lg border border-border cursor-pointer p-0.5 bg-background shadow-xs"
                  />
                  <Input
                    type="text"
                    value={options.bgColor}
                    onChange={(e) => setOptions((prev) => ({ ...prev, bgColor: e.target.value }))}
                    className="font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Module & Finder Shape Styles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Data Pattern Style</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['square', 'rounded', 'dots'] as ModuleStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setOptions((prev) => ({ ...prev, moduleStyle: style }))}
                      className={cn(
                        "py-2 px-1 rounded-lg border text-xs font-medium capitalize transition-all",
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

              <div className="space-y-2">
                <Label className="text-xs font-medium">Corner Finder Style</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['square', 'rounded'] as FinderStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setOptions((prev) => ({ ...prev, finderStyle: style }))}
                      className={cn(
                        "py-2 px-1 rounded-lg border text-xs font-medium capitalize transition-all",
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
            </div>

            {/* Advanced Options Toggle Section */}
            {showAdvanced && (
              <div className="pt-3 space-y-4 border-t border-border/60 animate-in fade-in duration-200">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium flex items-center justify-between">
                    <span>Center Badge / Logo</span>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="text-xs text-red-500 hover:text-red-600 font-normal flex items-center gap-0.5"
                      >
                        <X size={12} /> Remove
                      </button>
                    )}
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl flex items-center gap-2 text-xs"
                    >
                      <ImageIcon size={14} />
                      <span>{logoPreview ? 'Change Logo' : 'Upload Image'}</span>
                    </Button>

                    {logoPreview && (
                      <div className="flex items-center gap-2 p-1.5 px-3 rounded-lg bg-muted/60 border border-border text-xs">
                        <img src={logoPreview} alt="Logo preview" className="w-5 h-5 rounded object-contain" />
                        <span className="text-[11px] text-muted-foreground">Logo attached</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Correction Level */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium flex items-center justify-between">
                    <span>Error Correction Level</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Level {options.errorCorrectionLevel}
                    </span>
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setOptions((prev) => ({ ...prev, errorCorrectionLevel: lvl }))}
                        className={cn(
                          "py-1.5 rounded-lg border text-xs font-medium transition-all",
                          options.errorCorrectionLevel === lvl
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border/60 hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {lvl} {lvl === 'H' ? '(Logo)' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Live QR Preview & Actions (5 cols Sticky) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
        <Card className="border border-border/80 shadow-md overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
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

          <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-b from-transparent to-muted/20 min-h-[340px]">
            {data.value ? (
              <div className="p-4 rounded-2xl shadow-sm border border-border/60 bg-white dark:bg-zinc-950 transition-all duration-300 transform hover:scale-[1.01]">
                <QRCodeSVG
                  value={data.value}
                  fgColor={options.fgColor}
                  bgColor={options.bgColor}
                  moduleStyle={options.moduleStyle}
                  finderStyle={options.finderStyle}
                  logoUrl={options.logoUrl}
                  size={options.size}
                  errorCorrectionLevel={options.errorCorrectionLevel}
                />
              </div>
            ) : (
              <div className="w-[240px] h-[240px] rounded-2xl border-2 border-dashed border-border/80 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <QrCode size={44} strokeWidth={1.5} className="mb-3 opacity-40" />
                <p className="text-sm font-medium text-foreground">Your QR code will appear here</p>
                <p className="text-xs text-muted-foreground mt-1">Enter content to get started.</p>
              </div>
            )}

            <div className="mt-5 text-center h-4">
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
                className="w-full h-11 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2"
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
              className="h-11 px-4 rounded-xl border-border/80 hover:bg-muted flex items-center gap-1.5 text-xs font-medium"
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
