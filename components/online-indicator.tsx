'use client';

export function OnlineIndicator({
  lastSeenAt,
  size = 'md',
}: {
  lastSeenAt: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!lastSeenAt) {
    return null;
  }

  // 🎯 Онлайн = последние 2 минуты
  const lastSeen = new Date(lastSeenAt);
  const now = new Date();
  const diffMs = now.getTime() - lastSeen.getTime();
  const isOnline = diffMs < 2 * 60 * 1000;

  const sizeClasses = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  return (
    <div
      className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-[#0a0a0f] ${sizeClasses[size]} ${
        isOnline ? 'bg-green-400' : 'bg-gray-500'
      }`}
      title={isOnline ? 'Онлайн' : 'Оффлайн'}
    />
  );
}