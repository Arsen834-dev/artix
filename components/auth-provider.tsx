// components/auth-provider.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { AuthRequiredModal } from './auth-required-modal';

type AuthContextType = {
  user: User | null;
  requireAuth: (action: () => void, actionName?: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  requireAuth: () => {},
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [showModal, setShowModal] = useState(false);
  const [actionName, setActionName] = useState('это действие');
  const pendingActionRef = useRef<(() => void) | null>(null);

  const pathname = usePathname();

  // 🎯 Слушаем изменения авторизации (другая вкладка, logout, login после модалки)
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🎯 Закрываем модалку при смене страницы + сбрасываем pendingAction
  useEffect(() => {
    setShowModal(false);
    pendingActionRef.current = null;
  }, [pathname]);

  // 🎯 Если юзер залогинился и есть отложенное действие — выполняем
  useEffect(() => {
    if (user && pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setShowModal(false);
      // Небольшая задержка, чтобы состояние успело обновиться
      const timer = setTimeout(() => {
        try {
          action();
        } catch (err) {
          console.error('Pending action error:', err);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const requireAuth = useCallback(
    (action: () => void, name = 'это действие') => {
      if (user) {
        // Залогинен — выполняем сразу
        action();
      } else {
        // Не залогинен — запоминаем действие и показываем модалку
        setActionName(name);
        pendingActionRef.current = action;
        setShowModal(true);
      }
    },
    [user],
  );

  return (
    <AuthContext.Provider value={{ user, requireAuth }}>
      {children}
      {showModal && (
        <AuthRequiredModal
          action={actionName}
          onClose={() => {
            setShowModal(false);
            pendingActionRef.current = null;
          }}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useRequireAuth() {
  return useContext(AuthContext).requireAuth;
}

export function useUser() {
  return useContext(AuthContext).user;
}