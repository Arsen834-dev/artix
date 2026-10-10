// app/robots.ts
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://artix-beryl.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/settings/',
          '/auth/',
          '/api/',
          '/messages/',
          '/chat/',
          '/deals/',
          '/notifications/',
          '/upload/',
        ],
      },
      {
        // 🎯 Не индексировать "плохие" боты
        userAgent: ['AhrefsBot', 'SemrushBot', 'MJ12bot'],
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}