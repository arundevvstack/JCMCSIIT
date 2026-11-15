-- ============================================================================
-- Rollback: 20261114000007_cms_create_remaining_entities.down.sql
-- Reverses migration 20261114000007 (run AFTER 00008.down.sql)
-- WARNING: Export any production rows from these 11 CMS tables before running.
-- ============================================================================

BEGIN;

-- Drop dependent tables in reverse foreign-key order
DROP TABLE IF EXISTS public.content_revisions;
DROP TABLE IF EXISTS public.site_settings;
DROP TABLE IF EXISTS public.navigation_items;
DROP TABLE IF EXISTS public.gallery_items;
DROP TABLE IF EXISTS public.popups;
DROP TABLE IF EXISTS public.notices;
DROP TABLE IF EXISTS public.events;
DROP TABLE IF EXISTS public.news;
DROP TABLE IF EXISTS public.courses;
DROP TABLE IF EXISTS public.page_sections;
DROP TABLE IF EXISTS public.media;

DROP FUNCTION IF EXISTS public.prevent_revision_update();
DROP FUNCTION IF EXISTS public.enforce_media_security_rules();

COMMIT;
