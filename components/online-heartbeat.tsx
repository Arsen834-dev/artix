'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function OnlineHeartbeat() {
  useEffect(() => {
    const updateLastSeen = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('profiles')
          .update({ last_seen_at: new Date().toISOString() })
          .eq('id', user.id);
      }
    };

    // 🎯 Обновляем сразу
    updateLastSeen();

    // 🎯 И каждую минуту
    const interval = setInterval(updateLastSeen, 60000);

    return () => clearInterval(interval);
  }, []);

  return null;
}