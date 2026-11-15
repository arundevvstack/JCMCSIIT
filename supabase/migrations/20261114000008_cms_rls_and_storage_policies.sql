-- ============================================================================
-- Migration: 20261114000008_cms_rls_and_storage_policies.sql
-- Phase 1 (Part 4/4): Enable RLS Across All 26 Public Tables, Least-Privilege
-- Table Grants, Role-Separated CMS Policies & Hardened Supabase Storage Buckets
-- ============================================================================

BEGIN;

SET LOCAL search_path = public, extensions;

-- ----------------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ON EVERY PUBLIC TABLE (ALL 26 TABLES)
-- ----------------------------------------------------------------------------

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 2. LEAST-PRIVILEGE TABLE GRANTS
--    - `anon` receives SELECT on public-facing tables ONLY + INSERT on inquiries.
--    - `anon` gets ZERO privileges on admin_users, audit_logs, content_revisions,
--      document_embeddings, and ZERO SELECT/UPDATE/DELETE on inquiries.
--    - Neither `anon` nor `authenticated` can UPDATE/DELETE audit_logs or UPDATE
--      content_revisions.
-- ----------------------------------------------------------------------------

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM authenticated;

REVOKE UPDATE, DELETE ON public.audit_logs FROM anon, authenticated;
REVOKE UPDATE ON public.content_revisions FROM anon, authenticated;

GRANT SELECT ON
  public.departments,
  public.faculty,
  public.posts,
  public.placements,
  public.recruiters,
  public.testimonials,
  public.research_projects,
  public.laboratories,
  public.seo_metadata,
  public.pages,
  public.page_sections,
  public.content_blocks,
  public.media,
  public.courses,
  public.news,
  public.events,
  public.notices,
  public.popups,
  public.gallery_items,
  public.navigation_items,
  public.site_settings
TO anon;

GRANT INSERT ON public.inquiries TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.departments,
  public.faculty,
  public.posts,
  public.placements,
  public.document_embeddings,
  public.recruiters,
  public.testimonials,
  public.research_projects,
  public.laboratories,
  public.inquiries,
  public.seo_metadata,
  public.pages,
  public.page_sections,
  public.content_blocks,
  public.admin_users,
  public.media,
  public.courses,
  public.news,
  public.events,
  public.notices,
  public.popups,
  public.gallery_items,
  public.navigation_items,
  public.site_settings
TO authenticated;

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.content_revisions TO authenticated;

-- ----------------------------------------------------------------------------
-- 3. `admin_users` POLICIES
--    - Active CMS members can read ONLY their own allowlist profile row.
--    - ONLY `SUPER_ADMIN` can list all admins or INSERT / UPDATE / DELETE admins.
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "admin_users_select_self" ON public.admin_users;
CREATE POLICY "admin_users_select_self"
  ON public.admin_users FOR SELECT TO authenticated
  USING (id = auth.uid() AND is_active = true);

DROP POLICY IF EXISTS "admin_users_super_admin_all" ON public.admin_users;
CREATE POLICY "admin_users_super_admin_all"
  ON public.admin_users FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN']));

-- ----------------------------------------------------------------------------
-- 4. `audit_logs` POLICIES (APPEND-ONLY)
--    - SELECT: `SUPER_ADMIN` and `ADMIN` only.
--    - INSERT: Active CMS members recording their own `auth.uid()` actions.
--    - UPDATE / DELETE: None (and blocked by `trg_audit_logs_immutable`).
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_read"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

DROP POLICY IF EXISTS "audit_logs_cms_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_cms_insert"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_cms_member() AND actor_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 5. `content_revisions` POLICIES
--    - SELECT & INSERT: All active CMS roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `PUBLISHER`).
--    - DELETE: `SUPER_ADMIN` and `ADMIN` only (for retention pruning).
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "content_revisions_cms_read" ON public.content_revisions;
CREATE POLICY "content_revisions_cms_read"
  ON public.content_revisions FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "content_revisions_cms_insert" ON public.content_revisions;
CREATE POLICY "content_revisions_cms_insert"
  ON public.content_revisions FOR INSERT TO authenticated
  WITH CHECK (
    public.is_cms_member()
    AND (created_by IS NULL OR created_by = auth.uid())
  );

