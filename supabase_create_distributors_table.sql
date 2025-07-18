-- Create the distributors table
CREATE TABLE public.distributors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  logo_url text
);

-- Enable Row Level Security (RLS) on the distributors table
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (anyone can view distributors)
CREATE POLICY "Enable read access for all users" ON public.distributors
FOR SELECT USING (true);

-- Policy for authenticated users to insert distributors (admin)
CREATE POLICY "Enable insert for authenticated users" ON public.distributors
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update distributors (admin)
CREATE POLICY "Enable update for authenticated users" ON public.distributors
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete distributors (admin)
CREATE POLICY "Enable delete for authenticated users" ON public.distributors
FOR DELETE USING (auth.role() = 'authenticated');

-- Create a storage bucket for distributor logos (if not already created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('distributor-logos', 'distributor-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for the storage bucket (allowing authenticated users to upload/delete, and everyone to view)
CREATE POLICY "Allow authenticated users to upload distributor logos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'distributor-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update distributor logos" ON storage.objects
FOR UPDATE USING (bucket_id = 'distributor-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete distributor logos" ON storage.objects
FOR DELETE USING (bucket_id = 'distributor-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read access for distributor logos" ON storage.objects
FOR SELECT USING (bucket_id = 'distributor-logos');