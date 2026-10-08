import { useCallback, useRef, useState } from 'react';
import { answerQuestion } from '../ai/answer/answerer';
import type { ChatState } from '../types';

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
    try {
      const answer = await answerQuestion(content);
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { id: createId(), role: 'assistant' as const, content: answer.text },
        ],
      }));
    } finally {
      inFlight.current -= 1;
      if (inFlight.current === 0) setIsAnswering(false);
    }
  }, []);

  return { ...state, isAnswering, sendMessage };
}
