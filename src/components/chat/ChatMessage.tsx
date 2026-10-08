import type { Message } from '../../types';

type ChatMessageProps = {
  message: Message;
  separated?: boolean;
};

export function ChatMessage({ message, separated = false }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <article className="panel-enter" aria-label={isUser ? 'Your message' : 'Assistant message'}>
      {separated && <div className="rule mb-6" />}

      <p className={`eyebrow text-[0.6rem]${isUser ? ' eyebrow--muted' : ''}`}>
        {isUser ? 'You' : 'AI Assistant'}
      </p>

      <p
        className={
          isUser
            ? 'display-md mt-2.5 text-[1.08rem] text-ivory'
            : 'mt-2.5 whitespace-pre-wrap text-[0.98rem] leading-[1.75] text-ivory-dim'
        }
      >
        {message.content}
      </p>
    </article>
  );
}
