import { createClient } from "@/lib/supabase/server";
import { HomeContent } from "@/components/home-content";

export default async function Home() {
  const supabase = await createClient();

  const { data: heroData, error: heroError } = await supabase
    .from("artworks")
    .select(`
      id, title, image_url, price,
      artist:profiles!artworks_artist_id_fkey (display_name)
    `)
    .order("likes_count", { ascending: false })
    .limit(12);

  if (heroError) {
    console.error("Hero error:", heroError);
  }

  const heroArtworks = (heroData || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    image_url: item.image_url,
    price: item.price || 0,
    artist_name: Array.isArray(item.artist)
      ? item.artist[0]?.display_name || "Автор"
      : item.artist?.display_name || "Автор",
  }));

  return <HomeContent heroArtworks={heroArtworks} />;
}