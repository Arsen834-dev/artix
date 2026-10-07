// components/banned-guard.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from './auth-provider';

export function BannedGuard() {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user || checked) return;
    if (pathname === '/banned') return;

    const check = async () => {
      const supabase = createClient();
      const { data } = await supabase.rpc('is_current_user_banned');
      const row = data?.[0];
      if (row?.is_banned) {
        router.replace('/banned');
      }
      setChecked(true);
    };

    check();
  }, [user, pathname, router, checked]);

  return null;
}