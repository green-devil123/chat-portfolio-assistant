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
        <p className="eyebrow">Welcome to</p>

        <h1 className="display-xl mt-5 text-4xl uppercase text-ivory sm:text-5xl lg:text-[3.4rem]">
          Tarun Agarwal
        </h1>

        <div className="rule rule--gold mx-auto mt-7 w-24" />

        <p className="mx-auto mt-7 max-w-lg text-[1.02rem] leading-relaxed text-ivory-muted">
          Explore my professional journey, projects, experience and technical work.
        </p>

        <p className="eyebrow eyebrow--muted mt-12 text-[0.63rem] tracking-[0.28em]">
          You can ask me about
        </p>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {TOPICS.map((topic) => (
            <li
              key={topic}
              className="border border-line bg-white/[0.015] px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-ivory-muted"
            >
              {topic}
            </li>
          ))}
        </ul>

        <SuggestedQuestions questions={suggestions} onSelect={onSelectSuggestion} />
      </div>
    </div>
  );
}
