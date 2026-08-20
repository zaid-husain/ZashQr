import React from 'react';
import { Heading1, Heading2, AlignLeft, Sparkles } from 'lucide-react';
import type { TextElement } from '../../../types/template';

interface TextTabProps {
  onAddElement: (data: Partial<TextElement> & { type: 'text' }) => void;
}

export const TextTab: React.FC<TextTabProps> = ({ onAddElement }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Add Text</h3>
        <p className="text-xs text-muted-foreground">Click to add editable text directly onto canvas.</p>
      </div>

      {/* Standard Hierarchy Blocks */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() =>
            onAddElement({
              type: 'text',
              name: 'Heading',
              text: 'Add a heading',
              fontSize: 36,
              fontFamily: 'Inter',
              fontWeight: '800',
              color: '#09090b',
              textAlign: 'left',
              width: 380,
              height: 50,
              lineHeight: 1.2
            })
          }
          className="w-full p-3 rounded-xl border border-border bg-card hover:bg-muted text-left transition-all flex items-center justify-between group shadow-xs"
        >
          <span className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">
            Add a heading
          </span>
          <Heading1 size={18} className="text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={() =>
            onAddElement({
              type: 'text',
              name: 'Subheading',
              text: 'Add a subheading',
              fontSize: 20,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: '#3f3f46',
              textAlign: 'left',
              width: 320,
              height: 35,
              lineHeight: 1.3
            })
          }
          className="w-full p-3 rounded-xl border border-border bg-card hover:bg-muted text-left transition-all flex items-center justify-between group shadow-xs"
        >
          <span className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors">
            Add a subheading
          </span>
          <Heading2 size={16} className="text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={() =>
            onAddElement({
              type: 'text',
              name: 'Paragraph',
              text: 'Add a little bit of body text. Share important details, descriptions, or event schedules.',
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: '400',
              color: '#71717a',
              textAlign: 'left',
              width: 340,
              height: 60,
              lineHeight: 1.5
            })
          }
          className="w-full p-3 rounded-xl border border-border bg-card hover:bg-muted text-left transition-all flex items-center justify-between group shadow-xs"
        >
          <span className="text-xs font-normal text-muted-foreground group-hover:text-foreground transition-colors">
            Add a paragraph of body text
          </span>
          <AlignLeft size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="pt-2">
        <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1">
          <Sparkles size={13} className="text-primary" />
          <span>Quick Badges & Labels</span>
        </h4>

        <div className="grid grid-cols-2 gap-2">
          {/* Badge Pill */}
          <button
            type="button"
            onClick={() =>
              onAddElement({
                type: 'text',
                name: 'Badge Pill',
                text: 'SPECIAL OFFER',
                fontSize: 11,
                fontFamily: 'Inter',
                fontWeight: '800',
                color: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                borderRadius: 14,
                textAlign: 'center',
                letterSpacing: 2,
                textTransform: 'uppercase',
                padding: 6,
                width: 140,
                height: 28
              })
            }
            className="p-2.5 rounded-xl border border-border bg-muted/20 hover:bg-muted text-center transition-all"
          >
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600">
              FEATURED BADGE
            </span>
          </button>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() =>
              onAddElement({
                type: 'text',
                name: 'CTA Button',
                text: 'SCAN TO ORDER',
                fontSize: 12,
                fontFamily: 'Inter',
                fontWeight: '800',
                color: '#ffffff',
                backgroundColor: '#18181b',
                borderRadius: 12,
                textAlign: 'center',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                padding: 8,
                width: 160,
                height: 36
              })
            }
            className="p-2.5 rounded-xl border border-border bg-muted/20 hover:bg-muted text-center transition-all"
          >
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-zinc-900 text-white shadow-xs">
              CTA BUTTON
            </span>
          </button>

          {/* Scan Callout */}
          <button
            type="button"
            onClick={() =>
              onAddElement({
                type: 'text',
                name: 'Scan Callout',
                text: 'POINT CAMERA TO SCAN',
                fontSize: 11,
                fontFamily: 'Inter',
                fontWeight: '800',
                color: '#059669',
                textAlign: 'center',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                width: 200,
                height: 24
              })
            }
            className="p-2.5 rounded-xl border border-border bg-muted/20 hover:bg-muted text-center transition-all"
          >
            <span className="text-[11px] font-bold text-emerald-600">
              SCAN PROMPT
            </span>
          </button>

          {/* Star Review Tag */}
          <button
            type="button"
            onClick={() =>
              onAddElement({
                type: 'text',
                name: 'Rating Text',
                text: '★★★★★ 5.0 RATED',
                fontSize: 12,
                fontFamily: 'Inter',
                fontWeight: '700',
                color: '#d97706',
                textAlign: 'center',
                letterSpacing: 1,
                width: 160,
                height: 24
              })
            }
            className="p-2.5 rounded-xl border border-border bg-muted/20 hover:bg-muted text-center transition-all"
          >
            <span className="text-[11px] font-bold text-amber-600">
              ★★★★★ RATING
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
