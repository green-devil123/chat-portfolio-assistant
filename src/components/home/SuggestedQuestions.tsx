type SuggestedQuestionsProps = {
  questions: string[];
  onSelect?: (question: string) => void;
};

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="mx-auto mt-11 w-full max-w-xl text-left">
      <p className="eyebrow eyebrow--muted mb-4 text-[0.68rem] tracking-[0.3em]">
        // Suggested_Queries
      </p>
      <ul className="flex flex-col">
        {questions.map((question) => {
          const body = (
            <>
              <span
                aria-hidden="true"
                className="mt-[0.15rem] font-terminal text-lg leading-none text-gold phosphor-text"
              >
                ❯
              </span>
              <span className="display-md text-[1.02rem] text-ivory-dim">{question}</span>
            </>
          );

          return (
            <li key={question}>
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(question)}
                  className="group flex w-full items-start gap-3 border-2 border-transparent px-3 py-2 text-left transition-colors duration-200 hover:border-line hover:bg-gold/[0.04] hover:text-ivory"
                >
                  {body}
                </button>
              ) : (
                <div className="flex items-start gap-3 px-3 py-2">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
