import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, QrCode, MessageCircle, MapPin, Briefcase, Store, ArrowRight, ExternalLink } from 'lucide-react';
import { CREATOR, ECOSYSTEM_URL, ECOSYSTEM_PRODUCTS } from '../../config/site';

const iconMap: Record<string, React.ElementType> = {
  Zashly: MessageCircle,
  Zashub: MapPin,
  Zashio: Briefcase,
  ZashBiz: Store,
  ZashQr: QrCode
};

const products = ECOSYSTEM_PRODUCTS.map((p) => ({
  name: p.name,
  tagline: p.tagline,
  description: p.name === 'ZashQr'
    ? 'A free QR code studio for generating, customizing, and exporting beautiful QR codes and templates.'
    : `A modern web application in the Zashly ecosystem: ${p.tagline.toLowerCase()}.`,
  features: p.name === 'ZashQr'
    ? ['QR generation', 'Logo embedding', 'Template designer', 'PNG & SVG export']
    : ['Web app', 'Zashly ecosystem'],
  href: p.url,
  internal: 'internal' in p && p.internal,
  icon: iconMap[p.name] || Globe
}));

export const EcosystemPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Globe size={13} />
          Zashly Ecosystem
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Modern digital products by Zaid Husain
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          The Zashly ecosystem is a collection of focused web applications built by{' '}
          <Link to="/about/zaid-husain" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            Zaid Husain
          </Link>
          . Each product solves a specific problem with a clean, fast, and privacy-conscious approach.
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.name}
            className="p-5 rounded-2xl border border-border/60 bg-card flex flex-col gap-3 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center">
                  <p.icon size={17} className="text-foreground" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">{p.name}</h2>
                  <p className="text-[11px] font-medium text-primary">{p.tagline}</p>
                </div>
              </div>
              {p.internal ? (
                <Link
                  to={p.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
                >
                  Open <ArrowRight size={12} />
                </Link>
              ) : (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Visit <ExternalLink size={11} />
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
              {p.features.map((f) => (
                <span
                  key={f}
                  className="px-2 py-0.5 rounded-md bg-muted/50 border border-border/40 text-[10px] font-medium text-muted-foreground"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Creator link */}
      <div className="p-5 rounded-2xl border border-border/60 bg-muted/20 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          All Zashly products are created and maintained by{' '}
          <Link to="/about/zaid-husain" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            {CREATOR.name}
          </Link>
          .
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4 transition-colors"
          >
            Learn more about ZashQr <ArrowRight size={12} />
          </Link>
          <a
            href={ECOSYSTEM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Visit {CREATOR.name}'s portfolio <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};
