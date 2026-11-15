-- ============================================================================
-- JCMCSIIT CMS — PHASE 1 CONSOLIDATED SQL MIGRATION SCRIPT (00000 -> 00008)
-- Target Project: jcmcsiit-cms (ref: etoiwczwtlsusskzmcdr)
-- Execution Surface: Supabase Dashboard -> SQL Editor
--
-- Exact Source Migrations Included in Execution Order:
--   1. 20260525000000_init_schema.sql
--   2. 20260525000001_phase2_schema.sql
--   3. 20260525000002_storage_buckets.sql
--   4. 20260525000003_cms_tables.sql
--   5. 20260525000004_faculty_fields.sql
--   6. 20261114000005_cms_rbac_and_audit_foundation.sql
--   7. 20261114000006_cms_extend_existing_tables.sql
--   8. 20261114000007_cms_create_remaining_entities.sql
--   9. 20261114000008_cms_rls_and_storage_policies.sql
--
-- Transaction, Extension & Migration History Guarantees:
--   - Wrapped in ONE single outer atomic transaction (BEGIN ... COMMIT) so
--     intermediate legacy policies in 00001–00003 are NEVER exposed externally,
--     and any error rolls back all changes cleanly.
--   - Pre-installs pgvector into the dedicated 'extensions' schema where
--     compatible before Step 1 so 'public' stays clean of extension objects
--     (satisfying Supabase Security Advisor) without altering 00000.
--   - NEVER manually INSERTs into or DELETEs from
--     supabase_migrations.schema_migrations. After successful SQL Editor
--     execution, record applied history solely via the official Supabase CLI:
--       npx supabase link --project-ref etoiwczwtlsusskzmcdr
--       npx supabase migration repair --status applied \
--         20260525000000 20260525000001 20260525000002 20260525000003 20260525000004 \
--         20261114000005 20261114000006 20261114000007 20261114000008
-- ============================================================================

BEGIN;

-- Ensure the 'extensions' schema exists and install pgvector into 'extensions'
-- (where compatible, i.e. when not already installed elsewhere) so Step 1's
-- 'CREATE EXTENSION IF NOT EXISTS vector;' becomes a clean no-op and 'public'
-- stays free of extension functions/operators.
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

SET LOCAL search_path = public, extensions;

-- ############################################################################
-- STEP 1 OF 9: 20260525000000_init_schema.sql
-- ############################################################################

-- Enable pgvector extension for AI features
CREATE EXTENSION IF NOT EXISTS vector;

