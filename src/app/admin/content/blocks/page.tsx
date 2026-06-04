import { supabaseAdmin } from "@/lib/supabase";
import BlocksManager from "./blocks-manager";

export const revalidate = 0;

export default async function BlocksPage() {
  const { data: blocks, error } = await supabaseAdmin
    .from('content_blocks')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error("Error fetching blocks:", error);
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
      <BlocksManager initialBlocks={blocks || []} />
    </div>
  );
}
