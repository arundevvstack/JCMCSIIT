-- ============================================================================
-- Migration: 20261114000007_cms_create_remaining_entities.sql
-- Phase 1 (Part 3/4): Create Remaining Normalized CMS Entities, Triggers &
-- Non-Destructive Legacy `posts` Data Bridge
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. CENTRALIZED MEDIA REGISTRY (`public.media`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id VARCHAR(64) NOT NULL
    CHECK (bucket_id IN ('cms-media', 'cms-documents', 'pdfs', 'galleries', 'faculty-profiles')),
  storage_path TEXT UNIQUE NOT NULL,
  public_url TEXT NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(128) NOT NULL,
  size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0 AND size_bytes <= 15728640),
  width INTEGER CHECK (width IS NULL OR width > 0),
  height INTEGER CHECK (height IS NULL OR height > 0),
  alt_text TEXT,
  caption TEXT,
  sha256_hash VARCHAR(64),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_bucket_archived_created
  ON public.media(bucket_id, is_archived, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_sha256
  ON public.media(sha256_hash) WHERE sha256_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_media_mime_type
  ON public.media(mime_type);

-- Enforce strict ownership & immutable locator fields on `public.media`
CREATE OR REPLACE FUNCTION public.enforce_media_security_rules()
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

    IF v_role IS NULL OR v_role NOT IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR') THEN
      RAISE EXCEPTION 'Forbidden: active SUPER_ADMIN, ADMIN, or EDITOR role required to mutate media.';
    END IF;

    IF TG_OP = 'INSERT' THEN
      -- Prevent uploaded_by spoofing
      NEW.uploaded_by := v_uid;
      IF v_role = 'EDITOR' THEN
        NEW.is_archived := false;
      END IF;
    ELSIF TG_OP = 'UPDATE' THEN
      IF v_role = 'EDITOR' THEN
        IF OLD.uploaded_by IS DISTINCT FROM v_uid OR OLD.is_archived = true THEN
          RAISE EXCEPTION 'Forbidden: EDITOR may only update metadata on their own active uploads.';
        END IF;

        IF NEW.bucket_id IS DISTINCT FROM OLD.bucket_id
           OR NEW.storage_path IS DISTINCT FROM OLD.storage_path
           OR NEW.public_url IS DISTINCT FROM OLD.public_url
           OR NEW.mime_type IS DISTINCT FROM OLD.mime_type
           OR NEW.size_bytes IS DISTINCT FROM OLD.size_bytes
           OR NEW.sha256_hash IS DISTINCT FROM OLD.sha256_hash
           OR NEW.uploaded_by IS DISTINCT FROM OLD.uploaded_by
           OR NEW.is_archived IS DISTINCT FROM OLD.is_archived THEN
          RAISE EXCEPTION 'Forbidden: EDITOR cannot alter storage locator fields, ownership, or archive state on media.';
        END IF;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_media_security ON public.media;
CREATE TRIGGER trg_media_security
  BEFORE INSERT OR UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.enforce_media_security_rules();

-- ----------------------------------------------------------------------------
-- 2. UNIVERSAL PAGE SECTIONS (`public.page_sections`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_key VARCHAR(128) NOT NULL
    CHECK (section_key ~ '^[a-z0-9]+(?:[_-][a-z0-9]+)*$'),
  section_type VARCHAR(64) NOT NULL DEFAULT 'rich_text'
    CHECK (section_type IN (
      'hero',
      'rich_text',
      'image_text',
      'cards_grid',
      'stats_row',
      'faq_accordion',
      'cta_banner',
      'document_list',
      'table_block',
      'timeline',
      'gallery_strip',
      'custom_json'
    )),
  title VARCHAR(255),
  subtitle TEXT,
  body_markdown TEXT,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  image_url TEXT,
  image_caption TEXT,
  background_image_url TEXT,
  cta_primary_label VARCHAR(120),
  cta_primary_url TEXT,
  cta_secondary_label VARCHAR(120),
  cta_secondary_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT page_sections_page_section_key_unique UNIQUE (page_id, section_key)
);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_sort
  ON public.page_sections(page_id, status, is_visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_page_sections_media
  ON public.page_sections(media_id) WHERE media_id IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 3. ACADEMIC PROGRAMMES / COURSES (`public.courses`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  code VARCHAR(64) UNIQUE,
  name VARCHAR(255) NOT NULL,
  degree VARCHAR(128),
  category VARCHAR(32) NOT NULL DEFAULT 'UG'
    CHECK (category IN ('UG', 'PG', 'DIPLOMA', 'CERTIFICATE')),
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  duration VARCHAR(64),
  intake INTEGER CHECK (intake IS NULL OR intake >= 0),
  eligibility TEXT,
  overview TEXT,
  vision TEXT,
  mission JSONB NOT NULL DEFAULT '[]'::jsonb,
  peos JSONB NOT NULL DEFAULT '[]'::jsonb,
  psos JSONB NOT NULL DEFAULT '[]'::jsonb,
  facilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  curriculum_highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  career_prospects JSONB NOT NULL DEFAULT '[]'::jsonb,
  admission_info TEXT,
  syllabus_pdf_url TEXT,
  featured_image_url TEXT,
  media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  seo_metadata_id UUID REFERENCES public.seo_metadata(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_category_status_order
  ON public.courses(category, status, display_order);
CREATE INDEX IF NOT EXISTS idx_courses_department
  ON public.courses(department_id);

-- ----------------------------------------------------------------------------
-- 4. NEWS ARTICLES (`public.news`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(64) NOT NULL DEFAULT 'General',
  featured_image_url TEXT,
  media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  show_in_ticker BOOLEAN NOT NULL DEFAULT false,
  seo_metadata_id UUID REFERENCES public.seo_metadata(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_status_published
  ON public.news(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured
  ON public.news(is_featured, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_news_ticker
  ON public.news(show_in_ticker, published_at DESC) WHERE status = 'published';

-- ----------------------------------------------------------------------------
-- 5. EVENTS (`public.events`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL DEFAULT 'Campus Event',
  description TEXT,
  content TEXT,
  poster_url TEXT,
  media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  contain_poster BOOLEAN NOT NULL DEFAULT false,
  event_start_at TIMESTAMPTZ,
  event_end_at TIMESTAMPTZ,
  display_date_text VARCHAR(128),
  display_time_text VARCHAR(128),
  location VARCHAR(255),
  registration_url TEXT,
  registration_deadline_at TIMESTAMPTZ,
  secondary_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  event_state VARCHAR(32) NOT NULL DEFAULT 'upcoming'
    CHECK (event_state IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  seo_metadata_id UUID REFERENCES public.seo_metadata(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT events_valid_date_range
    CHECK (event_end_at IS NULL OR event_start_at IS NULL OR event_end_at >= event_start_at)
);

CREATE INDEX IF NOT EXISTS idx_events_status_start
  ON public.events(status, event_start_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_featured
  ON public.events(is_featured, event_start_at DESC) WHERE status = 'published';

-- ----------------------------------------------------------------------------
-- 6. NOTICES, CIRCULARS & ANNOUNCEMENTS (`public.notices`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  category VARCHAR(64) NOT NULL DEFAULT 'Circular',
  file_url TEXT,
  media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  notice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  show_in_ticker BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notices_valid_expiry
    CHECK (expiry_date IS NULL OR expiry_date >= notice_date)
);

CREATE INDEX IF NOT EXISTS idx_notices_status_pinned_date
  ON public.notices(status, is_pinned DESC, notice_date DESC);
CREATE INDEX IF NOT EXISTS idx_notices_ticker
  ON public.notices(show_in_ticker, notice_date DESC) WHERE status = 'published';

-- ----------------------------------------------------------------------------
-- 7. PROMOTIONAL / EVENT POPUPS (`public.popups`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.popups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  mobile_image_url TEXT,
  media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  cta_label VARCHAR(120),
  cta_url TEXT,
  secondary_cta_label VARCHAR(120),
  secondary_cta_url TEXT,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  frequency VARCHAR(32) NOT NULL DEFAULT 'every_session'
    CHECK (frequency IN ('every_session', 'once_per_day', 'once_ever', 'every_visit')),
  priority INTEGER NOT NULL DEFAULT 0,
  target_devices VARCHAR(20) NOT NULL DEFAULT 'all'
    CHECK (target_devices IN ('all', 'desktop', 'mobile')),
  target_routes TEXT[] NOT NULL DEFAULT '{}',
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT popups_valid_window
    CHECK (end_at IS NULL OR start_at IS NULL OR end_at >= start_at)
);

CREATE INDEX IF NOT EXISTS idx_popups_active_window
  ON public.popups(status, is_enabled, priority DESC, start_at, end_at);

-- ----------------------------------------------------------------------------
-- 8. GALLERY ITEMS (`public.gallery_items`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  category VARCHAR(64) NOT NULL DEFAULT 'Campus',
  album_name VARCHAR(128),
  image_url TEXT NOT NULL,
  media_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_status_category_sort
  ON public.gallery_items(status, category, sort_order);

-- ----------------------------------------------------------------------------
-- 9. GLOBAL NAVIGATION ITEMS (`public.navigation_items`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_location VARCHAR(32) NOT NULL
    CHECK (menu_location IN ('navbar', 'footer', 'quick_links', 'floating_actions', 'ticker')),
  parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  href TEXT NOT NULL,
  open_in_new_tab BOOLEAN NOT NULL DEFAULT false,
  badge_text VARCHAR(64),
  icon_name VARCHAR(64),
  column_group VARCHAR(64),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT navigation_items_no_self_parent
    CHECK (parent_id IS NULL OR parent_id <> id)
);

CREATE INDEX IF NOT EXISTS idx_navigation_items_location_parent_sort
  ON public.navigation_items(menu_location, status, is_visible, parent_id, sort_order);

-- ----------------------------------------------------------------------------
-- 10. GLOBAL SITE SETTINGS (`public.site_settings`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
  key VARCHAR(128) PRIMARY KEY
    CHECK (key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$'),
  category VARCHAR(64) NOT NULL DEFAULT 'general',
  value_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_settings_category_public
  ON public.site_settings(category, is_public);

-- ----------------------------------------------------------------------------
-- 11. IMMUTABLE CONTENT REVISIONS (`public.content_revisions`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(64) NOT NULL,
  entity_id UUID NOT NULL,
  version_number INTEGER NOT NULL CHECK (version_number >= 1),
  snapshot_json JSONB NOT NULL,
  change_summary TEXT,
  status_at_save VARCHAR(32),
  created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT content_revisions_entity_version_unique
    UNIQUE (entity_type, entity_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_content_revisions_entity_created
  ON public.content_revisions(entity_type, entity_id, created_at DESC);

-- Prevent in-place mutation of historical revision snapshots (delete allowed only for admin retention pruning)
CREATE OR REPLACE FUNCTION public.prevent_revision_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'content_revisions snapshots are immutable and cannot be updated in place.';
END;
$$;

DROP TRIGGER IF EXISTS trg_content_revisions_no_update ON public.content_revisions;
CREATE TRIGGER trg_content_revisions_no_update
  BEFORE UPDATE ON public.content_revisions
  FOR EACH ROW EXECUTE FUNCTION public.prevent_revision_update();

-- ----------------------------------------------------------------------------
-- 12. NON-DESTRUCTIVE DATA BRIDGE FROM LEGACY `public.posts` (IF ANY ROWS EXIST)
--     Copies legacy `news`, `event`, and `notice` rows into the normalized tables
--     while preserving `public.posts` untouched.
-- ----------------------------------------------------------------------------

INSERT INTO public.news (
  id, slug, title, content, featured_image_url, status, published_at, created_at, updated_at
)
SELECT
  p.id,
  COALESCE(
    NULLIF(trim(BOTH '-' FROM regexp_replace(lower(trim(p.slug)), '[^a-z0-9]+', '-', 'g')), ''),
    'news-' || replace(p.id::text, '-', '')
  ),
  p.title,
  p.content,
  p.featured_image,
  'published',
  COALESCE(p.published_at, p.created_at, NOW()),
  COALESCE(p.created_at, NOW()),
  COALESCE(p.updated_at, NOW())
FROM public.posts p
WHERE p.type = 'news'
ON CONFLICT DO NOTHING;

INSERT INTO public.events (
  id, slug, title, content, poster_url, event_start_at, status, published_at, created_at, updated_at
)
SELECT
  p.id,
  COALESCE(
    NULLIF(trim(BOTH '-' FROM regexp_replace(lower(trim(p.slug)), '[^a-z0-9]+', '-', 'g')), ''),
    'event-' || replace(p.id::text, '-', '')
  ),
  p.title,
  p.content,
  p.featured_image,
  p.event_date,
  'published',
  COALESCE(p.published_at, p.created_at, NOW()),
  COALESCE(p.created_at, NOW()),
  COALESCE(p.updated_at, NOW())
FROM public.posts p
WHERE p.type = 'event'
ON CONFLICT DO NOTHING;

INSERT INTO public.notices (
  id, slug, title, summary, notice_date, status, published_at, created_at, updated_at
)
SELECT
  p.id,
  COALESCE(
    NULLIF(trim(BOTH '-' FROM regexp_replace(lower(trim(p.slug)), '[^a-z0-9]+', '-', 'g')), ''),
    'notice-' || replace(p.id::text, '-', '')
  ),
  p.title,
  p.content,
  COALESCE(p.event_date::date, p.published_at::date, CURRENT_DATE),
  'published',
  COALESCE(p.published_at, p.created_at, NOW()),
  COALESCE(p.created_at, NOW()),
  COALESCE(p.updated_at, NOW())
FROM public.posts p
WHERE p.type = 'notice'
ON CONFLICT DO NOTHING;

-- ----------------------------------------------------------------------------
-- 13. ATTACH `updated_at`, WORKFLOW & AUDIT TRIGGERS TO ALL NEW TABLES
-- ----------------------------------------------------------------------------

-- Automatic `updated_at` triggers
DROP TRIGGER IF EXISTS trg_media_updated_at ON public.media;
CREATE TRIGGER trg_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_page_sections_updated_at ON public.page_sections;
CREATE TRIGGER trg_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_courses_updated_at ON public.courses;
CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_news_updated_at ON public.news;
CREATE TRIGGER trg_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_notices_updated_at ON public.notices;
CREATE TRIGGER trg_notices_updated_at
  BEFORE UPDATE ON public.notices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_popups_updated_at ON public.popups;
CREATE TRIGGER trg_popups_updated_at
  BEFORE UPDATE ON public.popups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER trg_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_navigation_items_updated_at ON public.navigation_items;
CREATE TRIGGER trg_navigation_items_updated_at
  BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Workflow enforcement triggers (blocks EDITOR from publishing/modifying published rows)
DROP TRIGGER IF EXISTS trg_page_sections_workflow ON public.page_sections;
CREATE TRIGGER trg_page_sections_workflow
  BEFORE INSERT OR UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_courses_workflow ON public.courses;
CREATE TRIGGER trg_courses_workflow
  BEFORE INSERT OR UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_news_workflow ON public.news;
CREATE TRIGGER trg_news_workflow
  BEFORE INSERT OR UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_events_workflow ON public.events;
CREATE TRIGGER trg_events_workflow
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_notices_workflow ON public.notices;
CREATE TRIGGER trg_notices_workflow
  BEFORE INSERT OR UPDATE ON public.notices
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_popups_workflow ON public.popups;
CREATE TRIGGER trg_popups_workflow
  BEFORE INSERT OR UPDATE ON public.popups
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_gallery_items_workflow ON public.gallery_items;
CREATE TRIGGER trg_gallery_items_workflow
  BEFORE INSERT OR UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

DROP TRIGGER IF EXISTS trg_navigation_items_workflow ON public.navigation_items;
CREATE TRIGGER trg_navigation_items_workflow
  BEFORE INSERT OR UPDATE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION public.enforce_cms_workflow_rules();

-- Immutable audit log triggers on all new content, media, nav & settings tables
DROP TRIGGER IF EXISTS trg_audit_media ON public.media;
CREATE TRIGGER trg_audit_media
  AFTER INSERT OR UPDATE OR DELETE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_page_sections ON public.page_sections;
CREATE TRIGGER trg_audit_page_sections
  AFTER INSERT OR UPDATE OR DELETE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_courses ON public.courses;
CREATE TRIGGER trg_audit_courses
  AFTER INSERT OR UPDATE OR DELETE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_news ON public.news;
CREATE TRIGGER trg_audit_news
  AFTER INSERT OR UPDATE OR DELETE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_events ON public.events;
CREATE TRIGGER trg_audit_events
  AFTER INSERT OR UPDATE OR DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_notices ON public.notices;
CREATE TRIGGER trg_audit_notices
  AFTER INSERT OR UPDATE OR DELETE ON public.notices
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_popups ON public.popups;
CREATE TRIGGER trg_audit_popups
  AFTER INSERT OR UPDATE OR DELETE ON public.popups
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_gallery_items ON public.gallery_items;
CREATE TRIGGER trg_audit_gallery_items
  AFTER INSERT OR UPDATE OR DELETE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_navigation_items ON public.navigation_items;
CREATE TRIGGER trg_audit_navigation_items
  AFTER INSERT OR UPDATE OR DELETE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

DROP TRIGGER IF EXISTS trg_audit_site_settings ON public.site_settings;
CREATE TRIGGER trg_audit_site_settings
  AFTER INSERT OR UPDATE OR DELETE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.capture_cms_audit_log();

-- ----------------------------------------------------------------------------
-- 14. FAIL-CLOSED RLS & PRIVILEGE LOCKDOWN WITHIN THE SAME TRANSACTION
--     Ensures ZERO exposure window between 00007 commit and 00008 commit even
--     if a CLI push is interrupted mid-flight.
-- ----------------------------------------------------------------------------

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

REVOKE ALL ON
  public.media,
  public.page_sections,
  public.courses,
  public.news,
  public.events,
  public.notices,
  public.popups,
  public.gallery_items,
  public.navigation_items,
  public.site_settings,
  public.content_revisions
FROM anon;

COMMIT;
