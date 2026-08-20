import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { QrCode, Sun, Moon, LayoutTemplate, Info, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenAbout
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  
  const isGeneratorActive = location.pathname === '/' || location.pathname === '/generator';
  const isTemplatesActive = location.pathname.startsWith('/templates');

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/85 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Left: Mobile Hamburger & Brand */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mobile Hamburger Button (☰) */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 -ml-1.5 rounded-xl text-foreground hover:bg-muted/70 active:scale-95 transition-all cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Brand Logo */}
            <Link
              to="/generator"
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <QrCode size={18} strokeWidth={2.2} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold tracking-tight text-lg">QR Studio</span>
              </div>
            </Link>

            {/* Desktop & Tablet Navigation Tabs (>= 768px) */}
            <nav className="hidden md:flex items-center bg-muted/40 p-1 rounded-xl border border-border/40 backdrop-blur-sm">
              <Link
                to="/generator"
                className={cn(
                  "relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300",
                  isGeneratorActive
                    ? "bg-background text-foreground shadow-xs border border-border/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                )}
              >
                <QrCode size={16} className={cn(isGeneratorActive ? "text-primary" : "opacity-70")} />
                Generator
              </Link>

              <Link
                to="/templates"
                className={cn(
                  "relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300",
                  isTemplatesActive
                    ? "bg-background text-foreground shadow-xs border border-border/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
                )}
              >
                <LayoutTemplate size={16} className={cn(isTemplatesActive ? "text-primary" : "opacity-70")} />
                Templates
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary border-[1.5px] border-background" />
                </span>
              </Link>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 hover:rotate-12 border border-border/50"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAbout}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border-border/60 hover:bg-muted/50"
            >
              <Info size={16} />
              <span>About</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden",
          mobileDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileDrawerOpen(false)}
      />

      {/* Mobile Navigation Drawer Sheet */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-72 bg-background border-r border-border/60 shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col pt-safe",
          mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-border/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center shadow-xs">
              <QrCode size={18} strokeWidth={2.2} />
            </div>
            <span className="font-bold tracking-tight text-lg">QR Studio</span>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
          
          {/* Main Links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/generator"
              onClick={() => setMobileDrawerOpen(false)}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-colors",
                isGeneratorActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/50 text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <QrCode size={20} className={isGeneratorActive ? "text-primary" : "text-muted-foreground"} />
                Generator
              </div>
              {isGeneratorActive && <ChevronRight size={16} />}
            </Link>

            <Link
              to="/templates"
              onClick={() => setMobileDrawerOpen(false)}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-colors",
                isTemplatesActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/50 text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <LayoutTemplate size={20} className={isTemplatesActive ? "text-primary" : "text-muted-foreground"} />
                Templates
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] uppercase tracking-wider ml-1">
                  New
                </span>
              </div>
              {isTemplatesActive && <ChevronRight size={16} />}
            </Link>
          </nav>

          <div className="w-full h-px bg-border/40" />

          {/* Secondary Actions */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                onToggleTheme();
              }}
              className="flex items-center justify-between px-4 py-3 rounded-xl font-medium hover:bg-muted/50 text-foreground transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 text-sm">
                {darkMode ? <Sun size={18} className="text-muted-foreground" /> : <Moon size={18} className="text-muted-foreground" />}
                Dark Mode
              </div>
              <div className={cn(
                "w-10 h-6 rounded-full p-1 transition-colors relative flex items-center",
                darkMode ? "bg-primary" : "bg-muted-foreground/30"
              )}>
                <div className={cn(
                  "w-4 h-4 bg-background rounded-full shadow-sm transition-transform absolute",
                  darkMode ? "translate-x-4" : "translate-x-0"
                )} />
              </div>
            </button>

            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                onOpenAbout();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium hover:bg-muted/50 text-foreground transition-colors text-sm cursor-pointer"
            >
              <Info size={18} className="text-muted-foreground" />
              About QR Studio
            </button>
          </div>

        </div>

        {/* Drawer Footer Info */}
        <div className="p-4 bg-muted/30 border-t border-border/40 mt-auto pb-safe-offset-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">100% Private</p>
              <p className="text-[11px] text-muted-foreground">Generated locally in your browser</p>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            Co-powered by <strong className="font-semibold">Zashly</strong>
          </p>
        </div>
      </div>
    </>
  );
};
