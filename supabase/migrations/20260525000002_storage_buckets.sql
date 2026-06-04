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
