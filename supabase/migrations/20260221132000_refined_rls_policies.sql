-- Refine and re-enable RLS for tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Table Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Categories Table Policies
DROP POLICY IF EXISTS "Categories are viewable by everyone." ON public.categories;
CREATE POLICY "Categories are viewable by everyone." ON public.categories
    FOR SELECT USING (true);

-- 3. Posts Table Policies
DROP POLICY IF EXISTS "Published posts are viewable by everyone." ON public.posts;
CREATE POLICY "Published posts are viewable by everyone." ON public.posts
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Authors can view their own posts." ON public.posts;
CREATE POLICY "Authors can view their own posts." ON public.posts
    FOR SELECT USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can insert their own posts." ON public.posts;
CREATE POLICY "Authors can insert their own posts." ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update their own posts." ON public.posts;
CREATE POLICY "Authors can update their own posts." ON public.posts
    FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can delete their own posts." ON public.posts;
CREATE POLICY "Authors can delete their own posts." ON public.posts
    FOR DELETE USING (auth.uid() = author_id);
