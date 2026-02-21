-- Insert Categories
INSERT INTO public.categories (name, slug)
VALUES 
  ('React', 'react'),
  ('DevOps', 'devops'),
  ('Productivity', 'productivity'),
  ('System Design', 'system-design'),
  ('WASM', 'wasm'),
  ('Best Practices', 'best-practices'),
  ('Career Growth', 'career-growth')
ON CONFLICT (slug) DO NOTHING;

-- Note: We need a profile to associate posts with. 
-- Since we don't have auth users yet, we'll skip inserting posts here 
-- or provide a placeholder for the user to update.
-- In a real scenario, the user would run this after creating their first user.

-- For demonstration purposes, we'll use a transaction to insert a dummy profile if none exists,
-- but that requires an auth.user which we can't easily fake without the CLI/Admin.
-- So we'll provide the post insertion as a separate block that the user can run.

/*
-- Example Post Insertion (to be run after creating a user)
INSERT INTO public.posts (title, summary, content, cover_image, reading_time_minutes, category_id, status)
SELECT 
  'Understanding React Server Components', 
  'A deep dive into how RSCs change the way we build hydration-heavy applications and improve initial load performance.',
  'Content goes here...',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
  5,
  (SELECT id FROM public.categories WHERE slug = 'react'),
  'published'
LIMIT 1;
*/