-- Departments Table
-- Departments Table
CREATE TABLE departments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    ai_summary TEXT, -- AI generated summary
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faculty Table
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    email VARCHAR(255),
    image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events & News Table (Combined Content Type)
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('event', 'news', 'notice')),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Placements Table
CREATE TABLE placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    company_logo TEXT,
    package_lpa DECIMAL(5,2),
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Embeddings for RAG (Retrieval-Augmented Generation)
CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type VARCHAR(50), -- e.g., 'department', 'post', 'faculty', 'general'
    source_id UUID,
    content TEXT NOT NULL,
    embedding vector(1536), -- Assuming OpenAI ada-002 dimension (1536)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to match embeddings for RAG
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  source_type varchar,
  source_id uuid,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    document_embeddings.id,
    document_embeddings.source_type,
    document_embeddings.source_id,
    document_embeddings.content,
    1 - (document_embeddings.embedding <=> query_embedding) AS similarity
  FROM document_embeddings
  WHERE 1 - (document_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ############################################################################
-- STEP 2 OF 9: 20260525000001_phase2_schema.sql
-- ############################################################################

-- Phase 2 Database Schema Enhancements

-- 1. Recruiters Table
CREATE TABLE recruiters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    tier VARCHAR(50), -- e.g., 'Tier 1', 'Startup', 'Global'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Testimonials
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    content TEXT NOT NULL,
    image_url TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Research Projects
CREATE TABLE research_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    principal_investigator UUID REFERENCES faculty(id) ON DELETE SET NULL,
    funding_agency VARCHAR(255),
    status VARCHAR(50) CHECK (status IN ('ongoing', 'completed', 'proposed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Laboratories
CREATE TABLE laboratories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    equipment_list TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Inquiries (Lead Capture / Admissions Funnel)
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    course_interest VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SEO Metadata (Dynamic overrides per route)
CREATE TABLE seo_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_path VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    description TEXT,
    keywords TEXT[],
    og_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Add Indexes for Performance & Vector Search
CREATE INDEX idx_departments_slug ON departments(slug);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_document_embeddings_source ON document_embeddings(source_type, source_id);

-- 8. Row Level Security (RLS) Policies
-- Note: Assuming Supabase Auth is used. For local dev/public queries, we allow reads.
-- Writes are restricted to authenticated users.

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- Allow public read access to content tables
CREATE POLICY "Public Read Access" ON departments FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON faculty FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON posts FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON placements FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON document_embeddings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON recruiters FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON research_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON laboratories FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON seo_metadata FOR SELECT USING (true);

-- Allow public insert to inquiries (lead capture form)
CREATE POLICY "Public Insert Inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Restrict everything else to Authenticated Users (Admins)
-- Example generic admin policy for updates/inserts on content
CREATE POLICY "Auth All Access" ON departments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON faculty FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON placements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON document_embeddings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON recruiters FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON research_projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON laboratories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON seo_metadata FOR ALL USING (auth.role() = 'authenticated');

-- ############################################################################
-- STEP 3 OF 9: 20260525000002_storage_buckets.sql
-- ############################################################################

-- Create Storage Buckets for Media and PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('pdfs', 'pdfs', true),
  ('galleries', 'galleries', true),
  ('faculty-profiles', 'faculty-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Security Policies for Storage
-- Allow public access to read all files in these buckets
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id IN ('pdfs', 'galleries', 'faculty-profiles') );

-- Allow authenticated users to upload files
CREATE POLICY "Auth Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('pdfs', 'galleries', 'faculty-profiles')
);

-- Allow authenticated users to update their files
CREATE POLICY "Auth Update Access" 
ON storage.objects FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('pdfs', 'galleries', 'faculty-profiles')
);

-- Allow authenticated users to delete files
CREATE POLICY "Auth Delete Access" 
ON storage.objects FOR DELETE 
USING (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('pdfs', 'galleries', 'faculty-profiles')
);

-- ############################################################################
-- STEP 4 OF 9: 20260525000003_cms_tables.sql
-- ############################################################################

-- Phase 3 CMS Enhancements: Pages & Content Blocks

-- 1. Pages Table (For full dynamic pages)
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL, -- Markdown content
    is_published BOOLEAN DEFAULT false,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Content Blocks Table (For reusable snippets/sections)
CREATE TABLE content_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL, -- Markdown or HTML content
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_content_blocks_key ON content_blocks(key);

-- 4. Row Level Security (RLS) Policies
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public Read Access" ON pages FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON content_blocks FOR SELECT USING (true);

-- Restrict everything else to Authenticated Users (Admins)
CREATE POLICY "Auth All Access" ON pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth All Access" ON content_blocks FOR ALL USING (auth.role() = 'authenticated');

-- ############################################################################
-- STEP 5 OF 9: 20260525000004_faculty_fields.sql
-- ############################################################################

-- Phase 4: Faculty Profile Fields
-- Add dynamic profile fields and routing slug to the faculty table

ALTER TABLE faculty
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS cv_url TEXT,
ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb;

-- Optional: Create index on JSONB for searching (GIN index)
CREATE INDEX IF NOT EXISTS idx_faculty_profile_data ON faculty USING GIN (profile_data);

-- ############################################################################
-- STEP 6 OF 9: 20261114000005_cms_rbac_and_audit_foundation.sql
-- ############################################################################

-- ============================================================================
-- Migration: 20261114000005_cms_rbac_and_audit_foundation.sql
-- Phase 1 (Part 1/4): Administrator RBAC Allowlist, Immutable Audit Logging,
-- Shared Trigger Utilities & Immediate Removal of Legacy Unsafe RLS Policies
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. IMMEDIATELY DROP UNSAFE LEGACY POLICIES FROM MIGRATIONS 00001, 00002, 00003
--    (Eliminates `auth.role() = 'authenticated'` escalation & draft leaks)
-- ----------------------------------------------------------------------------

-- Drop permissive "Auth All Access" policies from 00001 & 00003
DROP POLICY IF EXISTS "Auth All Access" ON public.departments;
DROP POLICY IF EXISTS "Auth All Access" ON public.faculty;
DROP POLICY IF EXISTS "Auth All Access" ON public.posts;
DROP POLICY IF EXISTS "Auth All Access" ON public.placements;
DROP POLICY IF EXISTS "Auth All Access" ON public.document_embeddings;
DROP POLICY IF EXISTS "Auth All Access" ON public.recruiters;
DROP POLICY IF EXISTS "Auth All Access" ON public.testimonials;
DROP POLICY IF EXISTS "Auth All Access" ON public.research_projects;
DROP POLICY IF EXISTS "Auth All Access" ON public.laboratories;
DROP POLICY IF EXISTS "Auth All Access" ON public.inquiries;
DROP POLICY IF EXISTS "Auth All Access" ON public.seo_metadata;
DROP POLICY IF EXISTS "Auth All Access" ON public.pages;
DROP POLICY IF EXISTS "Auth All Access" ON public.content_blocks;

-- Drop unrestricted "Public Read Access" / "Public Insert" policies to replace
-- them in 00008 with strict published-only and validated policies
DROP POLICY IF EXISTS "Public Read Access" ON public.departments;
DROP POLICY IF EXISTS "Public Read Access" ON public.faculty;
DROP POLICY IF EXISTS "Public Read Access" ON public.posts;
DROP POLICY IF EXISTS "Public Read Access" ON public.placements;
DROP POLICY IF EXISTS "Public Read Access" ON public.document_embeddings;
DROP POLICY IF EXISTS "Public Read Access" ON public.recruiters;
DROP POLICY IF EXISTS "Public Read Access" ON public.testimonials;
DROP POLICY IF EXISTS "Public Read Access" ON public.research_projects;
DROP POLICY IF EXISTS "Public Read Access" ON public.laboratories;
DROP POLICY IF EXISTS "Public Read Access" ON public.seo_metadata;
DROP POLICY IF EXISTS "Public Read Access" ON public.pages;
DROP POLICY IF EXISTS "Public Read Access" ON public.content_blocks;
DROP POLICY IF EXISTS "Public Insert Inquiries" ON public.inquiries;

-- Drop unsafe storage policies from 00002
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Access" ON storage.objects;

-- ----------------------------------------------------------------------------
-- 2. SHARED `updated_at` AUTOMATIC TIMESTAMP TRIGGER FUNCTION
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3. ADMINISTRATOR ALLOWLIST TABLE (`public.admin_users`)
--    Only users explicitly present here with `is_active = true` have CMS access.
--    Self-registration in `auth.users` NEVER creates a row here.
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  full_name VARCHAR(255) NOT NULL CHECK (length(trim(full_name)) >= 2),
  role VARCHAR(32) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'PUBLISHER')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_active_role
  ON public.admin_users(is_active, role);

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER trg_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Prevent accidental lockout by forbidding removal/demotion/deactivation of the
-- last active SUPER_ADMIN when at least one SUPER_ADMIN already exists.
CREATE OR REPLACE FUNCTION public.protect_last_super_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  remaining_super_admins INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.role = 'SUPER_ADMIN' AND OLD.is_active = true THEN
      SELECT COUNT(*) INTO remaining_super_admins
      FROM public.admin_users
      WHERE role = 'SUPER_ADMIN' AND is_active = true AND id <> OLD.id;

      IF remaining_super_admins = 0 THEN
        RAISE EXCEPTION 'Cannot delete the last active SUPER_ADMIN account.';
      END IF;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.role = 'SUPER_ADMIN' AND OLD.is_active = true
       AND (NEW.role <> 'SUPER_ADMIN' OR NEW.is_active = false) THEN
      SELECT COUNT(*) INTO remaining_super_admins
      FROM public.admin_users
      WHERE role = 'SUPER_ADMIN' AND is_active = true AND id <> OLD.id;

      IF remaining_super_admins = 0 THEN
        RAISE EXCEPTION 'Cannot demote or deactivate the last active SUPER_ADMIN account.';
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_last_super_admin ON public.admin_users;
CREATE TRIGGER trg_protect_last_super_admin
  BEFORE UPDATE OR DELETE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_last_super_admin();

