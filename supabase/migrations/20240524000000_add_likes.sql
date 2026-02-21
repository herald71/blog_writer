-- Likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Likes are viewable by everyone." ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can toggle their own likes." ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own likes." ON public.likes
  FOR DELETE USING (auth.uid() = user_id);
