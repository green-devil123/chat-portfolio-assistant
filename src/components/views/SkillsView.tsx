import skillsData from '../../knowledge/skills.json';
import type { KnowledgeSkills } from '../../types/knowledge.ts';
import { ViewHeader } from './ViewHeader';

const skills = skillsData as unknown as KnowledgeSkills;

export function SkillsView() {
  return (
    <div className="panel-scroll min-h-0 flex-1 px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-3xl pb-10">
        <ViewHeader
          eyebrow="Capability Stack"
          title="Skills"
          intro="Languages, frameworks, infrastructure and AI tooling used day to day, grouped by domain."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {skills.groups.map((group, index) => (
            <section
              key={group.name}
              aria-label={group.name}
              className="surface flex flex-col p-5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow eyebrow--muted text-[0.68rem]">{`// ${group.name}`}</p>
                <span
                  className="font-terminal text-[0.7rem] tracking-[0.2em] text-gold/85 phosphor-text"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-2 border-line bg-gold/[0.03] px-3 py-1 text-[0.72rem] uppercase tracking-[0.16em] text-ivory-muted phosphor-text"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
