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