DROP POLICY IF EXISTS "content_revisions_admin_delete" ON public.content_revisions;
CREATE POLICY "content_revisions_admin_delete"
  ON public.content_revisions FOR DELETE TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

-- ----------------------------------------------------------------------------
-- 6. `inquiries` POLICIES (STUDENT PII PROTECTION)
--    - Public visitors may INSERT validated new inquiries ONLY (`status = 'new'`).
--    - ZERO public SELECT; ONLY `SUPER_ADMIN` and `ADMIN` can read/manage leads.
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS "inquiries_public_insert" ON public.inquiries;
CREATE POLICY "inquiries_public_insert"
  ON public.inquiries FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 2 AND 255
    AND length(trim(email)) BETWEEN 5 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (phone IS NULL OR length(phone) <= 50)
    AND (course_interest IS NULL OR length(course_interest) <= 255)
    AND (message IS NULL OR length(message) <= 5000)
    AND COALESCE(status, 'new') = 'new'
    AND notes IS NULL
    AND handled_by IS NULL
  );

DROP POLICY IF EXISTS "inquiries_admin_all" ON public.inquiries;
CREATE POLICY "inquiries_admin_all"
  ON public.inquiries FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

-- ----------------------------------------------------------------------------
-- 7. `document_embeddings` & LEGACY `posts` POLICIES
-- ----------------------------------------------------------------------------

-- Lock down legacy `match_documents` RPC from anonymous invocation
REVOKE ALL ON FUNCTION public.match_documents(vector, double precision, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_documents(vector, double precision, integer) TO authenticated, service_role;

DROP POLICY IF EXISTS "document_embeddings_cms_read" ON public.document_embeddings;
CREATE POLICY "document_embeddings_cms_read"
  ON public.document_embeddings FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "document_embeddings_admin_all" ON public.document_embeddings;
CREATE POLICY "document_embeddings_admin_all"
  ON public.document_embeddings FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

DROP POLICY IF EXISTS "posts_public_read_published" ON public.posts;
CREATE POLICY "posts_public_read_published"
  ON public.posts FOR SELECT TO anon, authenticated
  USING (published_at IS NOT NULL AND published_at <= NOW());

DROP POLICY IF EXISTS "posts_cms_read_all" ON public.posts;
CREATE POLICY "posts_cms_read_all"
  ON public.posts FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "posts_admin_all" ON public.posts;
CREATE POLICY "posts_admin_all"
  ON public.posts FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

-- ----------------------------------------------------------------------------
-- 8. `media`, `site_settings`, `navigation_items` & `seo_metadata` POLICIES
-- ----------------------------------------------------------------------------

-- `media`:
--   - Public sees non-archived items (`is_archived = false`).
--   - CMS members read all media rows for dashboard listing.
--   - `SUPER_ADMIN` & `ADMIN` have full CRUD (including archive & delete).
--   - `EDITOR` may INSERT new active rows bound to their own `auth.uid()` and
--     UPDATE descriptive metadata ONLY on their own active rows (locator/archive
--     fields are additionally locked by `trg_media_security`).
DROP POLICY IF EXISTS "media_public_read_active" ON public.media;
CREATE POLICY "media_public_read_active"
  ON public.media FOR SELECT TO anon, authenticated
  USING (is_archived = false);

DROP POLICY IF EXISTS "media_cms_read_all" ON public.media;
CREATE POLICY "media_cms_read_all"
  ON public.media FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "media_editor_update" ON public.media;
DROP POLICY IF EXISTS "media_admin_delete" ON public.media;

DROP POLICY IF EXISTS "media_admin_all" ON public.media;
CREATE POLICY "media_admin_all"
  ON public.media FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

DROP POLICY IF EXISTS "media_editor_insert" ON public.media;
CREATE POLICY "media_editor_insert"
  ON public.media FOR INSERT TO authenticated
  WITH CHECK (
    public.has_cms_role(ARRAY['EDITOR'])
    AND uploaded_by = auth.uid()
    AND is_archived = false
  );

DROP POLICY IF EXISTS "media_editor_update_own" ON public.media;
CREATE POLICY "media_editor_update_own"
  ON public.media FOR UPDATE TO authenticated
  USING (
    public.has_cms_role(ARRAY['EDITOR'])
    AND uploaded_by = auth.uid()
    AND is_archived = false
  )
  WITH CHECK (
    public.has_cms_role(ARRAY['EDITOR'])
    AND uploaded_by = auth.uid()
    AND is_archived = false
  );

-- `site_settings`: public reads ONLY `is_public = true`; writes restricted to SUPER_ADMIN & ADMIN
DROP POLICY IF EXISTS "site_settings_public_read" ON public.site_settings;
CREATE POLICY "site_settings_public_read"
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (is_public = true);

DROP POLICY IF EXISTS "site_settings_cms_read" ON public.site_settings;
CREATE POLICY "site_settings_cms_read"
  ON public.site_settings FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "site_settings_admin_all" ON public.site_settings;
CREATE POLICY "site_settings_admin_all"
  ON public.site_settings FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

-- `navigation_items`: public reads published & visible items; writes restricted to SUPER_ADMIN & ADMIN
DROP POLICY IF EXISTS "navigation_items_public_read" ON public.navigation_items;
CREATE POLICY "navigation_items_public_read"
  ON public.navigation_items FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND is_visible = true
    AND (published_at IS NULL OR published_at <= NOW())
  );

