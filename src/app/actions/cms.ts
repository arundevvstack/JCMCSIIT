"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin as supabase } from "@/lib/supabase";

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function savePage(formData: FormData) {
  const id = formData.get("id") as string | null;
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const is_published = formData.get("is_published") === "true";

  if (id) {
    // Update existing page
    const { error } = await supabase
      .from("pages")
      .update({ slug, title, content, is_published, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);
  } else {
    // Insert new page
    const { error } = await supabase
      .from("pages")
      .insert({ slug, title, content, is_published });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/content/pages");
  revalidatePath(`/${slug}`);
}

export async function deletePage(id: string) {
  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/content/pages");
}

// ─── Content Blocks ───────────────────────────────────────────────────────────

export async function saveContentBlock(formData: FormData) {
  const id = formData.get("id") as string | null;
  const key = formData.get("key") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (id) {
    const { error } = await supabase
      .from("content_blocks")
      .update({ key, title, content, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("content_blocks")
      .insert({ key, title, content });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/content/blocks");
}

export async function deleteContentBlock(id: string) {
  const { error } = await supabase.from("content_blocks").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/content/blocks");
}
