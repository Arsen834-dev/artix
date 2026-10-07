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
      {!isChat && <SiteHeader />}
      <main className="relative z-10">{children}</main>
      {!isChat && <SiteFooter />}
    </>
  );
}