DROP POLICY IF EXISTS "navigation_items_cms_read" ON public.navigation_items;
CREATE POLICY "navigation_items_cms_read"
  ON public.navigation_items FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "navigation_items_admin_all" ON public.navigation_items;
CREATE POLICY "navigation_items_admin_all"
  ON public.navigation_items FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

-- `seo_metadata`:
--   Uses a `SECURITY DEFINER` helper (`is_route_publicly_visible`) so checking
--   `public.pages` for unpublished routes is NOT blinded by `anon`'s RLS on `pages`.
CREATE OR REPLACE FUNCTION public.is_route_publicly_visible(p_route_path TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.pages p
    WHERE p.route_path = p_route_path
      AND (
        p.status <> 'published'
        OR p.is_published IS DISTINCT FROM true
        OR (p.published_at IS NOT NULL AND p.published_at > NOW())
      )
  );
$$;

REVOKE ALL ON FUNCTION public.is_route_publicly_visible(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_route_publicly_visible(TEXT) TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "seo_metadata_public_read" ON public.seo_metadata;
CREATE POLICY "seo_metadata_public_read"
  ON public.seo_metadata FOR SELECT TO anon, authenticated
  USING (public.is_route_publicly_visible(route_path));

DROP POLICY IF EXISTS "seo_metadata_cms_read" ON public.seo_metadata;
CREATE POLICY "seo_metadata_cms_read"
  ON public.seo_metadata FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "seo_metadata_publisher_insert" ON public.seo_metadata;
CREATE POLICY "seo_metadata_publisher_insert"
  ON public.seo_metadata FOR INSERT TO authenticated
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN', 'PUBLISHER']));

DROP POLICY IF EXISTS "seo_metadata_publisher_update" ON public.seo_metadata;
CREATE POLICY "seo_metadata_publisher_update"
  ON public.seo_metadata FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN', 'PUBLISHER']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN', 'PUBLISHER']));

DROP POLICY IF EXISTS "seo_metadata_admin_delete" ON public.seo_metadata;
CREATE POLICY "seo_metadata_admin_delete"
  ON public.seo_metadata FOR DELETE TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

-- ----------------------------------------------------------------------------
-- 9. UNIVERSAL PAGE MANAGEMENT POLICIES (`pages`, `page_sections`, `content_blocks`)
--    - Public reads STRICTLY published rows (and `page_sections` requires parent
--      `pages` row to also be published).
--    - `EDITOR` can INSERT/UPDATE ONLY `status = 'draft'`.
--    - `PUBLISHER` can UPDATE status transitions (`draft` <-> `published`/`scheduled`/`archived`).
--    - `SUPER_ADMIN` & `ADMIN` have full CRUD.
-- ----------------------------------------------------------------------------

-- `pages`
DROP POLICY IF EXISTS "pages_public_read_published" ON public.pages;
CREATE POLICY "pages_public_read_published"
  ON public.pages FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND is_published = true
    AND (published_at IS NULL OR published_at <= NOW())
  );

DROP POLICY IF EXISTS "pages_cms_read_all" ON public.pages;
CREATE POLICY "pages_cms_read_all"
  ON public.pages FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "pages_admin_all" ON public.pages;
