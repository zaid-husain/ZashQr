import React from 'react';
import { Link } from 'react-router-dom';
import { User, QrCode, ArrowRight, ExternalLink, Code2, Layers, Globe, Link2 } from 'lucide-react';
import { CREATOR, ECOSYSTEM_URL, ECOSYSTEM_PRODUCTS } from '../../config/site';

const techStack = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'SVG Rendering'];

const projects = [
  { name: 'ZashQr', desc: 'QR code generator & template designer', href: '/generator', internal: true },
  ...ECOSYSTEM_PRODUCTS.filter((p) => !('internal' in p && p.internal)).map((p) => ({
    name: p.name,
    desc: p.tagline,
    href: p.url,
    internal: false
  })),
];

export const CreatorPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Hero */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <User size={13} />
          Creator Profile
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Zaid Husain
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Zaid Husain is a software developer and the creator of{' '}
          <Link to="/generator" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            ZashQr
          </Link>
          , a modern QR code generation and template design platform. He is also the developer
          behind the{' '}
          <Link to="/ecosystem" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors">
            Zashly ecosystem
          </Link>
          , a growing collection of digital products built with a focus on speed, privacy, and
          clean design.
        </p>
      </div>

      {/* ZashQr project overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">The ZashQr project</h2>
        <div className="p-5 rounded-2xl border border-border/60 bg-card space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            ZashQr started as a simple idea: QR codes should be easy to create and beautiful to
            use. The result is a free, browser-based studio that handles everything from quick
            URL codes to fully designed, print-ready templates with embedded logos — all without
            sending a single byte of your data to a server.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/50 text-[11px] font-medium text-muted-foreground"
              >
                <Code2 size={11} />
                {tech}
              </span>
            ))}
          </div>
          <a
            href={CREATOR.githubRepo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4 transition-colors"
          >
            View source on GitHub <ExternalLink size={12} />
          </a>
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={CREATOR.portfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              <Globe size={11} /> Portfolio
            </a>
            <a
              href={CREATOR.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              <Link2 size={11} /> LinkedIn
            </a>
            <a
              href={CREATOR.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Ecosystem projects */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Projects in the Zashly ecosystem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((p) => {
            const content = (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {p.internal ? <QrCode size={15} className="text-primary" /> : <Layers size={15} className="text-muted-foreground" />}
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {p.name}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
              </>
            );
            const cls = "group p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-sm transition-all duration-200 block";
            return p.internal ? (
              <Link key={p.name} to={p.href} className={cls}>{content}</Link>
            ) : (
              <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className={cls}>{content}</a>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/ecosystem"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4 transition-colors"
          >
            Learn more about the Zashly ecosystem <ArrowRight size={12} />
          </Link>
          <a
            href={ECOSYSTEM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Visit Zashly online <ExternalLink size={11} />
          </a>
        </div>
      </section>
    </div>
  );
};
