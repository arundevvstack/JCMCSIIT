-- ============================================================================
-- Rollback: 20261114000008_cms_rls_and_storage_policies.down.sql
-- Reverses migration 20261114000008 (run FIRST when rolling back 00008 -> 00005)
-- NOTE: Keeps RLS ENABLED on all tables so rolling back policies fails closed
-- rather than exposing unpublished records or write access to public users.
-- ============================================================================

BEGIN;

-- 1. Drop Storage policies created in 00008
DROP POLICY IF EXISTS "cms_storage_public_read" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_role_insert" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_role_update" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_admin_delete" ON storage.objects;

-- Disable public read flag on CMS buckets without issuing `DELETE FROM storage.buckets`
-- (Hosted Supabase Storage blocks raw SQL `DELETE` on `storage.buckets` via trigger).
UPDATE storage.buckets
SET public = false
WHERE id IN ('cms-media', 'cms-documents');

-- 2. Drop standard content table policies created by 00008
DO $$
DECLARE
  t TEXT;
  all_standard_tables TEXT[] := ARRAY[
    'pages',
    'page_sections',
    'content_blocks',
    'departments',
    'faculty',
    'courses',
    'news',
    'events',
    'notices',
    'popups',
    'gallery_items',
    'placements',
    'recruiters',
    'testimonials',
    'laboratories',
    'research_projects'
  ];
BEGIN
  FOREACH t IN ARRAY all_standard_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_public_read_published', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_public_read_active', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_cms_read_all', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_admin_all', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_editor_insert_draft', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_editor_update_draft', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_publisher_update', t);
  END LOOP;
END;
$$;

-- 3. Drop bespoke policies on system, media, navigation, settings, SEO & legacy tables
DROP POLICY IF EXISTS "admin_users_select_self" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_super_admin_all" ON public.admin_users;

DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.audit_logs;
DROP POLICY IF EXISTS "audit_logs_cms_insert" ON public.audit_logs;

DROP POLICY IF EXISTS "content_revisions_cms_read" ON public.content_revisions;
DROP POLICY IF EXISTS "content_revisions_cms_insert" ON public.content_revisions;
DROP POLICY IF EXISTS "content_revisions_admin_delete" ON public.content_revisions;

DROP POLICY IF EXISTS "inquiries_public_insert" ON public.inquiries;
DROP POLICY IF EXISTS "inquiries_admin_all" ON public.inquiries;

DROP POLICY IF EXISTS "document_embeddings_cms_read" ON public.document_embeddings;
DROP POLICY IF EXISTS "document_embeddings_admin_all" ON public.document_embeddings;

DROP POLICY IF EXISTS "posts_public_read_published" ON public.posts;
DROP POLICY IF EXISTS "posts_cms_read_all" ON public.posts;
DROP POLICY IF EXISTS "posts_admin_all" ON public.posts;

DROP POLICY IF EXISTS "media_public_read_active" ON public.media;
DROP POLICY IF EXISTS "media_cms_read_all" ON public.media;
DROP POLICY IF EXISTS "media_admin_all" ON public.media;
DROP POLICY IF EXISTS "media_editor_insert" ON public.media;
DROP POLICY IF EXISTS "media_editor_update_own" ON public.media;
DROP POLICY IF EXISTS "media_editor_update" ON public.media;
DROP POLICY IF EXISTS "media_admin_delete" ON public.media;

DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_cms_read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_all" ON public.site_settings;

DROP POLICY IF EXISTS "navigation_items_public_read" ON public.navigation_items;
DROP POLICY IF EXISTS "navigation_items_cms_read" ON public.navigation_items;
DROP POLICY IF EXISTS "navigation_items_admin_all" ON public.navigation_items;

DROP POLICY IF EXISTS "seo_metadata_public_read" ON public.seo_metadata;
DROP POLICY IF EXISTS "seo_metadata_cms_read" ON public.seo_metadata;
DROP POLICY IF EXISTS "seo_metadata_publisher_insert" ON public.seo_metadata;
DROP POLICY IF EXISTS "seo_metadata_publisher_update" ON public.seo_metadata;
DROP POLICY IF EXISTS "seo_metadata_admin_delete" ON public.seo_metadata;

DROP FUNCTION IF EXISTS public.is_route_publicly_visible(TEXT);

COMMIT;
