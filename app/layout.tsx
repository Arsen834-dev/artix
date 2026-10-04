import type { Metadata } from "next";
import { Space_Grotesk, Inter, Unbounded } from "next/font/google";
import "./globals.css";
import { CosmicBackground } from "@/components/cosmic-background";
import { CustomCursor } from "@/components/custom-cursor";
import { SmoothScroll } from "@/components/smooth-scroll";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

// 🎯 Новый шрифт для главных слов
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Artix — космическая галерея художников",
  description: "Платформа для художников и их заказчиков",
  icons: { icon: "/logo-64.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${unbounded.variable} antialiased bg-[#0a0a0f] text-white font-sans`}
      >
        <CustomCursor />
        <CosmicBackground />
        <SmoothScroll>
          <main className="relative z-10">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}