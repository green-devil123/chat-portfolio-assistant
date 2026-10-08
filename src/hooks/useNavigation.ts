import { useCallback, useState } from 'react';
import type { View } from '../types';

export function useNavigation(initialView: View = 'home') {
  const [view, setView] = useState<View>(initialView);

  const navigate = useCallback((next: View) => {
    setView(next);
  }, []);

  return { view, navigate };
}
