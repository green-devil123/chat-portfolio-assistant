import { useCallback, useRef, useState } from 'react';
import { answerQuestion } from '../ai/answer/answerer';
import type { ChatState } from '../types';

const WORD_REVEAL_DELAY_MS = 100;
const MIN_LOADING_DURATION_MS = 1200;

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    hasStarted: false,
    messages: [],
  });
  const [isAnswering, setIsAnswering] = useState(false);
  const inFlight = useRef(0);

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content) return;

    setState((prev) => ({
      hasStarted: true,
      messages: [...prev.messages, { id: createId(), role: 'user', content }],
    }));

    inFlight.current += 1;
    setIsAnswering(true);
    const loadingStartedAt = Date.now();
    let answerText: string;
    try {
      answerText = (await answerQuestion(content)).text;
      const remainingLoadingTime = MIN_LOADING_DURATION_MS - (Date.now() - loadingStartedAt);
      if (remainingLoadingTime > 0) {
        await new Promise<void>((resolve) => window.setTimeout(resolve, remainingLoadingTime));
      }
    } finally {
      inFlight.current -= 1;
      if (inFlight.current === 0) setIsAnswering(false);
    }

    const words = answerText.match(/\S+\s*/g) ?? [];
    const assistantMessageId = createId();
    let visibleText = words[0] ?? answerText;
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { id: assistantMessageId, role: 'assistant', content: visibleText },
      ],
    }));

    for (let index = 1; index < words.length; index += 1) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, WORD_REVEAL_DELAY_MS));
      visibleText += words[index];
      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((message) =>
          message.id === assistantMessageId ? { ...message, content: visibleText } : message,
        ),
      }));
    }
  }, []);

  return { ...state, isAnswering, sendMessage };
}
