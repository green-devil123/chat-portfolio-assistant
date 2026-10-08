import type { Message } from '../../types';

type ChatMessageProps = {
  message: Message;
  separated?: boolean;
};

export function ChatMessage({ message, separated = false }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <article
      className={`panel-enter ${isUser ? 'flex flex-col items-end' : ''}`}
      aria-label={isUser ? 'Your message' : 'Assistant message'}
    >
      {separated && <div className={`rule mb-6${isUser ? ' w-full' : ''}`} />}

      <p className={`eyebrow text-[0.75rem]${isUser ? ' eyebrow--muted' : ''}`}>
        {isUser ? '❯ USER' : '◈ SYSTEM_AI'}
      </p>

      <div
        className={
          isUser
            ? 'mt-3 max-w-[85%] border-r-2 border-gold/70 bg-gold/[0.05] px-4 py-2.5 display-md text-right text-[1.05rem] text-ivory-dim'
            : 'mt-3 whitespace-pre-wrap text-[0.95rem] leading-[1.7] text-ivory phosphor-text'
        }
      >
        {message.content}
        {isUser && (
          <span className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.1em] bg-gold animate-blink" aria-hidden="true" />
        )}
      </div>
    </article>
  );
}