CREATE POLICY "pages_admin_all"
  ON public.pages FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

DROP POLICY IF EXISTS "pages_editor_insert_draft" ON public.pages;
CREATE POLICY "pages_editor_insert_draft"
  ON public.pages FOR INSERT TO authenticated
  WITH CHECK (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft');

DROP POLICY IF EXISTS "pages_editor_update_draft" ON public.pages;
CREATE POLICY "pages_editor_update_draft"
  ON public.pages FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft')
  WITH CHECK (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft');

DROP POLICY IF EXISTS "pages_publisher_update" ON public.pages;
CREATE POLICY "pages_publisher_update"
  ON public.pages FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['PUBLISHER']))
  WITH CHECK (public.has_cms_role(ARRAY['PUBLISHER']));

-- `page_sections`
DROP POLICY IF EXISTS "page_sections_public_read_published" ON public.page_sections;
CREATE POLICY "page_sections_public_read_published"
  ON public.page_sections FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND is_visible = true
    AND (published_at IS NULL OR published_at <= NOW())
    AND EXISTS (
      SELECT 1
      FROM public.pages p
      WHERE p.id = page_sections.page_id
        AND p.status = 'published'
        AND p.is_published = true
        AND (p.published_at IS NULL OR p.published_at <= NOW())
    )
  );

DROP POLICY IF EXISTS "page_sections_cms_read_all" ON public.page_sections;
CREATE POLICY "page_sections_cms_read_all"
  ON public.page_sections FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "page_sections_admin_all" ON public.page_sections;
CREATE POLICY "page_sections_admin_all"
  ON public.page_sections FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

DROP POLICY IF EXISTS "page_sections_editor_insert_draft" ON public.page_sections;
CREATE POLICY "page_sections_editor_insert_draft"
  ON public.page_sections FOR INSERT TO authenticated
  WITH CHECK (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft');

DROP POLICY IF EXISTS "page_sections_editor_update_draft" ON public.page_sections;
CREATE POLICY "page_sections_editor_update_draft"
  ON public.page_sections FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft')
  WITH CHECK (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft');

DROP POLICY IF EXISTS "page_sections_publisher_update" ON public.page_sections;
CREATE POLICY "page_sections_publisher_update"
  ON public.page_sections FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['PUBLISHER']))
  WITH CHECK (public.has_cms_role(ARRAY['PUBLISHER']));

-- `content_blocks`
DROP POLICY IF EXISTS "content_blocks_public_read_published" ON public.content_blocks;
CREATE POLICY "content_blocks_public_read_published"
  ON public.content_blocks FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND (published_at IS NULL OR published_at <= NOW())
  );

DROP POLICY IF EXISTS "content_blocks_cms_read_all" ON public.content_blocks;
CREATE POLICY "content_blocks_cms_read_all"
  ON public.content_blocks FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "content_blocks_admin_all" ON public.content_blocks;
CREATE POLICY "content_blocks_admin_all"
  ON public.content_blocks FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

DROP POLICY IF EXISTS "content_blocks_editor_insert_draft" ON public.content_blocks;
CREATE POLICY "content_blocks_editor_insert_draft"
  ON public.content_blocks FOR INSERT TO authenticated
  WITH CHECK (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft');

DROP POLICY IF EXISTS "content_blocks_editor_update_draft" ON public.content_blocks;
CREATE POLICY "content_blocks_editor_update_draft"
  ON public.content_blocks FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft')
  WITH CHECK (public.has_cms_role(ARRAY['EDITOR']) AND status = 'draft');

DROP POLICY IF EXISTS "content_blocks_publisher_update" ON public.content_blocks;
CREATE POLICY "content_blocks_publisher_update"
  ON public.content_blocks FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['PUBLISHER']))
  WITH CHECK (public.has_cms_role(ARRAY['PUBLISHER']));

-- ----------------------------------------------------------------------------
-- 10. ACADEMIC, NEWS, EVENTS, NOTICES, POPUPS, GALLERY & INSTITUTIONAL TABLES
--     Applies identical strict separation:
--     - Public: published (+ active/non-expired/visible where applicable) ONLY.
--     - CMS Members: SELECT all statuses for dashboard listing & preview.
--     - EDITOR: INSERT/UPDATE `draft` ONLY (never publish or delete).
--     - PUBLISHER: UPDATE for review & publication workflow.
--     - SUPER_ADMIN & ADMIN: Full CRUD.
-- ----------------------------------------------------------------------------