-- ----------------------------------------------------------------------------
-- 4. SECURITY DEFINER AUTHORIZATION HELPERS FOR RLS & STORAGE POLICIES
--    Uses `SET search_path = public` to prevent schema-shadowing attacks.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS VARCHAR(32)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.admin_users
  WHERE id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_cms_role(allowed_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT role = ANY(allowed_roles)
      FROM public.admin_users
      WHERE id = auth.uid()
        AND is_active = true
      LIMIT 1
    ),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_cms_member()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_cms_role(ARRAY['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'PUBLISHER']);
$$;

REVOKE ALL ON FUNCTION public.get_admin_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_cms_role(TEXT[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_cms_member() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_admin_role() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_cms_role(TEXT[]) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_cms_member() TO anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 5. IMMUTABLE APPEND-ONLY AUDIT LOGS (`public.audit_logs`)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email VARCHAR(255),
  actor_role VARCHAR(32),
  action VARCHAR(64) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id TEXT,
  previous_data JSONB,
  new_data JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address VARCHAR(64),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
  ON public.audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
  ON public.audit_logs(actor_id, created_at DESC);

-- Cryptographic/transactional immutability: nobody may UPDATE or DELETE audit_logs
CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only; UPDATE and DELETE operations are strictly prohibited.';
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON public.audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- Automatic row-level audit trigger function for security- & content-critical tables
CREATE OR REPLACE FUNCTION public.capture_cms_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID;
  v_email VARCHAR(255);
  v_role VARCHAR(32);
  v_entity_id TEXT;
BEGIN
  v_uid := auth.uid();

  IF v_uid IS NOT NULL THEN
    SELECT email, role INTO v_email, v_role
    FROM public.admin_users
    WHERE id = v_uid
    LIMIT 1;
  ELSE
    v_role := left(COALESCE(NULLIF(current_setting('role', true), 'none'), current_user), 32);
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_entity_id := COALESCE(to_jsonb(OLD)->>'id', to_jsonb(OLD)->>'key');
    INSERT INTO public.audit_logs (
      actor_id, actor_email, actor_role, action, entity_type, entity_id, previous_data, new_data
    ) VALUES (
      v_uid, v_email, v_role, TG_OP, TG_TABLE_NAME, v_entity_id, to_jsonb(OLD), NULL
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    v_entity_id := COALESCE(to_jsonb(NEW)->>'id', to_jsonb(NEW)->>'key');
    INSERT INTO public.audit_logs (
      actor_id, actor_email, actor_role, action, entity_type, entity_id, previous_data, new_data
    ) VALUES (
      v_uid, v_email, v_role, TG_OP, TG_TABLE_NAME, v_entity_id, to_jsonb(OLD), to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    v_entity_id := COALESCE(to_jsonb(NEW)->>'id', to_jsonb(NEW)->>'key');
    INSERT INTO public.audit_logs (
      actor_id, actor_email, actor_role, action, entity_type, entity_id, previous_data, new_data
    ) VALUES (
      v_uid, v_email, v_role, TG_OP, TG_TABLE_NAME, v_entity_id, NULL, to_jsonb(NEW)
    );
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_admin_users ON public.admin_users;
CREATE TRIGGER trg_audit_admin_users
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.capture_cms_audit_log();

-- ----------------------------------------------------------------------------
-- 6. WORKFLOW ENFORCEMENT TRIGGER FUNCTION FOR CONTENT TABLES
--    Guarantees at DB level that EDITOR accounts cannot publish/unpublish/archive
--    even via direct PostgREST queries, and keeps `published_at` consistent.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_cms_workflow_rules()
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

  -- Enforce role-level state transition rules whenever called by a JWT user session
  IF v_uid IS NOT NULL THEN
    v_role := public.get_admin_role();

    IF v_role IS NULL THEN
      RAISE EXCEPTION 'Unauthorized: active CMS administrator role required.';
    END IF;

    IF v_role = 'EDITOR' THEN
      IF TG_OP = 'INSERT' AND NEW.status <> 'draft' THEN
        RAISE EXCEPTION 'Forbidden: EDITOR role may only create records in draft status.';
      END IF;

      IF TG_OP = 'UPDATE' THEN
        IF OLD.status <> 'draft' THEN
          RAISE EXCEPTION 'Forbidden: EDITOR role cannot directly modify published, scheduled, or archived records.';
        END IF;
        IF NEW.status <> 'draft' THEN
          RAISE EXCEPTION 'Forbidden: EDITOR role cannot publish, schedule, or archive content.';
        END IF;
      END IF;
    END IF;

    -- Prevent updated_by spoofing on direct PostgREST mutations
    NEW.updated_by := v_uid;
  END IF;

  -- Maintain workflow timestamps strictly per status state
  IF NEW.status = 'draft' THEN
    NEW.published_at := NULL;
    NEW.scheduled_for := NULL;
    NEW.archived_at := NULL;
  ELSIF NEW.status = 'published' THEN
    IF NEW.published_at IS NULL OR (TG_OP = 'UPDATE' AND OLD.status <> 'published') THEN
      NEW.published_at := COALESCE(NEW.published_at, NOW());
    END IF;
    NEW.archived_at := NULL;
  ELSIF NEW.status = 'scheduled' THEN
    IF NEW.scheduled_for IS NULL THEN
      RAISE EXCEPTION 'Validation error: scheduled_for timestamp is required when status is scheduled.';
    END IF;
    NEW.published_at := NULL;
    NEW.archived_at := NULL;
  ELSIF NEW.status = 'archived' THEN
    IF NEW.archived_at IS NULL THEN
      NEW.archived_at := NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ############################################################################
-- STEP 7 OF 9: 20261114000006_cms_extend_existing_tables.sql
-- ############################################################################

-- ============================================================================
-- Migration: 20261114000006_cms_extend_existing_tables.sql
-- Phase 1 (Part 2/4): Additive Extensions to Existing Tables (00000–00004),
-- Civil/Mechanical Slug Alias Normalization, Safe FKs & Index Cleanup
-- ============================================================================


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

-- ############################################################################
-- STEP 8 OF 9: 20261114000007_cms_create_remaining_entities.sql
-- ############################################################################

-- ============================================================================
-- Migration: 20261114000007_cms_create_remaining_entities.sql
-- Phase 1 (Part 3/4): Create Remaining Normalized CMS Entities, Triggers &
-- Non-Destructive Legacy `posts` Data Bridge
-- ============================================================================


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

-- ############################################################################
-- STEP 9 OF 9: 20261114000008_cms_rls_and_storage_policies.sql
-- ############################################################################

-- ============================================================================
-- Migration: 20261114000008_cms_rls_and_storage_policies.sql
-- Phase 1 (Part 4/4): Enable RLS Across All 26 Public Tables, Least-Privilege
-- Table Grants, Role-Separated CMS Policies & Hardened Supabase Storage Buckets
-- ============================================================================


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

-- ============================================================================
-- POST-EXECUTION VERIFICATION QUERIES (READ-ONLY)
-- Copy and run the SELECT queries below in a separate SQL Editor tab AFTER
-- the migration script above reports "Success. No rows returned."
-- ============================================================================
/*
-- Check 1: Confirm all 26 public tables exist AND all 26 have RLS enabled (expect 26 total, 26 rls_enabled, 0 rls_disabled)
SELECT
  COUNT(*) AS total_public_tables,
  COUNT(*) FILTER (WHERE rowsecurity = true) AS rls_enabled_tables,
  COUNT(*) FILTER (WHERE rowsecurity = false) AS rls_disabled_tables
FROM pg_tables
WHERE schemaname = 'public';

-- Check 2: List every public table with its RLS state and policy count (expect rowsecurity = true and policy_count >= 2 on all 26 tables)
SELECT
  t.tablename,
  t.rowsecurity AS rls_enabled,
  COUNT(p.policyname) AS policy_count
FROM pg_tables t
LEFT JOIN pg_policies p
  ON p.schemaname = t.schemaname AND p.tablename = t.tablename
WHERE t.schemaname = 'public'
GROUP BY t.tablename, t.rowsecurity
ORDER BY t.tablename;

-- Check 3: Confirm ZERO unsafe legacy auth.role() = 'authenticated' policies remain in public or storage (expect 0 rows)
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
  AND (
    COALESCE(qual, '') ILIKE '%auth.role()%'
    OR COALESCE(with_check, '') ILIKE '%auth.role()%'
    OR policyname IN ('Auth All Access', 'Auth Upload Access', 'Auth Update Access', 'Auth Delete Access')
  );

-- Check 4: Confirm all 5 Storage buckets exist with exact file size caps and MIME allowlists (expect 5 rows)
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('cms-media', 'cms-documents', 'pdfs', 'galleries', 'faculty-profiles')
ORDER BY id;

-- Check 5: Confirm all 4 hardened storage.objects policies exist (expect 4 rows)
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE 'cms_storage_%'
ORDER BY policyname;

-- Check 6: Confirm all 8 hardened SECURITY DEFINER functions pin search_path = public (expect 8 rows)
SELECT
  p.proname AS function_name,
  p.prosecdef AS is_security_definer,
  p.proconfig AS function_settings
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prosecdef = true
ORDER BY p.proname;

-- Check 7: Confirm admin_users starts empty (fail-closed, 0 rows until manual SUPER_ADMIN bootstrap)
SELECT COUNT(*) AS admin_users_count FROM public.admin_users;

-- Check 8: Confirm pgvector extension is installed in the 'extensions' schema (expect 1 row, installed_schema = 'extensions')
SELECT
  e.extname AS extension_name,
  n.nspname AS installed_schema,
  e.extversion AS extension_version
FROM pg_extension e
JOIN pg_namespace n ON n.oid = e.extnamespace
WHERE e.extname = 'vector';

-- Check 9A: Check whether Supabase CLI migration history table exists yet (safe before or after CLI sync)
SELECT to_regclass('supabase_migrations.schema_migrations') IS NOT NULL AS migration_history_table_exists;

-- Check 9B: AFTER running official CLI 'supabase migration repair --status applied ...',
-- verify all 9 migration versions (20260525000000 .. 20261114000008) are recorded (expect 9 rows):
SELECT version, name
FROM supabase_migrations.schema_migrations
ORDER BY version;
*/
