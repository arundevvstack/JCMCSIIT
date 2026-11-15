-- ============================================================================
-- Migration: 20261114000005_cms_rbac_and_audit_foundation.sql
-- Phase 1 (Part 1/4): Administrator RBAC Allowlist, Immutable Audit Logging,
-- Shared Trigger Utilities & Immediate Removal of Legacy Unsafe RLS Policies
-- ============================================================================

BEGIN;

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

COMMIT;
