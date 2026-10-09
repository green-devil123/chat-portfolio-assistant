import { useEffect, useRef } from 'react';
import type { Message } from '../../types';
import { ChatMessage } from './ChatMessage';

type ChatWindowProps = {
  messages: Message[];
  isAnswering: boolean;
};

function AnswerPending() {
  return (
    <div role="status" aria-label="Assistant is answering" className="panel-enter">
      <p className="eyebrow text-[0.75rem]">◈ SYSTEM_AI</p>
      <p className="mt-2 font-terminal text-sm tracking-[0.08em] text-ivory-muted">
        Signal acquired. Diving into the Tarunverse...
      </p>
      <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
        <span className="typing-dot h-1.5 w-1.5 bg-gold" />
        <span className="typing-dot h-1.5 w-1.5 bg-gold" />
        <span className="typing-dot h-1.5 w-1.5 bg-gold" />
      </div>
    </div>
  );
}

export function ChatWindow({ messages, isAnswering }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    const isStreamingUpdate = messages.length === previousMessageCount.current;
    previousMessageCount.current = messages.length;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduceMotion || !nearBottom || isStreamingUpdate ? 'auto' : 'smooth',
    });
  }, [messages, isAnswering]);

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-label="Conversation"
      className="panel-scroll min-h-0 flex-1 px-6 py-8 sm:px-10"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-7">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            separated={index > 0 && message.role === 'user'}
          />
        ))}

        {isAnswering && <AnswerPending />}
      </div>
    </div>
  );
}
