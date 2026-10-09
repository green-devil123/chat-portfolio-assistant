import { SuggestedQuestions } from './SuggestedQuestions';

type WelcomeProps = {
  suggestions: string[];
  onSelectSuggestion?: (question: string) => void;
};

export function Welcome({ suggestions, onSelectSuggestion }: WelcomeProps) {
  return (
    <div className="welcome-panel flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 py-3 sm:px-8 sm:py-5">
      <div className="welcome-content my-auto w-full max-w-2xl text-center">
        <p className="welcome-compact-hide eyebrow">ACCESS GRANTED — WELCOME TO</p>

        <h1 className="welcome-title display-xl mt-2 text-3xl uppercase text-ivory sm:text-5xl lg:text-[3.4rem]">
          THE TARUNVERSE
        </h1>

        <p className="welcome-role mt-1.5 font-terminal text-sm uppercase tracking-[0.2em] text-gold">
          &gt; GenAI Engineer <span className="text-ivory-muted">// coffee-powered</span>
        </p>

        <div className="welcome-compact-hide rule rule--gold mx-auto mt-4 w-24" />

        <p className="welcome-compact-hide mx-auto mt-4 max-w-lg text-[1rem] leading-relaxed text-ivory-dim">
          <span className="text-gold">$</span> explore --journey --projects --experience
        </p>

        <p className="welcome-compact-hide mx-auto mt-2 max-w-lg font-terminal text-sm text-ivory-muted">
          <span className="text-gold">//</span> Coffee in. Tokens out. Repeat until production.
        </p>

        <SuggestedQuestions questions={suggestions} onSelect={onSelectSuggestion} />
      </div>
    </div>
  );
}
