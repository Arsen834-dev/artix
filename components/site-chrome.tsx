// components/site-chrome.tsx
'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChat = pathname.startsWith('/chat/');

  return (
    <>
      {/* Хедер — везде */}
      <SiteHeader />
      <main className="relative z-10">{children}</main>
      {/* Футер — везде, кроме чата */}
      {!isChat && <SiteFooter />}
    </>
  );
}