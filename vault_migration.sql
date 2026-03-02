-- Create a private storage bucket named 'student_vault'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student_vault', 'student_vault', false)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) on the bucket
-- Note: Storage policies attach to the storage.objects table

-- 1. Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload their own documents" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
    bucket_id = 'student_vault' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Allow users to view/download their own documents
CREATE POLICY "Users can view their own documents" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
    bucket_id = 'student_vault' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
    bucket_id = 'student_vault' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);
