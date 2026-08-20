import React, { useRef } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  Lock,
  Unlock,
  X,
  Link,
  Wifi,
  Mail,
  Phone,
  AlignLeft
} from 'lucide-react';
import type { QRElement, QRType, ModuleStyle, FinderStyle } from '../../../types/template';
import { ColorPicker } from '../../ui/ColorPicker';
import { Slider } from '../../ui/Slider';

interface QRPropertiesProps {
  element: QRElement;
  onUpdate: (id: string, updates: Partial<QRElement>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QRProperties: React.FC<QRPropertiesProps> = ({
  element,
  onUpdate,
  onDuplicate,
  onDelete
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (type: QRType) => {
    let newVal = 'https://example.com';
    let rawObj: any = {};

    if (type === 'url') {
      newVal = element.raw?.url || 'https://example.com';
      rawObj = { url: newVal };
    } else if (type === 'phone') {
      newVal = element.raw?.phone ? `tel:${element.raw.phone}` : 'tel:+18005550199';
      rawObj = { phone: element.raw?.phone || '+18005550199' };
    } else if (type === 'wifi') {
      const wf = element.raw?.wifi || { ssid: 'MyNetwork', pass: 'MyPassword', encryption: 'WPA' };
      newVal = `WIFI:T:${wf.encryption};S:${wf.ssid};P:${wf.pass};H:;`;
      rawObj = { wifi: wf };
    } else if (type === 'email') {
      const em = element.raw?.email || { to: 'hello@example.com', subject: 'Inquiry', body: '' };
      newVal = `mailto:${em.to}?subject=${encodeURIComponent(em.subject || '')}`;
      rawObj = { email: em };
    } else if (type === 'text') {
      newVal = element.raw?.text || element.value || 'Scan Me';
      rawObj = { text: newVal };
    }

    onUpdate(element.id, {
      qrType: type,
      value: newVal,
      raw: rawObj
    });
  };

  const handleRawChange = (field: string, val: any) => {
    const raw = { ...element.raw, [field]: val };
    let formattedVal = '';

    if (element.qrType === 'url') {
      formattedVal = typeof val === 'string' ? val : (raw.url ?? '');
    } else if (element.qrType === 'text') {
      formattedVal = typeof val === 'string' ? val : (raw.text ?? '');
    } else if (element.qrType === 'phone') {
      const ph = typeof val === 'string' ? val : (raw.phone ?? '');
      formattedVal = ph ? `tel:${ph}` : '';
    } else if (element.qrType === 'email') {
      const em = raw.email || { to: '', subject: '', body: '' };
      formattedVal = em.to ? `mailto:${em.to}?subject=${encodeURIComponent(em.subject || '')}` : '';
    } else if (element.qrType === 'wifi') {
      const wf = raw.wifi || { ssid: '', pass: '', encryption: 'WPA' };
      formattedVal = `WIFI:T:${wf.encryption};S:${wf.ssid};P:${wf.pass};H:;`;
    }

    onUpdate(element.id, { raw, value: formattedVal });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUpdate(element.id, { logoUrl: result, errorCorrectionLevel: 'H' });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentUrlValue = element.raw?.url !== undefined ? element.raw.url : (element.value || '');
  const currentPhoneValue = element.raw?.phone !== undefined ? element.raw.phone : (element.value?.replace(/^tel:/, '') || '');
  const currentTextValue = element.raw?.text !== undefined ? element.raw.text : (element.value || '');

  const QR_TYPE_CONFIG: { type: QRType; label: string; icon: React.FC<any> }[] = [
    { type: 'url', label: 'URL', icon: Link },
    { type: 'wifi', label: 'WiFi', icon: Wifi },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'phone', label: 'Phone', icon: Phone },
    { type: 'text', label: 'Text', icon: AlignLeft }
  ];

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <span className="text-xs font-bold text-foreground">QR Settings</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdate(element.id, { isLocked: !element.isLocked })}
            title={element.isLocked ? 'Unlock' : 'Lock'}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {element.isLocked ? <Lock size={13} className="text-primary" /> : <Unlock size={13} />}
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(element.id)}
            title="Duplicate"
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(element.id)}
            title="Delete"
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* QR Content Type Picker */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-foreground/80 uppercase tracking-wider">Content Type</label>
        <div className="grid grid-cols-5 gap-1 p-1 bg-muted/40 rounded-xl border border-border/80">
          {QR_TYPE_CONFIG.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg transition-all ${
                element.qrType === type
                  ? 'bg-background shadow-sm text-primary ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Icon size={14} />
              <span className="text-[9px] font-bold tracking-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Inputs */}
      {element.qrType === 'url' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground/90">Website URL</label>
            {currentUrlValue && (
              <button
                type="button"
                onClick={() => handleRawChange('url', '')}
                className="text-[10px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
          <div className="relative flex items-center">
            <Link size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
            <input
              type="url"
              value={currentUrlValue}
              onChange={(e) => handleRawChange('url', e.target.value)}
              placeholder="https://example.com"
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-xs font-mono"
            />
          </div>
        </div>
      )}

      {element.qrType === 'phone' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground/90">Phone Number</label>
            {currentPhoneValue && (
              <button
                type="button"
                onClick={() => handleRawChange('phone', '')}
                className="text-[10px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
          <div className="relative flex items-center">
            <Phone size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
            <input
              type="tel"
              value={currentPhoneValue}
              onChange={(e) => handleRawChange('phone', e.target.value)}
              placeholder="+1 800 555 0199"
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-xs font-mono"
            />
          </div>
        </div>
      )}

      {element.qrType === 'wifi' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/90">Network Name (SSID)</label>
            <div className="relative flex items-center">
              <Wifi size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={element.raw?.wifi?.ssid ?? ''}
                onChange={(e) =>
                  handleRawChange('wifi', {
                    ...(element.raw?.wifi || { pass: '', encryption: 'WPA' }),
                    ssid: e.target.value
                  })
                }
                placeholder="e.g. Cafe_WiFi"
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/90">Password</label>
            <div className="relative flex items-center">
              <Lock size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={element.raw?.wifi?.pass ?? ''}
                onChange={(e) =>
                  handleRawChange('wifi', {
                    ...(element.raw?.wifi || { ssid: '', encryption: 'WPA' }),
                    pass: e.target.value
                  })
                }
                placeholder="WiFi Password"
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-xs"
              />
            </div>
          </div>
        </div>
      )}

      {element.qrType === 'email' && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/90">Recipient Email</label>
            <div className="relative flex items-center">
              <Mail size={14} className="absolute left-3 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                value={element.raw?.email?.to ?? ''}
                onChange={(e) =>
                  handleRawChange('email', {
                    ...(element.raw?.email || { subject: '', body: '' }),
                    to: e.target.value
                  })
                }
                placeholder="hello@domain.com"
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/90">Subject Line</label>
            <input
              type="text"
              value={element.raw?.email?.subject ?? ''}
              onChange={(e) =>
                handleRawChange('email', {
                  ...(element.raw?.email || { to: '', body: '' }),
                  subject: e.target.value
                })
              }
              placeholder="Inquiry / Feedback"
              className="w-full h-9 px-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-xs"
            />
          </div>
        </div>
      )}

      {element.qrType === 'text' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground/90">Plain Text Message</label>
            {currentTextValue && (
              <button
                type="button"
                onClick={() => handleRawChange('text', '')}
                className="text-[10px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
          <textarea
            rows={3}
            value={currentTextValue}
            onChange={(e) => handleRawChange('text', e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-3 rounded-xl border border-border bg-muted/20 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 shadow-xs resize-none"
          />
        </div>
      )}

      {/* Styling Controls */}
      <div className="pt-2 space-y-3">
        {/* Module & Finder Patterns */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground/80">Modules</label>
            <select
              value={element.moduleStyle || 'rounded'}
              onChange={(e) => onUpdate(element.id, { moduleStyle: e.target.value as ModuleStyle })}
              className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="square">Classic Square</option>
              <option value="rounded">Smooth Rounded</option>
              <option value="dots">Modern Dots</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground/80">Finders</label>
            <select
              value={element.finderStyle || 'rounded'}
              onChange={(e) => onUpdate(element.id, { finderStyle: e.target.value as FinderStyle })}
              className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="square">Square Corners</option>
              <option value="rounded">Rounded Corners</option>
            </select>
          </div>
        </div>

        {/* Colors */}
        <ColorPicker
          label="Foreground Color"
          value={element.fgColor}
          onChange={(fgColor) => onUpdate(element.id, { fgColor })}
        />

        <ColorPicker
          label="Background Color"
          allowTransparent
          value={element.isTransparentBg ? 'transparent' : element.bgColor}
          onChange={(bgColor) => {
            if (bgColor === 'transparent') {
              onUpdate(element.id, { isTransparentBg: true });
            } else {
              onUpdate(element.id, { bgColor, isTransparentBg: false });
            }
          }}
        />

        {/* Sliders: Quiet Zone / Padding & Radius */}
        <Slider
          label="Quiet Zone (Padding)"
          valueDisplay={`${element.padding || 14}px`}
          min={0}
          max={32}
          value={element.padding || 14}
          onChange={(e) => onUpdate(element.id, { padding: Number(e.target.value) })}
        />

        <Slider
          label="Border Radius"
          valueDisplay={`${element.borderRadius || 0}px`}
          min={0}
          max={40}
          value={element.borderRadius || 0}
          onChange={(e) => onUpdate(element.id, { borderRadius: Number(e.target.value) })}
        />

        {/* Center Logo */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-medium text-foreground/80">Center Logo</label>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          {element.logoUrl ? (
            <div className="flex items-center justify-between p-2 rounded-xl border border-border bg-muted/30">
              <img src={element.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-md bg-white p-0.5" />
              <button
                type="button"
                onClick={() => onUpdate(element.id, { logoUrl: undefined })}
                className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1"
              >
                Remove Logo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-border hover:border-primary/60 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload size={14} />
              <span>Upload Center Logo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
