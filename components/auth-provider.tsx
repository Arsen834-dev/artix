'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthRequiredModal } from './auth-required-modal';

type AuthContextType = {
  requireAuth: (action: () => void, actionName?: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  requireAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const [actionName, setActionName] = useState('это действие');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // 🎯 Закрываем модалку при смене страницы
  const pathname = usePathname();
  useEffect(() => {
    setShowModal(false);
  }, [pathname]);

  const requireAuth = useCallback(
    (action: () => void, name = 'это действие') => {
      // Проверяем, залогинен ли
      const isLoggedIn =
        typeof window !== 'undefined' &&
        document.cookie.split(';').some((c) => c.trim().startsWith('sb-'));

      if (isLoggedIn) {
        // 🎯 Залогинен — выполняем действие
        action();
      } else {
        // 🎯 Не залогинен — показываем модалку
        setActionName(name);
        setPendingAction(() => action);
        setShowModal(true);
      }
    },
    []
  );

  return (
    <AuthContext.Provider value={{ requireAuth }}>
      {children}
      {showModal && (
        <AuthRequiredModal
          action={actionName}
          onClose={() => {
            setShowModal(false);
            setPendingAction(null);
          }}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useRequireAuth() {
  return useContext(AuthContext).requireAuth;
}