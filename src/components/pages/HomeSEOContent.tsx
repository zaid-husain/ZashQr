import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Palette, Image as ImageIcon, ShieldCheck, Download, LayoutTemplate, ArrowRight } from 'lucide-react';

const sections = [
  {
    icon: QrCode,
    title: 'Free QR Code Generator',
    text: 'Generate QR codes for websites, plain text, email addresses, phone numbers, and Wi-Fi networks — instantly and completely free.'
  },
  {
    icon: Palette,
    title: 'Custom QR Code Design',
    text: 'Personalize your QR code with custom foreground and background colors, rounded or dotted modules, styled finder patterns, and transparent backgrounds.'
  },
  {
    icon: ImageIcon,
    title: 'QR Codes with Logo',
    text: 'Upload your logo or brand image and embed it in the center of your QR code. Automatic error correction keeps codes scannable.'
  },
  {
    icon: LayoutTemplate,
    title: 'Editable QR Templates',
    text: 'Browse 100+ professional templates for flyers, posters, menus, business cards, invitations, and social media — all fully editable.'
  },
  {
    icon: Download,
    title: 'High-Quality Export',
    text: 'Download your designs as high-resolution PNG images or scalable SVG vectors, ready for print or digital use.'
  },
  {
    icon: ShieldCheck,
    title: 'Private by Design',
    text: 'ZashQr runs entirely in your browser. No uploads, no accounts, no tracking — your content never leaves your device.'
  }
];

export const HomeSEOContent: React.FC = () => {
  return (
    <section className="mt-14 lg:mt-20 border-t border-border/50 pt-10 lg:pt-14 space-y-8">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Everything you need to create QR codes
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          ZashQr is a free QR code generator and template designer built by{' '}
          <Link to="/about/zaid-husain" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            Zaid Husain
          </Link>{' '}
          as part of the{' '}
          <Link to="/ecosystem" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            Zashly ecosystem
          </Link>
          . Create, customize, and download professional QR codes in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <div key={s.title} className="p-4 rounded-2xl border border-border/50 bg-card/60 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <s.icon size={15} className="text-primary" />
              {s.title}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/templates"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Browse QR Templates <ArrowRight size={14} />
        </Link>
        <Link
          to="/generator"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          Open QR Generator
        </Link>
      </div>
    </section>
  );
};