-- Helper DO block to attach standard CMS role policies (`cms_read_all`, `admin_all`,
-- `editor_insert_draft`, `editor_update_draft`, `publisher_update`) consistently
-- across all standard `status`-bearing content tables, while keeping each table's
-- bespoke public SELECT policy explicit and auditable below.

DO $$
DECLARE
  t TEXT;
  standard_tables TEXT[] := ARRAY[
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
    'laboratories'
  ];
BEGIN
  FOREACH t IN ARRAY standard_tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_cms_read_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.is_cms_member())',
      t || '_cms_read_all', t
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_admin_all', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.has_cms_role(ARRAY[''SUPER_ADMIN'', ''ADMIN''])) WITH CHECK (public.has_cms_role(ARRAY[''SUPER_ADMIN'', ''ADMIN'']))',
      t || '_admin_all', t
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_editor_insert_draft', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_cms_role(ARRAY[''EDITOR'']) AND status = ''draft'')',
      t || '_editor_insert_draft', t
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_editor_update_draft', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.has_cms_role(ARRAY[''EDITOR'']) AND status = ''draft'') WITH CHECK (public.has_cms_role(ARRAY[''EDITOR'']) AND status = ''draft'')',
      t || '_editor_update_draft', t
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_publisher_update', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.has_cms_role(ARRAY[''PUBLISHER''])) WITH CHECK (public.has_cms_role(ARRAY[''PUBLISHER'']))',
      t || '_publisher_update', t
    );
  END LOOP;
END;
$$;

-- Explicit Public SELECT Policies (Strictly Published Only + Domain Rules)

DROP POLICY IF EXISTS "departments_public_read_published" ON public.departments;
CREATE POLICY "departments_public_read_published"
  ON public.departments FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

DROP POLICY IF EXISTS "faculty_public_read_published" ON public.faculty;
CREATE POLICY "faculty_public_read_published"
  ON public.faculty FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND is_visible = true
    AND (published_at IS NULL OR published_at <= NOW())
  );

DROP POLICY IF EXISTS "courses_public_read_published" ON public.courses;
CREATE POLICY "courses_public_read_published"
  ON public.courses FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

DROP POLICY IF EXISTS "news_public_read_published" ON public.news;
CREATE POLICY "news_public_read_published"
  ON public.news FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

DROP POLICY IF EXISTS "events_public_read_published" ON public.events;
CREATE POLICY "events_public_read_published"
  ON public.events FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

DROP POLICY IF EXISTS "notices_public_read_published" ON public.notices;
CREATE POLICY "notices_public_read_published"
  ON public.notices FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND (published_at IS NULL OR published_at <= NOW())
    AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE)
  );

DROP POLICY IF EXISTS "popups_public_read_active" ON public.popups;
CREATE POLICY "popups_public_read_active"
  ON public.popups FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND is_enabled = true
    AND (published_at IS NULL OR published_at <= NOW())
    AND (start_at IS NULL OR start_at <= NOW())
    AND (end_at IS NULL OR end_at >= NOW())
  );

DROP POLICY IF EXISTS "gallery_items_public_read_published" ON public.gallery_items;
CREATE POLICY "gallery_items_public_read_published"
  ON public.gallery_items FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

DROP POLICY IF EXISTS "placements_public_read_published" ON public.placements;
CREATE POLICY "placements_public_read_published"
  ON public.placements FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

DROP POLICY IF EXISTS "recruiters_public_read_published" ON public.recruiters;
CREATE POLICY "recruiters_public_read_published"
  ON public.recruiters FOR SELECT TO anon, authenticated
  USING (
    status = 'published'
    AND COALESCE(is_active, true) = true
    AND (published_at IS NULL OR published_at <= NOW())
  );

DROP POLICY IF EXISTS "testimonials_public_read_published" ON public.testimonials;
CREATE POLICY "testimonials_public_read_published"
  ON public.testimonials FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

