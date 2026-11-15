-- ============================================================================
-- Rollback: 20261114000005_cms_rbac_and_audit_foundation.down.sql
-- Reverses migration 20261114000005 (run LAST after 00008, 00007, 00006 down)
-- SECURITY NOTE: Intentionally does NOT restore the unsafe legacy
-- `auth.role() = 'authenticated'` write policies from 00001–00003! Instead,
-- leaves safe published-only public read policies active and fails closed for writes.
-- WARNING: Export `public.audit_logs` and `public.admin_users` before executing.
-- ============================================================================

BEGIN;

DROP TRIGGER IF EXISTS trg_audit_admin_users ON public.admin_users;
DROP TRIGGER IF EXISTS trg_protect_last_super_admin ON public.admin_users;
DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON public.audit_logs;

DROP FUNCTION IF EXISTS public.enforce_cms_workflow_rules();
DROP FUNCTION IF EXISTS public.capture_cms_audit_log();
DROP FUNCTION IF EXISTS public.prevent_audit_log_mutation();
DROP FUNCTION IF EXISTS public.is_cms_member();
DROP FUNCTION IF EXISTS public.has_cms_role(TEXT[]);
DROP FUNCTION IF EXISTS public.get_admin_role();
DROP FUNCTION IF EXISTS public.protect_last_super_admin();
DROP FUNCTION IF EXISTS public.set_updated_at();

DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.admin_users;

-- Restore ONLY safe read-only public policies on legacy tables (NEVER restore `Auth All Access`)
-- Note: Foreign keys upgraded in 00006 (`ON DELETE RESTRICT`) intentionally remain `RESTRICT`
-- to prevent accidental cascade data loss even in a rolled-back state.

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
  public.content_blocks
TO anon;

GRANT INSERT ON public.inquiries TO anon;

DROP POLICY IF EXISTS "Public Read Access" ON public.departments;
CREATE POLICY "Public Read Access" ON public.departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON public.faculty;
CREATE POLICY "Public Read Access" ON public.faculty FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON public.posts;
CREATE POLICY "Public Read Access" ON public.posts FOR SELECT USING (published_at IS NOT NULL AND published_at <= NOW());

DROP POLICY IF EXISTS "Public Read Access" ON public.placements;
CREATE POLICY "Public Read Access" ON public.placements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON public.recruiters;
CREATE POLICY "Public Read Access" ON public.recruiters FOR SELECT USING (COALESCE(is_active, true) = true);

DROP POLICY IF EXISTS "Public Read Access" ON public.testimonials;
CREATE POLICY "Public Read Access" ON public.testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON public.research_projects;
CREATE POLICY "Public Read Access" ON public.research_projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON public.laboratories;
CREATE POLICY "Public Read Access" ON public.laboratories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON public.seo_metadata;
CREATE POLICY "Public Read Access" ON public.seo_metadata FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Access" ON public.pages;
CREATE POLICY "Public Read Access" ON public.pages FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public Read Access" ON public.content_blocks;
CREATE POLICY "Public Read Access" ON public.content_blocks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Inquiries" ON public.inquiries;
CREATE POLICY "Public Insert Inquiries" ON public.inquiries FOR INSERT WITH CHECK (
  length(trim(name)) BETWEEN 2 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (
  bucket_id IN ('pdfs', 'galleries', 'faculty-profiles')
);

COMMIT;
