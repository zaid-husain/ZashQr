import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowUpRight } from 'lucide-react';
import { CREATOR, ECOSYSTEM_URL, ECOSYSTEM_PRODUCTS } from '../../config/site';

const navLinks = [
  { label: 'Generator', to: '/generator' },
  { label: 'Templates', to: '/templates' },
  { label: 'About', to: '/about' },
  { label: 'Privacy', to: '/privacy' },
];

const projectLinks = ECOSYSTEM_PRODUCTS.filter((p) => !('internal' in p && p.internal));

const connectLinks = [
  { label: 'Portfolio', href: CREATOR.portfolio },
  { label: 'LinkedIn', href: CREATOR.linkedin },
  { label: 'GitHub', href: CREATOR.github },
  { label: 'Source Code', href: CREATOR.githubRepo },
];

const headingClass = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80';
const textLinkClass = 'text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/50 bg-background mt-auto">
      <div className="container max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-column editorial layout */}
        <div className="py-10 lg:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] gap-10 lg:gap-8 items-start">
          {/* Column 1: Brand */}
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-xs">
                <QrCode size={16} strokeWidth={2.2} />
              </div>
              <span className="font-bold text-foreground text-base tracking-tight flex items-center gap-2">
                ZashQr
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20 leading-none">
                  Free
                </span>
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[260px]">
              Free QR Code Generator to create, customize, and download high-resolution QR codes.
            </p>
            <p className="text-xs text-muted-foreground">
              Created by{' '}
              <a
                href={CREATOR.portfolio}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                {CREATOR.name}
              </a>
            </p>
          </div>

          {/* Column 2: Navigation */}
          <nav className="flex flex-col items-start gap-2.5" aria-label="Footer navigation">
            <span className={headingClass}>Navigation</span>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={textLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Column 3: Projects */}
          <div className="flex flex-col items-start gap-2.5">
            <span className={headingClass}>Projects</span>
            {projectLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`${textLinkClass} inline-flex items-center gap-1`}
              >
                {link.name}
                <ArrowUpRight size={11} className="opacity-50" />
              </a>
            ))}
            <a
              href={ECOSYSTEM_URL}
              target="_blank"
              rel="noreferrer"
              className={`${textLinkClass} inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80`}
            >
              Explore Zashly
              <ArrowUpRight size={11} />
            </a>
          </div>

          {/* Column 4: Connect */}
          <div className="flex flex-col items-start gap-2.5">
            <span className={headingClass}>Connect</span>
            {connectLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={textLinkClass}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/40 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Designed &amp; Developed by{' '}
            <a
              href={CREATOR.portfolio}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              {CREATOR.name}
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ZashQr · QR Code Generator &amp; Template Designer
          </p>
        </div>
      </div>
    </footer>
  );
};
