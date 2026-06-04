import { supabaseAdmin } from "@/lib/supabase";
import PagesManager from "./pages-manager";

export const revalidate = 0; // Disable caching for the admin panel

export default async function PagesPage() {
  const { data: pages, error } = await supabaseAdmin
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Error fetching pages:", error);
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <PagesManager initialPages={pages || []} />
    </div>
  );
}
