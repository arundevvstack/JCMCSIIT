-- ============================================================================
-- Migration: 20261114000006_cms_extend_existing_tables.sql
-- Phase 1 (Part 2/4): Additive Extensions to Existing Tables (00000–00004),
-- Civil/Mechanical Slug Alias Normalization, Safe FKs & Index Cleanup
-- ============================================================================

BEGIN;

SET LOCAL search_path = public, extensions;

-- ----------------------------------------------------------------------------
-- 1. EXTEND `public.departments`
--    Adds canonical code, `slug_aliases` (resolving ce<->civil & me<->mechanical),
--    HoD metadata, contact details, structured JSONB fields, and publish workflow.
-- ----------------------------------------------------------------------------

ALTER TABLE public.departments
  ADD COLUMN IF NOT EXISTS code VARCHAR(32) UNIQUE,
  ADD COLUMN IF NOT EXISTS slug_aliases TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS programme_type VARCHAR(32) NOT NULL DEFAULT 'UG'
    CHECK (programme_type IN ('UG', 'PG', 'DIPLOMA', 'SCIENCE_HUMANITIES', 'ADMINISTRATION')),
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS full_description TEXT,
  ADD COLUMN IF NOT EXISTS vision TEXT,
  ADD COLUMN IF NOT EXISTS mission JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hod_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS hod_designation VARCHAR(255),
  ADD COLUMN IF NOT EXISTS hod_message TEXT,
  ADD COLUMN IF NOT EXISTS hod_image_url TEXT,
  ADD COLUMN IF NOT EXISTS hod_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS facilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS core_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS career_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(64),
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS og_image_url TEXT,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_departments_slug_aliases
  ON public.departments USING GIN (slug_aliases);
CREATE INDEX IF NOT EXISTS idx_departments_status_order
  ON public.departments(status, display_order);

-- Helper lookup resolving either canonical `slug` or `slug_aliases` (e.g. 'ce' -> 'civil', 'me' -> 'mechanical')
CREATE OR REPLACE FUNCTION public.resolve_department_id(p_slug_or_code TEXT)
RETURNS UUID
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT d.id
  FROM public.departments d
  WHERE lower(d.slug) = lower(p_slug_or_code)
     OR lower(COALESCE(d.code, '')) = lower(p_slug_or_code)
     OR EXISTS (
       SELECT 1
       FROM unnest(d.slug_aliases) AS alias_val
       WHERE lower(alias_val) = lower(p_slug_or_code)
     )
  LIMIT 1;
$$;

-- ----------------------------------------------------------------------------
-- 2. EXTEND `public.faculty` & PROTECT FK AGAINST ACCIDENTAL CASCADE DELETION
-- ----------------------------------------------------------------------------

-- Replace destructive ON DELETE CASCADE from 00000 with ON DELETE RESTRICT
ALTER TABLE public.faculty
  DROP CONSTRAINT IF EXISTS faculty_department_id_fkey;

ALTER TABLE public.faculty
  ADD CONSTRAINT faculty_department_id_fkey
  FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE RESTRICT;

ALTER TABLE public.faculty
  ADD COLUMN IF NOT EXISTS qualifications TEXT,
  ADD COLUMN IF NOT EXISTS experience_years INTEGER CHECK (experience_years IS NULL OR experience_years >= 0),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(64),
  ADD COLUMN IF NOT EXISTS official_contact TEXT,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_faculty_dept_status_order
  ON public.faculty(department_id, status, is_visible, display_order);

-- ----------------------------------------------------------------------------
-- 3. EXTEND `public.seo_metadata`
-- ----------------------------------------------------------------------------

ALTER TABLE public.seo_metadata
  ADD COLUMN IF NOT EXISTS canonical_url TEXT,
  ADD COLUMN IF NOT EXISTS og_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS og_description TEXT,
  ADD COLUMN IF NOT EXISTS twitter_card VARCHAR(32) NOT NULL DEFAULT 'summary_large_image',
  ADD COLUMN IF NOT EXISTS robots_noindex BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS robots_nofollow BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS schema_type VARCHAR(64),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 4. EXTEND `public.pages` & KEEP `is_published` SYNCHRONIZED WITH `status`
-- ----------------------------------------------------------------------------

