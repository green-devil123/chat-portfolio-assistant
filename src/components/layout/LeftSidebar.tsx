import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { View } from '../../types';
import { LogoMark } from '../brand/LogoMark';
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

const CUT_SMALL =
  'polygon(0 5px, 5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px))';

function NavList({ activeView, onNavigate }: NavProps) {
  return (
    <nav aria-label="Primary navigation" className="px-1" onKeyDown={handleListKeyDown}>
      <p className="eyebrow eyebrow--muted mb-3 px-3 text-[0.62rem] tracking-[0.32em]">
        // Nav_Menu
      </p>
      <ul className="flex flex-col gap-1.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }, index) => {
          const isActive = activeView === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'group flex w-full items-center gap-3 px-3 py-3 text-left',
                  'text-[0.82rem] uppercase tracking-[0.2em] transition-colors duration-200',
                  isActive
                    ? 'phosphor-text border-2 border-gold bg-gold/[0.06] text-gold shadow-[0_0_8px_rgb(0_255_65/0.18)]'
                    : 'border-2 border-transparent text-ivory-muted hover:border-line hover:bg-gold/[0.03] hover:text-ivory-dim',
                ].join(' ')}
                style={isActive ? { clipPath: CUT_SMALL } : undefined}
              >
                <span
                  className={`font-terminal text-[0.72rem] leading-none tabular-nums ${
                    isActive ? 'text-gold' : 'text-ivory-muted group-hover:text-ivory-dim'
                  }`}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Icon
                  className={`h-[1.05rem] w-[1.05rem] shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-gold' : 'text-ivory-muted group-hover:text-ivory-dim'
                  }`}
                />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto text-[0.9rem] leading-none text-gold" aria-hidden="true">
                    ▸
                  </span>
                )}
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
    <div className="px-1">
      {showBrand && (
        <div className="mb-5 flex items-center gap-3 lg:hidden">
          <LogoMark size={40} />
          <span className="display-lg text-lg text-ivory">Tarun Agarwal</span>
        </div>
      )}

      <div className="hidden border-2 border-line bg-gold/[0.02] lg:block" style={{ clipPath: CUT_SMALL }}>
        <div className="border-b-2 border-line px-4 py-1.5 text-[0.64rem] tracking-[0.34em] text-gold phosphor-text">
          IDENTITY_CARD
        </div>
        <div className="flex items-center gap-3 px-3.5 pt-4 pb-2">
          <LogoMark size={56} />
          <div className="min-w-0">
            <h1 className="display-lg text-[1.35rem] leading-[0.95] tracking-[0.08em] text-ivory">
              <span className="block">Tarun</span>
              <span className="block">Agarwal</span>
            </h1>
          </div>
        </div>
        <p className="px-3.5 pb-4 text-[0.64rem] uppercase leading-relaxed tracking-[0.14em] text-ivory-muted phosphor-text">
          GenAI Full Stack Engineer
        </p>
      </div>

      <div className="rule my-6" />
    </div>
  );
}

function SystemStatus() {
  const rows: [string, string][] = [
    ['POWER', 'ONLINE'],
    ['BUILD', 'v1.0'],
  ];

  return (
    <div
      className="mx-1 border-2 border-line bg-gold/[0.02]"
      style={{ clipPath: CUT_SMALL }}
      aria-label="System status"
    >
      <div className="border-b-2 border-line px-3.5 py-1.5 text-[0.62rem] tracking-[0.32em] text-gold phosphor-text">
        SYSTEM_STATUS
      </div>
      <dl className="px-3.5 py-2.5">
        {rows.map(([label, value], index) => (
          <div
            key={label}
            className={`flex items-center justify-between py-1.5 text-[0.68rem] tracking-[0.2em] ${
              index > 0 ? 'border-t border-line-soft' : ''
            }`}
          >
            <dt className="flex items-center gap-2 text-ivory-muted">
              {label === 'POWER' && (
                <span className="inline-block h-1.5 w-1.5 bg-gold shadow-[0_0_4px_rgb(0_255_65/0.6)] animate-blink" aria-hidden="true" />
              )}
              {label}
            </dt>
            <dd className="text-ivory-dim">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function LeftSidebar({ activeView, onNavigate }: NavProps) {
  return (
    <aside
      className="panel-scroll hidden h-full w-[18.5rem] shrink-0 flex-col border-r-2 border-line bg-ink-soft lg:flex"
      aria-label="Sidebar"
    >
      <div className="flex flex-1 flex-col px-4 pt-8 pb-7">
        <Brand />
        <NavList activeView={activeView} onNavigate={onNavigate} />
        <div className="mt-auto pt-8">
          <SystemStatus />
        </div>
      </div>
      <div className="border-t-2 border-line-soft px-6 py-5">
        <p className="eyebrow eyebrow--muted text-[0.66rem] tracking-[0.26em]">
          SYS: PORTFOLIO_ASSISTANT
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
