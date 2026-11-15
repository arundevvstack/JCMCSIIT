-- ============================================================================
-- Rollback: 20261114000006_cms_extend_existing_tables.down.sql
-- Reverses migration 20261114000006 (run AFTER 00008.down.sql and 00007.down.sql)
-- Preserves all original tables and columns from migrations 00000–00004.
-- ============================================================================

BEGIN;

-- 1. Drop audit, workflow, and `updated_at` triggers added in 00006
DROP TRIGGER IF EXISTS trg_audit_inquiries ON public.inquiries;
DROP TRIGGER IF EXISTS trg_audit_laboratories ON public.laboratories;
DROP TRIGGER IF EXISTS trg_audit_research_projects ON public.research_projects;
DROP TRIGGER IF EXISTS trg_audit_testimonials ON public.testimonials;
DROP TRIGGER IF EXISTS trg_audit_recruiters ON public.recruiters;
DROP TRIGGER IF EXISTS trg_audit_placements ON public.placements;
DROP TRIGGER IF EXISTS trg_audit_seo_metadata ON public.seo_metadata;
DROP TRIGGER IF EXISTS trg_audit_content_blocks ON public.content_blocks;
DROP TRIGGER IF EXISTS trg_audit_pages ON public.pages;
DROP TRIGGER IF EXISTS trg_audit_faculty ON public.faculty;
DROP TRIGGER IF EXISTS trg_audit_departments ON public.departments;

DROP TRIGGER IF EXISTS trg_research_projects_workflow ON public.research_projects;
DROP FUNCTION IF EXISTS public.enforce_research_projects_workflow_rules();

DROP TRIGGER IF EXISTS trg_laboratories_workflow ON public.laboratories;
DROP TRIGGER IF EXISTS trg_testimonials_workflow ON public.testimonials;
DROP TRIGGER IF EXISTS trg_recruiters_workflow ON public.recruiters;
DROP TRIGGER IF EXISTS trg_placements_workflow ON public.placements;
DROP TRIGGER IF EXISTS trg_content_blocks_workflow ON public.content_blocks;
DROP TRIGGER IF EXISTS trg_pages_workflow ON public.pages;
DROP TRIGGER IF EXISTS trg_faculty_workflow ON public.faculty;
DROP TRIGGER IF EXISTS trg_departments_workflow ON public.departments;

DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON public.inquiries;
DROP TRIGGER IF EXISTS trg_laboratories_updated_at ON public.laboratories;
DROP TRIGGER IF EXISTS trg_research_projects_updated_at ON public.research_projects;
DROP TRIGGER IF EXISTS trg_testimonials_updated_at ON public.testimonials;
DROP TRIGGER IF EXISTS trg_recruiters_updated_at ON public.recruiters;
DROP TRIGGER IF EXISTS trg_placements_updated_at ON public.placements;
DROP TRIGGER IF EXISTS trg_content_blocks_updated_at ON public.content_blocks;
DROP TRIGGER IF EXISTS trg_pages_updated_at ON public.pages;
DROP TRIGGER IF EXISTS trg_seo_metadata_updated_at ON public.seo_metadata;
DROP TRIGGER IF EXISTS trg_posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS trg_faculty_updated_at ON public.faculty;
DROP TRIGGER IF EXISTS trg_departments_updated_at ON public.departments;

DROP TRIGGER IF EXISTS trg_sync_pages_publish_flags ON public.pages;
DROP FUNCTION IF EXISTS public.sync_pages_publish_flags();
DROP FUNCTION IF EXISTS public.resolve_department_id(TEXT);

-- 2. Drop indexes created in 00006 and restore legacy indexes from 00001 / 00003
DROP INDEX IF EXISTS public.idx_document_embeddings_vector_hnsw;
DROP INDEX IF EXISTS public.idx_laboratories_dept;
DROP INDEX IF EXISTS public.idx_research_projects_pi;
DROP INDEX IF EXISTS public.idx_research_projects_dept;
DROP INDEX IF EXISTS public.idx_placements_dept_year;
DROP INDEX IF EXISTS public.idx_pages_status_route;
DROP INDEX IF EXISTS public.idx_faculty_dept_status_order;
DROP INDEX IF EXISTS public.idx_departments_status_order;
DROP INDEX IF EXISTS public.idx_departments_slug_aliases;

