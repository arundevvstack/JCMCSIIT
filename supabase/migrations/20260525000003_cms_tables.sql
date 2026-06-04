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
