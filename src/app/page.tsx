import { getPublicSiteSettings, DEFAULT_PUBLIC_SITE_SETTINGS } from "@/lib/cms/site-settings";
import { getPublicNews } from "@/lib/cms/news";
import { getPublicEvents } from "@/lib/cms/events";
import { getPublicGalleryItems } from "@/lib/cms/gallery";
import { HomePageClient } from "@/components/home/home-page-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, news, events, gallery] = await Promise.all([
    getPublicSiteSettings().catch(() => DEFAULT_PUBLIC_SITE_SETTINGS),
    getPublicNews({ limit: 4 }).catch(() => []),
    getPublicEvents({ limit: 4 }).catch(() => []),
    getPublicGalleryItems({ limit: 8 }).catch(() => []),
  ]);
  const hero = settings?.homepage_hero;

  return (
    <HomePageClient
      hero={hero}
      news={news}
      events={events}
      gallery={gallery}
    />
  );
}
