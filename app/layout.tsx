// app/layout.tsx
import type { Metadata } from 'next';
import { Space_Grotesk, Inter, Unbounded } from 'next/font/google';
import './globals.css';
import { CosmicBackground } from '@/components/cosmic-background';
import { CustomCursor } from '@/components/custom-cursor';
import { SmoothScroll } from '@/components/smooth-scroll';
import { SiteHeader } from '@/components/site-header';
import { PageTransition } from '@/components/page-transition';
import { AuthProvider } from '@/components/auth-provider';
import { OnlineHeartbeat } from '@/components/online-heartbeat';
import { createClient } from '@/lib/supabase/server';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
});

const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://artix-beryl.vercel.app'),
  title: 'Artix — космическая биржа художников',
  description:
    'Платформа для художников и их заказчиков. Найди художника или продай свои работы.',
  icons: {
    icon: [
      { url: '/logo-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/logo.png',
    shortcut: '/logo-64.png',
  },
  openGraph: {
    title: 'Artix — космическая биржа художников',
    description: 'Найди художника или продай свои работы',
    images: ['/logo.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artix — космическая биржа художников',
    description: 'Найди художника или продай свои работы',
    images: ['/logo.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${unbounded.variable} antialiased bg-[#0a0a0f] text-white font-sans`}
      >
        <AuthProvider initialUser={user}>
          {user && <OnlineHeartbeat />}
          <CustomCursor />
          <CosmicBackground />
          <SmoothScroll>
            <SiteHeader />
            <main className="relative z-10">
              <PageTransition>{children}</PageTransition>
            </main>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}