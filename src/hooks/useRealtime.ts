import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createRealtimeManager } from '../lib/api/realtime';

export function useRealtime(channel: 'messages' | 'content' | 'subscribers' | 'analytics', callback: (payload: any) => void) {
  const { user } = useAuth();
  const managerRef = useRef<ReturnType<typeof createRealtimeManager>>();

  useEffect(() => {
    if (!user) return;

    if (!managerRef.current) {
      managerRef.current = createRealtimeManager(user.id);
    }

    const unsubscribe = managerRef.current.subscribe(channel, '*', callback);

    return () => {
      unsubscribe();
      if (managerRef.current) {
        managerRef.current.disconnect();
        managerRef.current = undefined;
      }
    };
  }, [user, channel, callback]);

  return managerRef.current;
}