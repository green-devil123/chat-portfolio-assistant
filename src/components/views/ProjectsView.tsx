import projectsData from '../../knowledge/projects.json';
import type { KnowledgeProject } from '../../types/knowledge.ts';
import { ViewHeader } from './ViewHeader';

const projects = projectsData as unknown as KnowledgeProject[];

function ProjectCard({ project, index }: { project: KnowledgeProject; index: number }) {
  const meta = [project.category, project.org, project.role].filter(Boolean).join(' · ');

  return (
    <article className="surface p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-6">
        <div>
          <h3 className="display-md text-[1.5rem] leading-tight text-ivory">{project.name}</h3>
          {meta ? (
            <p className="mt-1.5 text-[0.66rem] uppercase tracking-[0.22em] text-ivory-muted">
              {meta}
            </p>
          ) : null}
        </div>
        <span
          className="display-lg shrink-0 text-xl text-gold/70"
          aria-hidden="true"
        >
          {String(index).padStart(2, '0')}
        </span>
      </div>

      {project.description ? (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-ivory-dim">{project.description}</p>
      ) : null}

      {project.architecture ? (
        <p className="mt-3 text-[0.85rem] text-ivory-muted">
          <span className="uppercase tracking-[0.18em] text-gold">Architecture — </span>
          {project.architecture}
        </p>
      ) : null}

      {project.technologies && project.technologies.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="border border-line bg-white/[0.015] px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-ivory-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}

      {project.contributions && project.contributions.length > 0 ? (
        <ul className="mt-5 space-y-2.5">
          {project.contributions.map((contribution) => (
            <li key={contribution} className="flex gap-3 text-[0.92rem] leading-relaxed text-ivory-dim">
              <span className="text-gold" aria-hidden="true">
                —
              </span>
              <span>{contribution}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {project.impact ? (
        <p className="mt-5 text-[0.93rem] leading-relaxed text-gold-bright">Impact — {project.impact}</p>
      ) : null}
    </article>
  );
}

export function ProjectsView() {
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
          intro="A selection of products and platforms I have designed and built across generative AI and professional engineering."
        />

        <div className="mt-10 space-y-12">
          {sections.map((section) => (
            <section key={section.category} aria-label={`${section.category} projects`}>
              <p className="eyebrow eyebrow--muted text-[0.62rem]">{section.category}</p>
              <div className="mt-4 space-y-5">
                {section.items.map((project) => {
                  index += 1;
                  return <ProjectCard key={project.id} project={project} index={index} />;
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}