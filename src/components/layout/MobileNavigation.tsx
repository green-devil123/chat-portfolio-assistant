import { useEffect, useState } from 'react';
import type { View } from '../../types';
import { CloseIcon, MenuIcon } from './icons';
import { LeftSidebarContent } from './LeftSidebar';

type MobileNavigationProps = {
  activeView: View;
  onNavigate: (view: View) => void;
};

export function MobileNavigation({ activeView, onNavigate }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavigate = (view: View) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-ink-soft/95 px-4 backdrop-blur">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="-ml-2 flex h-10 w-10 items-center justify-center text-ivory-dim transition-colors hover:text-gold"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <span className="display-lg text-lg text-ivory">Tarun Agarwal</span>
        <span className="h-10 w-10" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gold/20" aria-hidden="true" />
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/65 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="panel-scroll absolute inset-y-0 left-0 flex w-[17.5rem] max-w-[85vw] flex-col border-r border-line bg-ink-soft shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-3 top-5 flex h-9 w-9 items-center justify-center text-ivory-muted transition-colors hover:text-gold"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <LeftSidebarContent activeView={activeView} onNavigate={handleNavigate} />
            <div className="mt-auto border-t border-line-soft px-6 py-5">
              <p className="eyebrow eyebrow--muted text-[0.6rem] tracking-[0.24em] text-ivory-muted/60">
                Portfolio &amp; Assistant
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
