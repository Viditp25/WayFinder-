-- User Profiles & Authentication Integration
-- Links the raw auth.users table to our custom application state

-- 1. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    home_state TEXT,
    current_stage TEXT,
    saved_roadmaps JSONB DEFAULT '[]'::jsonb
);

-- 2. Set up RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING ( auth.uid() = id );

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING ( auth.uid() = id );

-- 3. Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to cleanly recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
