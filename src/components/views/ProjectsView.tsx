import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import projectsData from '../../knowledge/projects.json';
import type { KnowledgeProject } from '../../types/knowledge.ts';
import { ViewHeader } from './ViewHeader';

const projects = projectsData as unknown as KnowledgeProject[];

const READ_MORE_MAX = 300;

const CUT_CHIP =
  'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))';

type ProjectCardProps = {
  project: KnowledgeProject;
  index: number;
  open: boolean;
  readMore: boolean;
  onToggle: () => void;
  onReadMore: (expand: boolean) => void;
};

function ProjectCard({ project, index, open, readMore, onToggle, onReadMore }: ProjectCardProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [clamped, setClamped] = useState(false);

  const meta = [project.category, project.org, project.role].filter(Boolean).join(' · ');
  const contributions = project.contributions ?? [];
  const technologies = project.technologies ?? [];
  const bodyId = `project-body-${project.id}`;

  useLayoutEffect(() => {
    if (readMore) return;
    const el = bodyRef.current;
    if (!el) return;
    setClamped(el.scrollHeight > el.clientHeight + 4);
  }, [open, readMore]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      articleRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }, 340);
    return () => window.clearTimeout(timer);
  }, [open]);

  const handleHeaderKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };

  const clampedView = clamped && !readMore;
  const mask =
    'linear-gradient(to bottom, #000 calc(100% - 64px), transparent 100%)';

  return (
    <article ref={articleRef} className="surface">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={onToggle}
        onKeyDown={handleHeaderKeyDown}
        className="block w-full cursor-pointer p-6 text-left outline-none sm:p-8 [&:focus-visible]:outline-2 [&:focus-visible]:outline-gold"
      >
        <div className="flex items-baseline justify-between gap-6">
          <div className="min-w-0">
            <h3 className="display-md text-[1.5rem] leading-tight text-ivory">{project.name}</h3>
            {meta ? (
              <p className="mt-1.5 text-[0.72rem] uppercase tracking-[0.22em] text-ivory-muted phosphor-text">
                {meta}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span
              className="border-2 border-line px-2 py-0.5 font-terminal text-[0.85rem] leading-none text-gold"
              style={{ clipPath: CUT_CHIP }}
              aria-hidden="true"
            >
              {open ? '[ - ]' : '[ + ]'}
            </span>
            <span className="display-lg text-xl text-gold/85" aria-hidden="true">
              {String(index).padStart(2, '0')}
            </span>
          </div>
        </div>

        {!open && project.description ? (
          <p className="mt-3 line-clamp-2 text-[0.92rem] leading-relaxed text-ivory-muted">
            {project.description}
          </p>
        ) : null}

        <p
          className={`mt-3 text-[0.68rem] uppercase tracking-[0.26em] ${
            open ? 'text-ivory-muted' : 'text-gold/85'
          }`}
          aria-hidden="true"
        >
          {open ? '▴ Collapse project' : '▸ Expand for full details'}
        </p>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-2 sm:px-8">
            <div className="rule mb-5" />
            <div
              id={bodyId}
              ref={bodyRef}
              style={{
                maxHeight: readMore ? 'none' : `${READ_MORE_MAX}px`,
                overflowY: clampedView ? 'hidden' : 'visible',
                maskImage: clampedView ? mask : undefined,
                WebkitMaskImage: clampedView ? mask : undefined,
              }}
            >
              {project.description ? (
                <section>
                  <p className="eyebrow eyebrow--muted text-[0.66rem]">// Overview</p>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ivory-dim">
                    {project.description}
                  </p>
                </section>
              ) : null}

              {project.architecture ? (
                <section className="mt-5">
                  <p className="eyebrow eyebrow--muted text-[0.66rem]">// Architecture</p>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ivory-muted">
                    {project.architecture}
                  </p>
                </section>
              ) : null}

              {contributions.length > 0 ? (
                <section className="mt-5">
                  <p className="eyebrow eyebrow--muted text-[0.66rem]">// Key_Contributions</p>
                  <ul className="mt-2.5 space-y-2.5">
                    {contributions.map((contribution) => (
                      <li
                        key={contribution}
                        className="flex gap-3 text-[0.92rem] leading-relaxed text-ivory-dim"
                      >
                        <span className="text-gold" aria-hidden="true">
                          —
                        </span>
                        <span>{contribution}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {project.impact ? (
                <section className="mt-5">
                  <p className="eyebrow eyebrow--muted text-[0.66rem]">// Impact</p>
                  <p className="mt-2.5 text-[0.93rem] leading-relaxed text-gold-bright">
                    {project.impact}
                  </p>
                </section>
              ) : null}

              {technologies.length > 0 ? (
                <section className="mt-5">
                  <p className="eyebrow eyebrow--muted text-[0.66rem]">// Tech_Stack</p>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <li
                        key={tech}
                        className="border-2 border-line bg-gold/[0.03] px-3 py-1 text-[0.72rem] uppercase tracking-[0.16em] text-ivory-muted phosphor-text"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {clampedView ? (
              <div className="pb-4 pt-1">
                <button
                  type="button"
                  onClick={() => onReadMore(true)}
                  className="flex w-full items-center justify-center gap-2 border-2 border-line bg-gold/[0.04] px-4 py-2.5 text-[0.72rem] uppercase tracking-[0.3em] text-gold phosphor-text transition-colors hover:border-gold hover:bg-gold/[0.1]"
                  style={{ clipPath: CUT_CHIP }}
                >
                  Read More ▾
                </button>
              </div>
            ) : null}

            {clamped && readMore ? (
              <div className="pb-4 pt-1">
                <button
                  type="button"
                  onClick={() => onReadMore(false)}
                  className="flex w-full items-center justify-center gap-2 border-2 border-line bg-gold/[0.04] px-4 py-2.5 text-[0.72rem] uppercase tracking-[0.3em] text-gold phosphor-text transition-colors hover:border-gold hover:bg-gold/[0.1]"
                  style={{ clipPath: CUT_CHIP }}
                >
                  Show Less ▴
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProjectsView() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [readMoreId, setReadMoreId] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setReadMoreId(null);
    setOpenId((current) => (current === id ? null : id));
  }, []);

  const sections: { category: string; items: KnowledgeProject[] }[] = [];
  for (const project of projects) {
    const last = sections[sections.length - 1];
    if (last && last.category === project.category) {
      last.items.push(project);
    } else {
      sections.push({ category: project.category, items: [project] });
    }
  }

  let index = 0;
  return (
    <div className="panel-scroll min-h-0 flex-1 px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-4xl pb-10">
        <ViewHeader
          eyebrow="Selected Work"
          title="Projects"
          intro="A selection of products and platforms I have designed and built across generative AI and professional engineering. Select a project to expand its full breakdown."
        />

        <div className="mt-10 space-y-12">
          {sections.map((section) => (
            <section key={section.category} aria-label={`${section.category} projects`}>
              <p className="eyebrow eyebrow--muted text-[0.68rem]">{section.category}</p>
              <div className="mt-4 space-y-5">
                {section.items.map((project) => {
                  index += 1;
                  return (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      open={openId === project.id}
                      readMore={readMoreId === project.id}
                      onToggle={() => handleToggle(project.id)}
                      onReadMore={(expand) => setReadMoreId(expand ? project.id : null)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
