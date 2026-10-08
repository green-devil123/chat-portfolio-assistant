import educationData from '../../knowledge/education.json';
import type { KnowledgeEducationEntry } from '../../types/knowledge.ts';
import { ViewHeader } from './ViewHeader';

const education = educationData as unknown as KnowledgeEducationEntry[];

export function EducationView() {
  return (
    <div className="panel-scroll min-h-0 flex-1 px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-3xl pb-10">
        <ViewHeader
          eyebrow="Academic Trajectory"
          title="Education"
          intro="Formal education in engineering and schooling, in reverse chronological order."
        />

        <div className="mt-12 space-y-0">
          {education.map((entry, index) => (
            <article key={entry.id} className="flex gap-6 pb-12 last:pb-0 sm:gap-10">
              <div className="flex w-16 shrink-0 flex-col items-center">
                <span className="eyebrow text-[0.7rem] leading-none text-gold phosphor-text">
                  {entry.year}
                </span>
                <div className="mt-4 h-full w-0.5 bg-line" aria-hidden="true" />
                <span
                  className={`mt-4 h-2 w-2 ${index === 0 ? 'bg-gold shadow-[0_0_4px_rgb(0_255_65/0.5)]' : 'bg-line'}`}
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="display-md text-[1.4rem] leading-tight text-ivory">
                  {entry.qualification}
                </h3>
                <p className="mt-2 text-[0.95rem] text-ivory-muted">{entry.institution}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}