ALTER TABLE public.pages
  ADD COLUMN IF NOT EXISTS route_path TEXT UNIQUE
    CHECK (route_path IS NULL OR route_path ~ '^/(?:[A-Za-z0-9._%-]+(?:/[A-Za-z0-9._%-]+)*)?$'),
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS template_type VARCHAR(64) NOT NULL DEFAULT 'content_layout',
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_caption TEXT,
  ADD COLUMN IF NOT EXISTS background_image_url TEXT,
  ADD COLUMN IF NOT EXISTS seo_metadata_id UUID REFERENCES public.seo_metadata(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS integration_status VARCHAR(32) NOT NULL DEFAULT 'pending'
    CHECK (integration_status IN ('pending', 'connected', 'code_managed')),
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Allow structured section-driven pages to omit legacy monolithic markdown `content`
ALTER TABLE public.pages
  ALTER COLUMN content SET DEFAULT '';

-- Backfill `route_path` and `status` cleanly for any pre-existing rows
UPDATE public.pages
SET
  route_path = COALESCE(
    route_path,
    CASE
      WHEN trim(BOTH '/' FROM trim(slug)) = '' OR lower(trim(BOTH '/' FROM trim(slug))) = 'home' THEN '/'
      ELSE '/' || trim(BOTH '/' FROM regexp_replace(trim(slug), '/+', '/', 'g'))
    END
  ),
  status = CASE WHEN is_published = true THEN 'published' ELSE 'draft' END,
  published_at = CASE WHEN is_published = true THEN COALESCE(published_at, updated_at, NOW()) ELSE NULL END
WHERE route_path IS NULL;

CREATE OR REPLACE FUNCTION public.sync_pages_publish_flags()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_clean_slug TEXT;
  v_clean_route TEXT;
BEGIN
  -- Normalize route_path from slug if omitted, stripping trailing/duplicate slashes
  IF NEW.route_path IS NULL AND NEW.slug IS NOT NULL THEN
    v_clean_slug := trim(BOTH '/' FROM regexp_replace(trim(NEW.slug), '/+', '/', 'g'));
    IF v_clean_slug = '' OR lower(v_clean_slug) = 'home' THEN
      NEW.route_path := '/';
    ELSE
      NEW.route_path := '/' || v_clean_slug;
    END IF;
  ELSIF NEW.route_path IS NOT NULL THEN
    v_clean_route := trim(BOTH '/' FROM regexp_replace(trim(NEW.route_path), '/+', '/', 'g'));
    IF v_clean_route = '' THEN
      NEW.route_path := '/';
    ELSE
      NEW.route_path := '/' || v_clean_route;
    END IF;
  END IF;

  -- Prevent created_by spoofing on direct authenticated INSERT calls
  IF TG_OP = 'INSERT' AND auth.uid() IS NOT NULL THEN
    NEW.created_by := auth.uid();
  END IF;

  -- Keep legacy boolean `is_published` strictly derived from `status`
  NEW.is_published := (NEW.status = 'published');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_pages_publish_flags ON public.pages;
CREATE TRIGGER trg_sync_pages_publish_flags
  BEFORE INSERT OR UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_pages_publish_flags();

CREATE INDEX IF NOT EXISTS idx_pages_status_route
  ON public.pages(status, route_path);

-- ----------------------------------------------------------------------------
-- 5. EXTEND `public.content_blocks` & SUPPORTING INSTITUTIONAL TABLES
-- ----------------------------------------------------------------------------

ALTER TABLE public.content_blocks
  ADD COLUMN IF NOT EXISTS block_type VARCHAR(64) NOT NULL DEFAULT 'markdown'
    CHECK (block_type IN ('markdown', 'rich_text', 'hero', 'cta', 'stats', 'links', 'contact', 'json')),
  ADD COLUMN IF NOT EXISTS structured_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.placements
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.recruiters
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Protect research_projects and laboratories against accidental department CASCADE deletion
ALTER TABLE public.research_projects
  DROP CONSTRAINT IF EXISTS research_projects_department_id_fkey;
ALTER TABLE public.research_projects
  ADD CONSTRAINT research_projects_department_id_fkey
  FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE RESTRICT;

ALTER TABLE public.laboratories
  DROP CONSTRAINT IF EXISTS laboratories_department_id_fkey;
ALTER TABLE public.laboratories
  ADD CONSTRAINT laboratories_department_id_fkey
  FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE RESTRICT;

-- Note: research_projects already has `status` ('ongoing'|'completed'|'proposed') from 00001,
-- so its CMS publication state uses `cms_status`.
ALTER TABLE public.research_projects
  ADD COLUMN IF NOT EXISTS cms_status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (cms_status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.laboratories
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.inquiries
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS handled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Drop `DEFAULT NOW()` on `published_at` after backfilling any pre-existing rows
-- so newly inserted `'draft'` rows keep `published_at = NULL` until published.
ALTER TABLE public.departments ALTER COLUMN published_at DROP DEFAULT;
ALTER TABLE public.faculty ALTER COLUMN published_at DROP DEFAULT;
ALTER TABLE public.content_blocks ALTER COLUMN published_at DROP DEFAULT;
ALTER TABLE public.placements ALTER COLUMN published_at DROP DEFAULT;
ALTER TABLE public.recruiters ALTER COLUMN published_at DROP DEFAULT;
ALTER TABLE public.testimonials ALTER COLUMN published_at DROP DEFAULT;
ALTER TABLE public.research_projects ALTER COLUMN published_at DROP DEFAULT;
ALTER TABLE public.laboratories ALTER COLUMN published_at DROP DEFAULT;

-- ----------------------------------------------------------------------------
-- 6. DROP REDUNDANT DUPLICATE INDEXES & ADD MISSING FK / VECTOR INDEXES
-- ----------------------------------------------------------------------------

DROP INDEX IF EXISTS public.idx_departments_slug;
DROP INDEX IF EXISTS public.idx_posts_slug;
DROP INDEX IF EXISTS public.idx_pages_slug;
DROP INDEX IF EXISTS public.idx_content_blocks_key;

CREATE INDEX IF NOT EXISTS idx_placements_dept_year
  ON public.placements(department_id, year DESC);
CREATE INDEX IF NOT EXISTS idx_research_projects_dept
  ON public.research_projects(department_id);
CREATE INDEX IF NOT EXISTS idx_research_projects_pi
  ON public.research_projects(principal_investigator);
CREATE INDEX IF NOT EXISTS idx_laboratories_dept
  ON public.laboratories(department_id);

CREATE INDEX IF NOT EXISTS idx_document_embeddings_vector_hnsw
  ON public.document_embeddings USING hnsw (embedding vector_cosine_ops);

-- ----------------------------------------------------------------------------
-- 7. ATTACH `updated_at`, WORKFLOW & AUDIT TRIGGERS TO EXISTING TABLES
-- ----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_departments_updated_at ON public.departments;
CREATE TRIGGER trg_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_faculty_updated_at ON public.faculty;
CREATE TRIGGER trg_faculty_updated_at
  BEFORE UPDATE ON public.faculty
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_posts_updated_at ON public.posts;
CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_seo_metadata_updated_at ON public.seo_metadata;
CREATE TRIGGER trg_seo_metadata_updated_at
  BEFORE UPDATE ON public.seo_metadata
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_pages_updated_at ON public.pages;
CREATE TRIGGER trg_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_content_blocks_updated_at ON public.content_blocks;
CREATE TRIGGER trg_content_blocks_updated_at
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_placements_updated_at ON public.placements;
CREATE TRIGGER trg_placements_updated_at
  BEFORE UPDATE ON public.placements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_recruiters_updated_at ON public.recruiters;
CREATE TRIGGER trg_recruiters_updated_at
  BEFORE UPDATE ON public.recruiters
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER trg_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_research_projects_updated_at ON public.research_projects;
CREATE TRIGGER trg_research_projects_updated_at
  BEFORE UPDATE ON public.research_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_laboratories_updated_at ON public.laboratories;
CREATE TRIGGER trg_laboratories_updated_at
  BEFORE UPDATE ON public.laboratories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER trg_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Workflow enforcement triggers on extended CMS content tables
DROP TRIGGER IF EXISTS trg_departments_workflow ON public.departments;
CREATE TRIGGER trg_departments_workflow
  BEFORE INSERT OR UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_faculty_workflow ON public.faculty;
CREATE TRIGGER trg_faculty_workflow
  BEFORE INSERT OR UPDATE ON public.faculty
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_pages_workflow ON public.pages;
CREATE TRIGGER trg_pages_workflow
  BEFORE INSERT OR UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_content_blocks_workflow ON public.content_blocks;
CREATE TRIGGER trg_content_blocks_workflow
  BEFORE INSERT OR UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_placements_workflow ON public.placements;
CREATE TRIGGER trg_placements_workflow
  BEFORE INSERT OR UPDATE ON public.placements
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_recruiters_workflow ON public.recruiters;
CREATE TRIGGER trg_recruiters_workflow
  BEFORE INSERT OR UPDATE ON public.recruiters
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_testimonials_workflow ON public.testimonials;
CREATE TRIGGER trg_testimonials_workflow
  BEFORE INSERT OR UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_laboratories_workflow ON public.laboratories;
CREATE TRIGGER trg_laboratories_workflow
  BEFORE INSERT OR UPDATE ON public.laboratories
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

-- Dedicated workflow trigger for `research_projects` (whose CMS workflow column is `cms_status`)
CREATE OR REPLACE FUNCTION public.enforce_research_projects_workflow_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID;
  v_role VARCHAR(32);
BEGIN
  v_uid := auth.uid();

  IF v_uid IS NOT NULL THEN
    v_role := public.get_admin_role();

    IF v_role IS NULL THEN
      RAISE EXCEPTION 'Unauthorized: active CMS administrator role required.';
    END IF;

    IF v_role = 'EDITOR' THEN
      IF TG_OP = 'INSERT' AND NEW.cms_status <> 'draft' THEN
        RAISE EXCEPTION 'Forbidden: EDITOR role may only create records in draft status.';
      END IF;

      IF TG_OP = 'UPDATE' THEN
        IF OLD.cms_status <> 'draft' THEN
          RAISE EXCEPTION 'Forbidden: EDITOR role cannot directly modify published, scheduled, or archived records.';
        END IF;
        IF NEW.cms_status <> 'draft' THEN
          RAISE EXCEPTION 'Forbidden: EDITOR role cannot publish, schedule, or archive content.';
        END IF;
      END IF;
    END IF;

    -- Prevent updated_by spoofing on direct PostgREST mutations
    NEW.updated_by := v_uid;
  END IF;

  IF NEW.cms_status = 'draft' THEN
    NEW.published_at := NULL;
    NEW.scheduled_for := NULL;
    NEW.archived_at := NULL;
  ELSIF NEW.cms_status = 'published' THEN
    IF NEW.published_at IS NULL OR (TG_OP = 'UPDATE' AND OLD.cms_status <> 'published') THEN
      NEW.published_at := COALESCE(NEW.published_at, NOW());
    END IF;
    NEW.archived_at := NULL;
  ELSIF NEW.cms_status = 'scheduled' THEN
    IF NEW.scheduled_for IS NULL THEN
      RAISE EXCEPTION 'Validation error: scheduled_for timestamp is required when cms_status is scheduled.';
    END IF;
    NEW.published_at := NULL;
    NEW.archived_at := NULL;
  ELSIF NEW.cms_status = 'archived' THEN
    IF NEW.archived_at IS NULL THEN
      NEW.archived_at := NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_research_projects_workflow ON public.research_projects;
CREATE TRIGGER trg_research_projects_workflow
  BEFORE INSERT OR UPDATE ON public.research_projects
  FOR EACH ROW EXECUTE FUNCTION public.enforce_research_projects_workflow_rules();

-- Audit logging triggers on extended CMS content & lead tables
DROP TRIGGER IF EXISTS trg_audit_departments ON public.departments;
CREATE TRIGGER trg_audit_departments
  AFTER INSERT OR UPDATE OR DELETE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_faculty ON public.faculty;
CREATE TRIGGER trg_audit_faculty
  AFTER INSERT OR UPDATE OR DELETE ON public.faculty
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_pages ON public.pages;
CREATE TRIGGER trg_audit_pages
  AFTER INSERT OR UPDATE OR DELETE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_content_blocks ON public.content_blocks;
CREATE TRIGGER trg_audit_content_blocks
  AFTER INSERT OR UPDATE OR DELETE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_seo_metadata ON public.seo_metadata;
CREATE TRIGGER trg_audit_seo_metadata
  AFTER INSERT OR UPDATE OR DELETE ON public.seo_metadata
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_placements ON public.placements;
CREATE TRIGGER trg_audit_placements
  AFTER INSERT OR UPDATE OR DELETE ON public.placements
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_recruiters ON public.recruiters;
CREATE TRIGGER trg_audit_recruiters
  AFTER INSERT OR UPDATE OR DELETE ON public.recruiters
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_testimonials ON public.testimonials;
CREATE TRIGGER trg_audit_testimonials
  AFTER INSERT OR UPDATE OR DELETE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_research_projects ON public.research_projects;
CREATE TRIGGER trg_audit_research_projects
  AFTER INSERT OR UPDATE OR DELETE ON public.research_projects
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_laboratories ON public.laboratories;
CREATE TRIGGER trg_audit_laboratories
  AFTER INSERT OR UPDATE OR DELETE ON public.laboratories
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_inquiries ON public.inquiries;
CREATE TRIGGER trg_audit_inquiries
  AFTER UPDATE OR DELETE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

COMMIT;