DROP POLICY IF EXISTS "laboratories_public_read_published" ON public.laboratories;
CREATE POLICY "laboratories_public_read_published"
  ON public.laboratories FOR SELECT TO anon, authenticated
  USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

-- `research_projects` (uses `cms_status` because `status` tracks 'ongoing'|'completed'|'proposed')
DROP POLICY IF EXISTS "research_projects_public_read_published" ON public.research_projects;
CREATE POLICY "research_projects_public_read_published"
  ON public.research_projects FOR SELECT TO anon, authenticated
  USING (cms_status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

DROP POLICY IF EXISTS "research_projects_cms_read_all" ON public.research_projects;
CREATE POLICY "research_projects_cms_read_all"
  ON public.research_projects FOR SELECT TO authenticated
  USING (public.is_cms_member());

DROP POLICY IF EXISTS "research_projects_admin_all" ON public.research_projects;
CREATE POLICY "research_projects_admin_all"
  ON public.research_projects FOR ALL TO authenticated
  USING (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']))
  WITH CHECK (public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN']));

DROP POLICY IF EXISTS "research_projects_editor_insert_draft" ON public.research_projects;
CREATE POLICY "research_projects_editor_insert_draft"
  ON public.research_projects FOR INSERT TO authenticated
  WITH CHECK (public.has_cms_role(ARRAY['EDITOR']) AND cms_status = 'draft');

DROP POLICY IF EXISTS "research_projects_editor_update_draft" ON public.research_projects;
CREATE POLICY "research_projects_editor_update_draft"
  ON public.research_projects FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['EDITOR']) AND cms_status = 'draft')
  WITH CHECK (public.has_cms_role(ARRAY['EDITOR']) AND cms_status = 'draft');

DROP POLICY IF EXISTS "research_projects_publisher_update" ON public.research_projects;
CREATE POLICY "research_projects_publisher_update"
  ON public.research_projects FOR UPDATE TO authenticated
  USING (public.has_cms_role(ARRAY['PUBLISHER']))
  WITH CHECK (public.has_cms_role(ARRAY['PUBLISHER']));

-- ----------------------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKET HARDENING & `storage.objects` POLICIES
--     - Enforces bucket-level MIME allowlists and file size limits (5 MB images,
--       15 MB PDFs) to protect Supabase Free Tier (1 GB storage quota).
--     - Never uses `auth.role() = 'authenticated'`; requires verified CMS roles.
-- ----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'cms-media',
    'cms-media',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'cms-documents',
    'cms-documents',
    true,
    15728640,
    ARRAY['application/pdf']
  ),
  (
    'pdfs',
    'pdfs',
    true,
    15728640,
    ARRAY['application/pdf']
  ),
  (
    'galleries',
    'galleries',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  (
    'faculty-profiles',
    'faculty-profiles',
    true,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "cms_storage_public_read" ON storage.objects;
CREATE POLICY "cms_storage_public_read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id IN ('cms-media', 'cms-documents', 'pdfs', 'galleries', 'faculty-profiles')
  );

DROP POLICY IF EXISTS "cms_storage_role_insert" ON storage.objects;
CREATE POLICY "cms_storage_role_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('cms-media', 'cms-documents', 'pdfs', 'galleries', 'faculty-profiles')
    AND public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN', 'EDITOR'])
    AND position('..' in name) = 0
  );

-- Restrict in-place object overwrites (`FOR UPDATE`) to `SUPER_ADMIN` and `ADMIN`
-- so `EDITOR` cannot overwrite existing live files served to the public website.
DROP POLICY IF EXISTS "cms_storage_role_update" ON storage.objects;
DROP POLICY IF EXISTS "cms_storage_admin_update" ON storage.objects;
CREATE POLICY "cms_storage_admin_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('cms-media', 'cms-documents', 'pdfs', 'galleries', 'faculty-profiles')
    AND public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN'])
  )
  WITH CHECK (
    bucket_id IN ('cms-media', 'cms-documents', 'pdfs', 'galleries', 'faculty-profiles')
    AND public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN'])
    AND position('..' in name) = 0
  );

DROP POLICY IF EXISTS "cms_storage_admin_delete" ON storage.objects;
CREATE POLICY "cms_storage_admin_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id IN ('cms-media', 'cms-documents', 'pdfs', 'galleries', 'faculty-profiles')
    AND public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN'])
  );

COMMIT;
