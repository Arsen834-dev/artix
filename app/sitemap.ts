// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://artix-beryl.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // 🎯 Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/feed`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/orders`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/artists`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 🎯 Динамические страницы: работы
  const { data: artworks } = await supabase
    .from('artworks')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  const artworkPages: MetadataRoute.Sitemap = (artworks || []).map((a) => ({
    url: `${BASE_URL}/artwork/${a.id}`,
    lastModified: new Date(a.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 🎯 Услуги
  const { data: services } = await supabase
    .from('services')
    .select('id, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1000);

  const servicePages: MetadataRoute.Sitemap = (services || []).map((s) => ({
    url: `${BASE_URL}/services/${s.id}`,
    lastModified: new Date(s.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 🎯 Заказы
  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1000);

  const orderPages: MetadataRoute.Sitemap = (orders || []).map((o) => ({
    url: `${BASE_URL}/orders/${o.id}`,
    lastModified: new Date(o.created_at),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // 🎯 Профили художников
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username')
    .in('role', ['artist', 'both'])
    .limit(1000);

  const profilePages: MetadataRoute.Sitemap = (profiles || []).map((p) => ({
    url: `${BASE_URL}/artist/${p.username}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...artworkPages,
    ...servicePages,
    ...orderPages,
    ...profilePages,
  ];
}