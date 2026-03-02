-- Phase 7: Scholarships & Profile Updates

-- 1. Alter profiles table to add category and latest_score
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS latest_score JSONB DEFAULT '{}'::jsonb;
-- latest_score example: { "exam": "JEE Main", "score": "95 PR", "date": "2026-01-15" }

-- 2. Create the scholarships table
CREATE TABLE IF NOT EXISTS public.scholarships (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    description TEXT,
    eligibility_criteria TEXT,
    amount TEXT,
    deadline DATE,
    target_state TEXT, -- e.g., 'Maharashtra', 'All India'
    target_category TEXT, -- e.g., 'EWS', 'SC/ST', 'General', 'All'
    target_stream TEXT, -- e.g., 'STEM', 'Medical', 'Commerce'
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on scholarships
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access to scholarships
CREATE POLICY "Allow public read access to scholarships" 
    ON public.scholarships FOR SELECT 
    USING ( true );

-- 4. Seed initial scholarship data
INSERT INTO public.scholarships (name, provider, description, eligibility_criteria, amount, deadline, target_state, target_category, target_stream, url)
VALUES
    ('Prime Minister''s Scholarship Scheme (PMSS)', 'Government of India', 'Scholarship for dependent wards of Ex-Servicemen / Ex-Coast Guard personnel.', 'Must have scored 60% and above in Minimum Educational Qualification (MEQ).', '₹36,000 to ₹30,000 per year', '2026-10-31', 'All India', 'All', 'Professional Degree', 'https://www.desw.gov.in/scholarship'),
    ('Post Matric Scholarship for SC/ST', 'Ministry of Social Justice', 'Financial assistance to SC/ST students studying at post matriculation or post-secondary stage.', 'Family income below ₹2.5 Lakh per annum.', 'Varies (Tuition + Maintenance)', '2026-11-30', 'All India', 'SC/ST', 'All', 'https://scholarships.gov.in/'),
    ('Central Sector Scheme of Scholarships for College and University Students', 'Department of Higher Education', 'Financial assistance to meritorious students from low-income families.', 'Class 12th percentile > 80, Family income < ₹4.5 Lakh.', '₹12,000 (UG) to ₹20,000 (PG)', '2026-12-31', 'All India', 'General/OBC', 'All', 'https://scholarships.gov.in/'),
    ('Rajarshi Shahu Maharaj Merit Scholarship', 'Government of Maharashtra', 'Merit-based scholarship for SC students from Maharashtra securing 75% or more.', 'SC category, Maharashtra domiciled, 75%+ in 10th.', '₹300 per month for 2 years', '2026-09-30', 'Maharashtra', 'SC', 'All', 'https://mahadbt.maharashtra.gov.in/'),
    ('MahaDBT EBC Scholarship', 'Government of Maharashtra', 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)', 'Family income below ₹8 Lakhs, Maharashtra Domicile.', '50% of Tuition Fees', '2026-10-15', 'Maharashtra', 'EWS', 'All', 'https://mahadbt.maharashtra.gov.in/')
ON CONFLICT DO NOTHING;
