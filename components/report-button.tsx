// components/report-button.tsx
'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { useRequireAuth } from './auth-provider';
import { ReportModal } from './report-modal';

type TargetType = 'artwork' | 'service' | 'order' | 'profile' | 'response' | 'message';

export function ReportButton({
  targetType,
  targetId,
  targetName,
  className = '',
  iconOnly = false,
}: {
  targetType: TargetType;
  targetId: number | string;
  targetName: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const requireAuth = useRequireAuth();

  const handleClick = () => {
    requireAuth(() => setShowModal(true), 'жалобы');
  };

  if (iconOnly) {
    return (
      <>
        <button
          onClick={handleClick}
          className={
            className ||
            'flex h-8 w-8 items-center justify-center rounded-full text-white/30 transition hover:bg-red-500/10 hover:text-red-400'
          }
          aria-label="Пожаловаться"
          title="Пожаловаться"
        >
          <Flag className="h-4 w-4" />
        </button>
        {showModal && (
          <ReportModal
            targetType={targetType}
            targetId={targetId}
            targetName={targetName}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={
          className ||
          'flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 transition hover:border-red-500/30 hover:text-red-400'
        }
      >
        <Flag className="h-3 w-3" />
        Пожаловаться
      </button>
      {showModal && (
        <ReportModal
          targetType={targetType}
          targetId={targetId}
          targetName={targetName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}