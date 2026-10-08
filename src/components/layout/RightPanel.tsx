import type { ReactNode } from 'react';
import type { View } from '../../types';

type RightPanelProps = {
  view: View;
  children?: ReactNode;
};

const VIEW_LABELS: Record<View, string> = {
  home: 'Assistant_Terminal',
  projects: 'Projects_Directory',
  education: 'Education_Log',
  contacts: 'Contact_Registry',
};

const CUT_FRAME =
  'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))';

export function RightPanel({ view, children }: RightPanelProps) {
  return (
    <section
      className="grain relative flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-ink"
      aria-label={`${VIEW_LABELS[view]} panel`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-30"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgb(0 20 8 / 0.45) 100%)',
          borderRadius: '18px / 12px',
          boxShadow: 'inset 0 0 60px rgb(0 0 0 / 0.5)',
        }}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col p-3 sm:p-4">
        <div
          className="flex min-h-0 flex-1 flex-col border-2 border-line"
          style={{ clipPath: CUT_FRAME }}
        >
          <header className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-line bg-gold/[0.03] px-4 py-1.5">
            <span className="flex min-w-0 items-center gap-2 font-terminal text-[0.78rem] uppercase tracking-[0.3em] text-gold phosphor-text">
              <span aria-hidden="true">▍</span>
              <span className="truncate">{VIEW_LABELS[view]}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-[0.64rem] uppercase tracking-[0.24em] text-ivory-muted phosphor-text">
              <span
                className="inline-block h-1.5 w-1.5 bg-gold shadow-[0_0_4px_rgb(0_255_65/0.6)] animate-blink"
                aria-hidden="true"
              />
              Link_Stable
            </span>
          </header>

          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </div>
      </div>
    </section>
  );
}
