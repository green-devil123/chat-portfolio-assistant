import type { ReactNode } from 'react';
import type { View } from '../../types';

type RightPanelProps = {
  view: View;
  children?: ReactNode;
};

const VIEW_LABELS: Record<View, string> = {
  home: 'Home',
  projects: 'Projects',
  education: 'Education',
  contacts: 'Contacts',
};

export function RightPanel({ view, children }: RightPanelProps) {
  return (
    <section
      className="grain relative flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-ink"
      aria-label={`${VIEW_LABELS[view]} panel`}
    >
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}
