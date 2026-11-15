# JCMCSIIT CMS — Phase 1 Deployment, Migration History, Rollback & Bootstrap Guide

> **Important:** Rollback `.down.sql` files are stored in `supabase/rollbacks/` (outside `supabase/migrations/`) so `supabase db push` never executes them during forward migrations.

---

## 1. Official Migration History Procedure (Dashboard SQL Editor + Supabase CLI)

### Strict Migration History Rules
- **Do NOT** manually `INSERT` rows into `supabase_migrations.schema_migrations` in any SQL script.
- **Do NOT** manually `DELETE` migration history rows from `supabase_migrations.schema_migrations` in any rollback SQL script.
- Always manage migration history exclusively through the official Supabase CLI `supabase migration repair` subcommand.

### A. Recording Applied History After Successful SQL Editor Execution
Executing `supabase/sql-editor/JCMCSIIT_PHASE1_CONSOLIDATED_00000_TO_00008.sql` in the Supabase Dashboard SQL Editor applies all nine migrations (`00000`–`00008`) in one atomic transaction, but does not automatically write CLI migration history.

After the SQL Editor script succeeds and passes all read-only verification queries, record the nine applied versions from an environment where Supabase CLI is permitted (e.g., CI/CD, WSL, Cloud Shell, or an approved workstation):

```bash
npx supabase login
npx supabase link --project-ref etoiwczwtlsusskzmcdr

npx supabase migration repair --status applied \
  20260525000000 \
  20260525000001 \
  20260525000002 \
  20260525000003 \
  20260525000004 \
  20261114000005 \
  20261114000006 \
  20261114000007 \
  20261114000008
```

### B. Post-Deployment Migration History Verification
Run both CLI checks and the read-only SQL check to confirm future `supabase db push` runs will never attempt to reapply `00000`–`00008`:

1. **CLI Verification:**
   ```bash
   npx supabase migration list
   npx supabase db push --dry-run
   ```
   - `migration list` must show all nine versions (`20260525000000` through `20261114000008`) aligned in both **Local** and **Remote** columns.
   - `db push --dry-run` must report `Remote database is up to date.`

2. **SQL Editor Read-Only Verification:**
   ```sql
   -- Safe catalog existence check (works both before and after CLI repair):
   SELECT to_regclass('supabase_migrations.schema_migrations') IS NOT NULL AS migration_history_table_exists;

   -- Run AFTER `supabase migration repair --status applied ...` (expect 9 rows):
   SELECT version, name
   FROM supabase_migrations.schema_migrations
   ORDER BY version;
   ```

---

## 2. Reverse Execution Order (If Rollback Is Ever Needed)

Always export `public.audit_logs`, `public.admin_users`, and CMS content tables before running a rollback, and execute strictly in reverse dependency order:

1. `supabase/rollbacks/20261114000008_cms_rls_and_storage_policies.down.sql`
2. `supabase/rollbacks/20261114000007_cms_create_remaining_entities.down.sql`
3. `supabase/rollbacks/20261114000006_cms_extend_existing_tables.down.sql`
4. `supabase/rollbacks/20261114000005_cms_rbac_and_audit_foundation.down.sql`

### Recording Reverted History (ONLY After an Actual Successful Rollback)
Rollback `.down.sql` scripts never touch `supabase_migrations.schema_migrations`. **Only after** the corresponding `.down.sql` script(s) have actually succeeded against the database, update CLI history with `--status reverted` for the exact rolled-back version(s):

```bash
# Example if all four Phase 1 CMS migrations (00008 -> 00005) were rolled back:
npx supabase migration repair --status reverted \
  20261114000008 \
  20261114000007 \
  20261114000006 \
  20261114000005

npx supabase migration list
```
*(If only a subset was rolled back — e.g. `20261114000008` alone — pass only that version ID.)*

---

## 3. Documented Rollback Limitations

1. **Rollback Scope Covers `00008` → `00005` Only (Hardened Post-`00004` Baseline):**
   - The four `.down.sql` scripts revert Phase 1 CMS additions (`20261114000008` down to `20261114000005`) and return the schema to the post-`00004` table structure; they do **not** drop the original `00000`–`00004` tables.
   - **Security Fail-Safe:** `00005.down.sql` intentionally **never** restores the unsafe legacy `USING (auth.role() = 'authenticated')` `"Auth All Access"` policies or the `pages` `USING (true)` draft-leak policy from `00001`–`00003`. Even in a rolled-back state, writes fail closed and unpublished pages remain hidden.

2. **Hosted Supabase Storage Buckets & Objects Cannot Be Deleted via Raw SQL (`storage.protect_delete`):**
   - Hosted Supabase enforces trigger `storage.protect_delete`, which blocks direct SQL `DELETE FROM storage.buckets` and `DELETE FROM storage.objects`.
   - Accordingly, `00008.down.sql` drops the `cms_storage_*` RLS policies and sets `public = false` on `cms-media` and `cms-documents`, leaving existing buckets and uploaded files intact. To permanently delete objects or buckets after rollback, use **Supabase Dashboard -> Storage** or the Supabase Storage API.

3. **Destructive Data Loss & Preserved Foreign-Key Safety (`ON DELETE RESTRICT`):**
   - Running `00007.down.sql`, `00006.down.sql`, and `00005.down.sql` permanently drops the 11 new CMS tables (`media`, `page_sections`, `courses`, `news`, `events`, `notices`, `popups`, `gallery_items`, `navigation_items`, `site_settings`, `content_revisions`), the extended CMS workflow columns on legacy tables, `public.admin_users`, and `public.audit_logs`. Manual JSON/CSV/SQL exports must be taken before rolling back.
   - In addition, `00006.down.sql` intentionally retains `ON DELETE RESTRICT` on `faculty.department_id`, `research_projects.department_id`, and `laboratories.department_id` rather than reverting to the original unsafe `ON DELETE CASCADE` behavior.

---

## 4. Secure Manual Bootstrap for First `SUPER_ADMIN` (After Forward Deployment)

Self-registration in `auth.users` grants **zero** CMS privileges. After forward migrations `00000`–`00008` are deployed:

1. Confirm in **Supabase Dashboard -> Authentication -> Providers -> Email** that **"Allow new users to sign up"** is disabled (`enable_signup = false`).
2. In **Supabase Dashboard -> Authentication -> Users**, click **"Add user" -> "Create new user"** (or **"Invite user"**) using the official administrator email, and copy the generated User `UUID`.
3. In **Supabase Dashboard -> SQL Editor** (runs as `postgres`), insert the single allowlisted `SUPER_ADMIN` row:

```sql
INSERT INTO public.admin_users (id, email, full_name, role, is_active)
VALUES (
  '<AUTH_USER_UUID>',
  '<OFFICIAL_ADMIN_EMAIL>',
  'JCMCSIIT Super Administrator',
  'SUPER_ADMIN',
  true
);
```
