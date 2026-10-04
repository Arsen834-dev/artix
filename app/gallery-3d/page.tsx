import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Gallery3D } from "@/components/gallery-3d";

async function GalleryContent() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artworks")
    .select("id, title, image_url")
    .order("likes_count", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Supabase error:", error);
    return <div className="text-center text-white/60">Ошибка загрузки</div>;
  }

  const artworks = (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    image_url: item.image_url,
  }));

  return <Gallery3D artworks={artworks} />;
}

function GallerySkeleton() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-2 border-white/10 border-t-[#6C63FF]" />
        <p className="mt-4 text-white/60">Загружаем галактику...</p>
      </div>
    </div>
  );
}

export default function Gallery3DPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryContent />
      </Suspense>
    </div>
  );
}