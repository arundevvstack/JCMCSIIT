import { getPublicSiteSettings } from "@/lib/cms/site-settings";
import { HomePageClient } from "@/components/home/home-page-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getPublicSiteSettings();
  const hero = settings.homepage_hero;

  return <HomePageClient hero={hero} />;
}
