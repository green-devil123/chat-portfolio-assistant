import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { ArrowUpIcon } from './icons';

type ChatInputProps = {
  onSubmit: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const MAX_HEIGHT = 128;

export function ChatInput({
  onSubmit,
  placeholder = 'Ask something about Tarun…',
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = value.trim().length > 0 && !disabled;

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  };

  const submit = () => {
    if (!canSend) return;
    onSubmit(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    resize();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit();
  };

  return (
    <div className="shrink-0 border-t border-line bg-ink px-5 pb-5 pt-4 sm:px-10">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
        <div className="surface surface--raised flex items-end gap-2 px-3 py-2 transition-colors focus-within:border-gold/45">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Ask a question about Tarun"
            placeholder={placeholder}
            className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent py-1.5 text-[0.95rem] leading-relaxed text-ivory outline-none placeholder:text-ivory-muted/55"
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={!canSend}
            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-gold/40 text-gold transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:border-line disabled:text-ivory-muted/40"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
