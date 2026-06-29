-- Phase 4: Faculty Profile Fields
-- Add dynamic profile fields and routing slug to the faculty table

ALTER TABLE faculty
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS cv_url TEXT,
ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb;

-- Optional: Create index on JSONB for searching (GIN index)
CREATE INDEX IF NOT EXISTS idx_faculty_profile_data ON faculty USING GIN (profile_data);
