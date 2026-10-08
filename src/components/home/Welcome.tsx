import { LogoMark } from '../brand/LogoMark';
import { SuggestedQuestions } from './SuggestedQuestions';

const TOPICS = ['Experience', 'Projects', 'GenAI', 'Skills', 'Architecture'] as const;

type WelcomeProps = {
  suggestions: string[];
  onSelectSuggestion?: (question: string) => void;
};

export function Welcome({ suggestions, onSelectSuggestion }: WelcomeProps) {
  return (
    <div className="panel-scroll flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-14 sm:px-10">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8 flex justify-center drop-shadow-[0_0_14px_rgb(0_255_65/0.4)]">
          <LogoMark size={84} />
        </div>

        <p className="eyebrow">ACCESS GRANTED — WELCOME TO</p>

        <h1 className="display-xl mt-5 text-4xl uppercase text-ivory sm:text-5xl lg:text-[3.4rem]">
          Tarun Agarwal
        </h1>

        <div className="rule rule--gold mx-auto mt-7 w-24" />

        <p className="mx-auto mt-7 max-w-lg text-[1rem] leading-relaxed text-ivory-dim">
          <span className="text-gold">$</span> explore --journey --projects --experience
        </p>

        <p className="eyebrow eyebrow--muted mt-12 text-[0.7rem] tracking-[0.28em]">
          QUERY MODULES:
        </p>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {TOPICS.map((topic) => (
            <li
              key={topic}
              className="border-2 border-line bg-gold/[0.02] px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-ivory-muted phosphor-text"
              style={{
                clipPath:
                  'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
              }}
            >
              [{topic}]
            </li>
          ))}
        </ul>

        <SuggestedQuestions questions={suggestions} onSelect={onSelectSuggestion} />
      </div>
    </div>
  );
}
