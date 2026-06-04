'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function savePage(formData: FormData) {
  const id = formData.get('id') as string | null;
  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const is_published = formData.get('is_published') === 'true';

  if (!slug || !title) throw new Error('Slug and title are required');

  const pageData = {
    slug,
    title,
    content,
    is_published,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabaseAdmin
      .from('pages')
      .update(pageData)
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from('pages')
      .insert([pageData]);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/content/pages');
  revalidatePath(`/${slug}`);
  return { success: true };
}

export async function deletePage(id: string) {
  const { error } = await supabaseAdmin
    .from('pages')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content/pages');
  return { success: true };
}

export async function saveContentBlock(formData: FormData) {
  const id = formData.get('id') as string | null;
  const key = formData.get('key') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!key || !title) throw new Error('Key and title are required');

  const blockData = {
    key,
    title,
    content,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabaseAdmin
      .from('content_blocks')
      .update(blockData)
      .eq('id', id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from('content_blocks')
      .insert([blockData]);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/content/blocks');
  return { success: true };
}

export async function deleteContentBlock(id: string) {
  const { error } = await supabaseAdmin
    .from('content_blocks')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/content/blocks');
  return { success: true };
}
