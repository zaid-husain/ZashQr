import React from 'react';
import { Globe, Wifi, Contact, Mail, Phone, MessageSquare } from 'lucide-react';
import type { QRElement, TemplateDocument } from '../../../types/template';

interface QRTabProps {
  currentTemplate: TemplateDocument;
  onAddElement: (data: Partial<QRElement> & { type: 'qr' }) => void;
}

export const QRTab: React.FC<QRTabProps> = ({ onAddElement }) => {
  const qrPresets = [
    {
      label: 'Website Link',
      icon: Globe,
      qrType: 'url' as const,
      value: 'https://example.com',
      fgColor: '#09090b',
      bgColor: '#ffffff',
      moduleStyle: 'rounded' as const,
      desc: 'Link to any landing page, menu, or portal'
    },
    {
      label: 'WiFi Connect',
      icon: Wifi,
      qrType: 'wifi' as const,
      value: 'WIFI:T:WPA;S:Guest_WiFi;P:Welcome2026;H:;',
      fgColor: '#0284c7',
      bgColor: '#ffffff',
      moduleStyle: 'rounded' as const,
      desc: 'Instant password-free guest WiFi connection'
    },
    {
      label: 'Digital vCard',
      icon: Contact,
      qrType: 'url' as const,
      value: 'https://vcard.bio/profile',
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      moduleStyle: 'dots' as const,
      desc: 'Direct phone contact & social details'
    },
    {
      label: 'WhatsApp Chat',
      icon: MessageSquare,
      qrType: 'url' as const,
      value: 'https://wa.me/15551234567',
      fgColor: '#047857',
      bgColor: '#ffffff',
      moduleStyle: 'rounded' as const,
      desc: 'Start direct WhatsApp messaging'
    },
    {
      label: 'Phone Call',
      icon: Phone,
      qrType: 'phone' as const,
      value: 'tel:+18005550199',
      fgColor: '#9a3412',
      bgColor: '#ffffff',
      moduleStyle: 'rounded' as const,
      desc: 'Immediate dial with one tap'
    },
    {
      label: 'Email Dispatch',
      icon: Mail,
      qrType: 'email' as const,
      value: 'mailto:contact@domain.com?subject=Inquiry',
      fgColor: '#4f46e5',
      bgColor: '#ffffff',
      moduleStyle: 'square' as const,
      desc: 'Pre-filled email message'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">QR Elements</h3>
        <p className="text-xs text-muted-foreground">Add and configure interactive QR codes.</p>
      </div>

      <div className="space-y-2">
        {qrPresets.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() =>
                onAddElement({
                  type: 'qr',
                  name: `${preset.label} QR`,
                  qrType: preset.qrType,
                  value: preset.value,
                  raw: { url: preset.value },
                  fgColor: preset.fgColor,
                  bgColor: preset.bgColor,
                  moduleStyle: preset.moduleStyle,
                  finderStyle: 'rounded',
                  errorCorrectionLevel: 'H',
                  padding: 14,
                  borderRadius: 16,
                  width: 200,
                  height: 200
                })
              }
              className="w-full p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-left transition-all flex items-start gap-3 group shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {preset.label}
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-1">
                  {preset.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
