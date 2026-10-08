import { useEffect, useRef, useState } from 'react';

type Step =
  | { kind: 'line'; text: string; wait?: number }
  | { kind: 'gap'; wait?: number }
  | { kind: 'mem'; label: string; target: number; duration: number }
  | { kind: 'bar'; label: string; duration: number };

type Row = { id: number; text: string };

const BAR_WIDTH = 20;
const BOOT_TIMING_SCALE = 3;

const ok = (label: string) => label.padEnd(39, '.') + ' [ OK ]';

const SCRIPT: Step[] = [
  { kind: 'line', text: 'TA-TECH SYSTEMS  BIOSTAR v4.2.1', wait: 15 },
  { kind: 'line', text: '(C) 1984-2026 TA-TECH CORP. ALL RIGHTS RESERVED.', wait: 15 },
  { kind: 'gap', wait: 10 },
  { kind: 'line', text: ok('CPU: UNIT-Z80 @ 12.000 MHZ'), wait: 20 },
  { kind: 'line', text: ok('FPU: EXTENDED PRECISION'), wait: 15 },
  { kind: 'mem', label: 'MEMORY TEST', target: 65536, duration: 70 },
  { kind: 'line', text: ok('VIDEO: PHOSPHOR MONOCHROME 640X480'), wait: 20 },
  { kind: 'line', text: ok('CRTC: HORIZONTAL SCAN SYNC'), wait: 25 },
  { kind: 'gap', wait: 10 },
  { kind: 'line', text: 'DETECTING STORAGE DEVICES...', wait: 30 },
  { kind: 'line', text: ok('  PRIMARY MASTER PORTFOLIO.IMG'), wait: 25 },
  { kind: 'gap', wait: 10 },
  { kind: 'line', text: 'MOUNTING FILE SYSTEMS...', wait: 25 },
  { kind: 'line', text: ok('  /sys/nav'), wait: 10 },
  { kind: 'line', text: ok('  /sys/chat'), wait: 10 },
  { kind: 'line', text: ok('  /usr/projects.json'), wait: 10 },
  { kind: 'line', text: ok('  /usr/education.json'), wait: 10 },
  { kind: 'line', text: ok('  /usr/contacts.json'), wait: 15 },
  { kind: 'gap', wait: 10 },
  { kind: 'bar', label: 'LOADING PORTFOLIO KERNEL', duration: 130 },
  { kind: 'gap', wait: 15 },
  { kind: 'line', text: ok('INITIALIZING AI INTERFACE'), wait: 15 },
  { kind: 'line', text: ok('STARTING SESSION MANAGER'), wait: 20 },
  { kind: 'gap', wait: 10 },
  { kind: 'line', text: 'SYSTEM READY.', wait: 20 },
  { kind: 'line', text: 'WELCOME, VISITOR - ENTER QUERY TO BEGIN.', wait: 25 },
];

function finalize(step: Step): string {
  if (step.kind === 'line') return step.text;
  if (step.kind === 'gap') return '';
  if (step.kind === 'mem') {
    return ok(`${step.label}: ${String(step.target).padStart(7, '0')} KB`);
  }
  return `${step.label} [${'█'.repeat(BAR_WIDTH)}] 100%`;
}

function renderLine(text: string) {
  if (!text) return ' ';
  const segments = text.split(/(\[ OK \])/);
  return segments.map((segment, index) =>
    segment === '[ OK ]' ? (
      <span
        key={index}
        className="text-gold-bright shadow-[0_0_6px_rgb(0_255_65/0.45)]"
      >
        {segment}
      </span>
    ) : (
      <span key={index}>{segment}</span>
    ),
  );
}

type BootSequenceProps = {
  onDone: () => void;
};

