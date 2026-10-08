import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { View } from '../../types';
import { NAV_ITEMS } from './navItems';

type NavProps = {
  activeView: View;
  onNavigate: (view: View) => void;
};

function handleListKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
  const navigationKeys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
  if (!navigationKeys.includes(event.key)) return;

  const buttons = Array.from(event.currentTarget.querySelectorAll('button'));
  const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
  if (currentIndex === -1) return;

  event.preventDefault();
  let nextIndex = currentIndex;
  if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % buttons.length;
  else if (event.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
  } else if (event.key === 'Home') nextIndex = 0;
  else nextIndex = buttons.length - 1;

  buttons[nextIndex]?.focus();
}

function NavList({ activeView, onNavigate }: NavProps) {
  return (
    <nav aria-label="Primary navigation" className="px-3" onKeyDown={handleListKeyDown}>
      <ul className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'group flex w-full items-center gap-3 border-l-2 px-2.5 py-2.5 text-left',
                  'text-[0.8rem] uppercase tracking-[0.18em] transition-colors duration-200',
                  isActive
                    ? 'border-gold bg-white/[0.03] text-gold'
                    : 'border-transparent text-ivory-muted hover:border-line hover:bg-white/[0.02] hover:text-ivory',
                ].join(' ')}
              >
                <Icon
                  className={`h-[1.05rem] w-[1.05rem] shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-gold' : 'text-ivory-muted group-hover:text-ivory-dim'
                  }`}
                />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type BrandProps = {
  showBrand?: boolean;
};

function Brand({ showBrand }: BrandProps) {
  return (
    <div className="px-3">
      {showBrand && (
        <div className="mb-5 flex items-center gap-3 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center border border-gold/45 bg-white/[0.02] font-display text-base tracking-[0.1em] text-gold">
            TA
          </span>
          <span className="display-lg text-lg text-ivory">Tarun Agarwal</span>
        </div>
      )}

      <div className="hidden lg:block">
        <div
          className="flex h-14 w-14 items-center justify-center border border-gold/45 bg-white/[0.02] font-display text-xl tracking-[0.12em] text-gold"
          aria-hidden="true"
        >
          TA
        </div>
        <h1 className="display-lg mt-5 text-[1.6rem] text-ivory">Tarun Agarwal</h1>
        <p className="eyebrow eyebrow--muted mt-1.5 text-[0.63rem] tracking-[0.26em]">
          Software Engineer
        </p>
      </div>

      <div className="rule my-6" />
    </div>
  );
}

export function LeftSidebar({ activeView, onNavigate }: NavProps) {
  return (
    <aside
      className="panel-scroll hidden h-full w-[16.5rem] shrink-0 flex-col border-r border-line bg-ink-soft lg:flex"
      aria-label="Sidebar"
    >
      <div className="flex flex-1 flex-col pt-9 pb-8">
        <Brand />
        <NavList activeView={activeView} onNavigate={onNavigate} />
      </div>
      <div className="border-t border-line-soft px-6 py-5">
        <p className="eyebrow eyebrow--muted text-[0.6rem] tracking-[0.24em] text-ivory-muted/60">
          Portfolio &amp; Assistant
        </p>
      </div>
    </aside>
  );
}

export function LeftSidebarContent({ activeView, onNavigate }: NavProps) {
  return (
    <>
      <div className="px-3 pt-6">
        <Brand showBrand />
      </div>
      <NavList activeView={activeView} onNavigate={onNavigate} />
    </>
  );
}
