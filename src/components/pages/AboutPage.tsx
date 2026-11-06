import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Palette, ShieldCheck, Download, ArrowRight, User, Globe, ExternalLink } from 'lucide-react';
import { CREATOR, ECOSYSTEM_URL, ECOSYSTEM_PRODUCTS } from '../../config/site';

const features = [
  {
    icon: QrCode,
    title: 'Free QR Code Generator',
    text: 'Create QR codes for URLs, plain text, email, phone numbers, and Wi-Fi credentials — no account or signup required.'
  },
  {
    icon: Palette,
    title: 'Custom QR Design',
    text: 'Customize foreground and background colors, module and finder patterns, finder colors, quiet zone, and transparent backgrounds.'
  },
  {
    icon: Download,
    title: 'Logo & High-Res Export',
    text: 'Embed your logo with adjustable size and padding, then export crisp PNG (up to 2048px) or scalable SVG files.'
  },
  {
    icon: ShieldCheck,
    title: '100% Private & Client-Side',
    text: 'Everything runs in your browser. No uploads, no tracking, no backend — your data never leaves your device.'
  }
];

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <QrCode size={13} />
          About ZashQr
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          A free QR code studio, built for creators
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          ZashQr is a free online tool for generating, customizing, and downloading QR codes.
          It combines a fast QR generator with a Canva-inspired template designer, letting you
          turn simple codes into polished, branded designs for print and social media.
        </p>
      </div>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">What you can do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="p-4 rounded-2xl border border-border/60 bg-card space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <f.icon size={16} className="text-primary" />
                {f.title}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Creator & Ecosystem */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Who built it</h2>
        <div className="p-5 rounded-2xl border border-border/60 bg-card space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            ZashQr was created and developed by{' '}
            <Link to="/about/zaid-husain" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              Zaid Husain
            </Link>
            , a software developer, as part of the{' '}
            <Link to="/ecosystem" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              Zashly ecosystem
            </Link>
            . Zashly is a collection of modern digital products —{' '}
            {ECOSYSTEM_PRODUCTS.filter((p) => !('internal' in p && p.internal)).map((p, i, arr) => (
              <React.Fragment key={p.name}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  {p.name}
                </a>
                {i < arr.length - 1 ? ', ' : ', and '}
              </React.Fragment>
            ))}
            {' '}ZashQr — designed to be fast, private, and genuinely useful.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/about/zaid-husain"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <User size={13} /> Meet the creator
            </Link>
            <Link
              to="/ecosystem"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Globe size={13} /> Explore Zashly
              <ArrowRight size={12} />
            </Link>
            <a
              href={ECOSYSTEM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <ExternalLink size={12} /> Zashly Ecosystem
            </a>
          </div>
        </div>
      </section>

      {/* Creator profile section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">About the creator</h2>
        <div className="p-5 rounded-2xl border border-border/60 bg-card space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            ZashQr is created and developed by{' '}
            <Link to="/about/zaid-husain" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              {CREATOR.name}
            </Link>
            , a software developer building modern web products in the Zashly ecosystem.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={CREATOR.portfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              <Globe size={12} /> Portfolio
            </a>
            <a
              href={CREATOR.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              LinkedIn
            </a>
            <a
              href={CREATOR.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