export function BootSequence({ onDone }: BootSequenceProps) {
  const [rows, setRows] = useState<Row[]>(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? SCRIPT.map((step, index) => ({ id: index, text: finalize(step) }))
      : [],
  );
  const [partial, setPartial] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);

  const skipRef = useRef(false);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rows, partial]);

  useEffect(() => {
    const skip = () => {
      skipRef.current = true;
    };
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    const append = (text: string) =>
      setRows((prev) => [...prev, { id: idRef.current++, text }]);
    const allRows = () => SCRIPT.map((step, i) => ({ id: i, text: finalize(step) }));

    const finish = async () => {
      if (cancelled) return;
      setExiting(true);
      await sleep(200);
      if (!cancelled) doneRef.current();
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      const timer = window.setTimeout(() => {
        if (!cancelled) doneRef.current();
      }, 250);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    (async () => {
      for (const step of SCRIPT) {
        if (cancelled || skipRef.current) break;

        if (step.kind === 'line') {
          append(step.text);
          await sleep((step.wait ?? 110) * BOOT_TIMING_SCALE);
        } else if (step.kind === 'gap') {
          append('');
          await sleep((step.wait ?? 60) * BOOT_TIMING_SCALE);
        } else if (step.kind === 'mem') {
          const duration = step.duration * BOOT_TIMING_SCALE;
          const ticks = Math.max(1, Math.ceil(duration / 30));
          for (let i = 1; i <= ticks; i++) {
            if (cancelled || skipRef.current) break;
            const value = Math.round((step.target * i) / ticks / 1024) * 1024;
            setPartial(`${step.label}: ${String(value).padStart(7, '0')} KB`);
            await sleep(duration / ticks);
          }
          if (cancelled) return;
          if (skipRef.current) break;
          setPartial(null);
          append(finalize(step));
          await sleep(20 * BOOT_TIMING_SCALE);
        } else {
          const duration = step.duration * BOOT_TIMING_SCALE;
          const ticks = Math.max(1, Math.ceil(duration / 40));
          for (let i = 1; i <= ticks; i++) {
            if (cancelled || skipRef.current) break;
            const pct = Math.round((i / ticks) * 100);
            const filled = Math.round((i / ticks) * BAR_WIDTH);
            setPartial(
              `${step.label} [${'█'.repeat(filled)}${'░'.repeat(BAR_WIDTH - filled)}] ${pct}%`,
            );
            await sleep(duration / ticks);
          }
          if (cancelled) return;
          if (skipRef.current) break;
          setPartial(null);
          append(finalize(step));
          await sleep(30 * BOOT_TIMING_SCALE);
        }
      }

      if (cancelled) return;

      if (skipRef.current) {
        setPartial(null);
        setRows(allRows());
        await sleep(80);
      }

      await finish();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className={`boot fixed inset-0 z-[45] flex flex-col bg-ink ${exiting ? 'boot--out' : ''}`}
      role="status"
      aria-label="System boot sequence"
      onClick={() => {
        skipRef.current = true;
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgb(0 15 6 / 0.55) 100%)',
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-3xl flex-col px-5 py-6 font-terminal text-gold sm:px-8 sm:py-8">
        <div
          ref={scrollRef}
          className="panel-scroll min-h-0 flex-1 overflow-y-auto pr-1 text-[1.2rem] leading-[1.24] tracking-[0.02em] sm:text-[1.35rem]"
          style={{ textShadow: '0 0 6px rgb(0 255 65 / 0.35)' }}
        >
          {rows.map((row) => (
            <div key={row.id} className="whitespace-pre-wrap break-words">
              {renderLine(row.text)}
            </div>
          ))}
          {partial !== null && <div className="whitespace-pre-wrap">{partial}</div>}
          <div>
            <span className="boot-cursor" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-3 flex shrink-0 items-center justify-between gap-4 border-t-2 border-line pt-3 text-[0.68rem] tracking-[0.28em] text-ivory-muted phosphor-text sm:text-[0.72rem]">
          <span>TA-TECH BOOTLOADER v1.0</span>
          <span className="text-gold">ANY KEY - SKIP &gt;</span>
        </div>
      </div>
    </div>
  );
}
