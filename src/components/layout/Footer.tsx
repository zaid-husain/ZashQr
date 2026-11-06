import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/50 bg-background py-8 mt-auto">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
              ZashQr
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                Free
              </span>
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Free QR Code Generator to create, customize, and download beautiful high-resolution QR codes.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-1.5">
            <span className="text-sm text-muted-foreground">
              Co-powered by <strong className="font-medium text-foreground/90">Zashly</strong>
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="font-medium">Explore more:</span>
              <a href="https://zashly.vercel.app" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Zashly</a>
              <span>•</span>
              <a href="https://zashub.vercel.app" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Zashub</a>
              <span>•</span>
              <a href="https://zashio.vercel.app" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors underline-offset-4 hover:underline">Zashio</a>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-border/40 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 font-medium">
            <Link to="/generator" className="hover:text-foreground transition-colors">Generator</Link>
            <Link to="/templates" className="hover:text-foreground transition-colors">Templates</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
          
          <div className="text-xs">
            © {new Date().getFullYear()} Zashly. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