CREATE INDEX IF NOT EXISTS idx_departments_slug ON public.departments(slug);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_content_blocks_key ON public.content_blocks(key);

-- 3. Drop additive columns added in 00006 (preserving all 00000–00004 columns)
ALTER TABLE public.inquiries
  DROP COLUMN IF EXISTS notes,
  DROP COLUMN IF EXISTS handled_by,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE public.laboratories
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS updated_by,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE public.research_projects
  DROP COLUMN IF EXISTS cms_status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS updated_by,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE public.testimonials
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS updated_by,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE public.recruiters
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS website_url,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS updated_by,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE public.placements
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS updated_by,
  DROP COLUMN IF EXISTS updated_at;

ALTER TABLE public.content_blocks
  DROP COLUMN IF EXISTS block_type,
  DROP COLUMN IF EXISTS structured_data,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS updated_by;

ALTER TABLE public.pages
  ALTER COLUMN content DROP DEFAULT,
  DROP COLUMN IF EXISTS route_path,
  DROP COLUMN IF EXISTS subtitle,
  DROP COLUMN IF EXISTS summary,
  DROP COLUMN IF EXISTS template_type,
  DROP COLUMN IF EXISTS hero_image_url,
  DROP COLUMN IF EXISTS hero_image_caption,
  DROP COLUMN IF EXISTS background_image_url,
  DROP COLUMN IF EXISTS seo_metadata_id,
  DROP COLUMN IF EXISTS integration_status,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS updated_by;

ALTER TABLE public.seo_metadata
  DROP COLUMN IF EXISTS canonical_url,
  DROP COLUMN IF EXISTS og_title,
  DROP COLUMN IF EXISTS og_description,
  DROP COLUMN IF EXISTS twitter_card,
  DROP COLUMN IF EXISTS robots_noindex,
  DROP COLUMN IF EXISTS robots_nofollow,
  DROP COLUMN IF EXISTS schema_type,
  DROP COLUMN IF EXISTS updated_by;

ALTER TABLE public.faculty
  DROP COLUMN IF EXISTS qualifications,
  DROP COLUMN IF EXISTS experience_years,
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS official_contact,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS is_visible,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS updated_by;

ALTER TABLE public.departments
  DROP COLUMN IF EXISTS code,
  DROP COLUMN IF EXISTS slug_aliases,
  DROP COLUMN IF EXISTS programme_type,
  DROP COLUMN IF EXISTS short_description,
  DROP COLUMN IF EXISTS full_description,
  DROP COLUMN IF EXISTS vision,
  DROP COLUMN IF EXISTS mission,
  DROP COLUMN IF EXISTS objectives,
  DROP COLUMN IF EXISTS hod_name,
  DROP COLUMN IF EXISTS hod_designation,
  DROP COLUMN IF EXISTS hod_message,
  DROP COLUMN IF EXISTS hod_image_url,
  DROP COLUMN IF EXISTS hod_email,
  DROP COLUMN IF EXISTS facilities,
  DROP COLUMN IF EXISTS core_areas,
  DROP COLUMN IF EXISTS career_opportunities,
  DROP COLUMN IF EXISTS contact_email,
  DROP COLUMN IF EXISTS contact_phone,
  DROP COLUMN IF EXISTS location,
  DROP COLUMN IF EXISTS banner_url,
  DROP COLUMN IF EXISTS og_image_url,
  DROP COLUMN IF EXISTS display_order,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS published_at,
  DROP COLUMN IF EXISTS scheduled_for,
  DROP COLUMN IF EXISTS archived_at,
  DROP COLUMN IF EXISTS updated_by;

COMMIT;
