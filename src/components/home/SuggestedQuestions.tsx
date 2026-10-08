type SuggestedQuestionsProps = {
  questions: string[];
  onSelect?: (question: string) => void;
};

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="welcome-suggestions mx-auto mt-5 w-full max-w-xl text-left">
      <p className="welcome-compact-hide eyebrow eyebrow--muted mb-2 text-[0.68rem] tracking-[0.3em]">
        // Suggested_Queries
      </p>
      <ul className="welcome-suggestions-grid grid grid-cols-1 gap-x-2 sm:grid-cols-2">
        {questions.map((question) => {
          const body = (
            <>
              <span
                aria-hidden="true"
                className="mt-[0.15rem] shrink-0 font-terminal text-lg leading-none text-gold phosphor-text"
              >
                ❯
              </span>
              <span className="welcome-suggestion-text display-md line-clamp-2 text-[0.9rem] text-ivory-dim">{question}</span>
            </>
          );

          return (
            <li key={question}>
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(question)}
                  className="group flex w-full items-start gap-2 border-2 border-transparent px-2 py-1.5 text-left transition-colors duration-200 hover:border-line hover:bg-gold/[0.04] hover:text-ivory"
                >
                  {body}
                </button>
              ) : (
                <div className="flex items-start gap-2 px-2 py-1.5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
