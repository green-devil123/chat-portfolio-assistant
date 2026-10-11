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
    <nav aria-label="Primary navigation" className="left-sidebar-nav px-1" onKeyDown={handleListKeyDown}>
      <p className="left-sidebar-nav-label eyebrow eyebrow--muted mb-3 flex items-center gap-2 px-3 text-[0.62rem] tracking-[0.32em]">
        <span className="text-gold">&gt;</span>
        <span>nav_menu</span>
        <span className="nav-prompt" aria-hidden="true" />
      </p>
      <ul className="left-sidebar-nav-list flex flex-col gap-1.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }, index) => {
          const isActive = activeView === id;
          const num = String(index + 1).padStart(2, '0');
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'left-sidebar-nav-button nav-item group relative flex w-full items-center gap-3 overflow-hidden px-3 py-3 text-left',
                  'text-[0.82rem] uppercase tracking-[0.2em] transition-colors duration-200',
                  isActive
                    ? 'nav-item--active phosphor-text border-2 border-gold bg-gold/[0.07] text-gold'
                    : 'border-2 border-transparent text-ivory-muted hover:border-line hover:bg-gold/[0.03] hover:text-ivory-dim',
                ].join(' ')}
                style={isActive ? { clipPath: CUT_SMALL } : undefined}
              >
                <span className="nav-item-scan" aria-hidden="true" />
                {isActive && <span className="nav-item-bar" aria-hidden="true" />}

                <span
                  className={`flex items-center font-terminal text-[0.72rem] leading-none tabular-nums ${
                    isActive ? 'text-gold' : 'text-ivory-muted group-hover:text-ivory-dim'
                  }`}
                  aria-hidden="true"
                >
                  <span className={isActive ? 'text-gold' : 'opacity-0'}>[</span>
                  <span>{num}</span>
                  <span className={isActive ? 'text-gold' : 'opacity-0'}>]</span>
                </span>

                <Icon
                  className={`h-[1.05rem] w-[1.05rem] shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-gold' : 'text-ivory-muted group-hover:text-ivory-dim'
                  }`}
                />

                <span>{label}</span>

                <span
                  className={`ml-auto text-[0.9rem] leading-none ${
                    isActive ? 'text-gold animate-blink' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                >
                  ▮
                </span>
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

      <div
        className="left-sidebar-brand-card surface-glow hidden border-2 border-line bg-gold/[0.02] lg:block"
        style={{ clipPath: CUT_SMALL }}
      >
        <div className="left-sidebar-brand-heading flex items-center justify-between border-b-2 border-line px-4 py-1.5 text-[0.64rem] tracking-[0.34em] text-gold phosphor-text">
          <span className="flex items-center gap-2">
            <span className="text-gold/60">▮</span>
            IDENTITY_CARD
          </span>
          <span className="text-ivory-muted">NODE.01</span>
        </div>
        <div className="left-sidebar-brand-main flex items-center gap-3 px-3.5 pt-4 pb-2">
          <LogoMark size={48} />
          <div className="min-w-0">
            <h1 className="display-lg text-[1.35rem] leading-[0.95] tracking-[0.08em] text-ivory">
              <span className="block">Tarun</span>
              <span className="block">Agarwal</span>
            </h1>
          </div>
        </div>
        <p className="left-sidebar-brand-role px-3.5 pb-3 text-[0.64rem] uppercase leading-relaxed tracking-[0.14em] text-ivory-muted phosphor-text">
          GenAI Full Stack Engineer
        </p>
        <div className="flex items-center justify-between border-t-2 border-line px-3.5 py-1.5 text-[0.58rem] uppercase tracking-[0.22em] text-ivory-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 bg-gold shadow-[0_0_5px_rgb(0_255_65/0.7)] animate-blink" aria-hidden="true" />
            auth:level-5
          </span>
          <span className="font-terminal tracking-[0.16em]">0x54</span>
        </div>
      </div>

      <div className="left-sidebar-brand-rule rule my-6" />
    </div>
  );
}

function SignalMeter({ value }: { value: number }) {
  const cells = 10;
  const filled = Math.round((value / 100) * cells);
  return (
    <span className="flex items-center gap-[2px]" aria-hidden="true">
      {Array.from({ length: cells }, (_, i) => (
        <span
          key={i}
          className={`inline-block h-2.5 w-[3px] ${
            i < filled ? 'bg-gold shadow-[0_0_4px_rgb(0_255_65/0.55)]' : 'bg-line'
          }`}
        />
      ))}
    </span>
  );
}

function SystemStatus() {
  const rows: { label: string; value: string; meter?: number }[] = [
    { label: 'POWER', value: 'ONLINE' },
    { label: 'SIGNAL', value: '98%', meter: 98 },
    { label: 'BUILD', value: 'v1.0' },
  ];

  return (
    <div
      className="left-sidebar-status surface-glow mx-1 border-2 border-line bg-gold/[0.02]"
      style={{ clipPath: CUT_SMALL }}
      aria-label="System status"
    >
      <div className="flex items-center justify-between border-b-2 border-line px-3.5 py-1.5 text-[0.62rem] tracking-[0.32em] text-gold phosphor-text">
        <span>SYSTEM_STATUS</span>
        <span className="text-gold/60">▚</span>
      </div>
      <dl className="px-3.5 py-2.5">
        {rows.map(({ label, value, meter }, index) => (
          <div
            key={label}
            className={`flex items-center justify-between py-1.5 text-[0.68rem] tracking-[0.2em] ${
              index > 0 ? 'border-t border-line-soft' : ''
            }`}
          >
            <dt className="flex items-center gap-2 text-ivory-muted">
              {label === 'POWER' && (
                <span className="inline-block h-1.5 w-1.5 bg-gold shadow-[0_0_5px_rgb(0_255_65/0.7)] animate-blink" aria-hidden="true" />
              )}
              {label}
            </dt>
            {meter != null ? (
              <dd className="flex items-center gap-2 text-ivory-dim">
                <SignalMeter value={meter} />
                <span className="tabular-nums">{value}</span>
              </dd>
            ) : (
              <dd className="text-ivory-dim">{value}</dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}

function ScreenBezel() {
  return (
    <div className="left-sidebar-bezel flex shrink-0 items-center gap-1.5 border-b-2 border-line-soft px-4 py-2">
      <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_6px_rgb(0_255_65/0.7)]" aria-hidden="true" />
      <span className="h-2 w-2 rounded-full bg-ivory-muted/50" aria-hidden="true" />
      <span className="h-2 w-2 rounded-full bg-ivory-muted/25" aria-hidden="true" />
      <span className="ml-auto font-terminal text-[0.58rem] uppercase tracking-[0.3em] text-ivory-muted">
        tty0
      </span>
    </div>
  );
}

export function LeftSidebar({ activeView, onNavigate }: NavProps) {
  return (
    <aside
      className="left-sidebar left-sidebar-screen hidden h-full w-[18.5rem] shrink-0 flex-col overflow-hidden border-r-2 border-line bg-ink-soft lg:flex"
      aria-label="Sidebar"
    >
      <ScreenBezel />
      <div className="left-sidebar-inner relative z-10 flex flex-1 flex-col px-4 pt-4 pb-7">
        <Brand />
        <NavList activeView={activeView} onNavigate={onNavigate} />
        <div className="left-sidebar-status-wrap mt-auto pt-8">
          <SystemStatus />
        </div>
      </div>
      <div className="left-sidebar-footer relative z-10 flex items-center gap-2 border-t-2 border-line-soft px-6 py-5">
        <span className="text-gold phosphor-text" aria-hidden="true">
          &gt;
        </span>
        <p className="eyebrow eyebrow--muted text-[0.66rem] tracking-[0.26em]">
          SYS: PORTFOLIO_ASSISTANT
        </p>
        <span className="nav-prompt ml-auto" aria-hidden="true" />
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
