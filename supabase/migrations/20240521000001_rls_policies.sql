-- Profiles: Everyone can view, but only the owner can update
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories: Everyone can view
CREATE POLICY "Categories are viewable by everyone." ON public.categories
  FOR SELECT USING (true);

-- Posts: Everyone can view published posts, only authors can manage their own posts
CREATE POLICY "Published posts are viewable by everyone." ON public.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their own posts." ON public.posts
  FOR ALL USING (auth.uid() = author_id);
