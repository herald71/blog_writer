'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Hero from '@/components/Hero';
import CategoryFilter from '@/components/CategoryFilter';
import PostCard from '@/components/PostCard';
import Newsletter from '@/components/Newsletter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const POSTS_PER_PAGE = 6;

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');
  const categoryParam = searchParams.get('category');

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      let query = supabase
        .from('posts')
        .select(`
          *,
          categories!inner(name, slug),
          profiles(full_name, avatar_url)
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (selectedCategory) {
        query = query.eq('categories.slug', selectedCategory);
      }

      if (queryParam) {
        query = query.or(`title.ilike.%${queryParam}%,content.ilike.%${queryParam}%`);
      }

      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data, count, error } = await query.range(from, to);

      if (data && data.length > 0) {
        setPosts(data);
        setTotalCount(count || 0);
      } else {
        // Fallback to mock data if database is empty
        const mockPosts = [
          {
            id: '1',
            title: 'Understanding React Server Components',
            summary: 'A deep dive into how RSCs change the way we build hydration-heavy applications and improve initial load performance.',
            cover_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
            reading_time_minutes: 5,
            published_at: new Date().toISOString(),
            categories: { name: 'React', slug: 'react' },
            profiles: { full_name: 'Alex Johnson', avatar_url: null }
          },
          {
            id: '2',
            title: 'A Guide to Dockerizing Node Apps',
            summary: 'Step-by-step tutorial on creating efficient, multi-stage Docker builds for your production Node.js services.',
            cover_image: 'https://images.unsplash.com/photo-1605745341112-85968b193ef5',
            reading_time_minutes: 8,
            published_at: new Date().toISOString(),
            categories: { name: 'DevOps', slug: 'devops' },
            profiles: { full_name: 'Sarah Wilson', avatar_url: null }
          },
          {
            id: '3',
            title: 'Why I Switched to Vim for Production',
            summary: 'Is the learning curve worth it? A pragmatic look at how modal editing impacts real-world coding speed and RSI.',
            cover_image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
            reading_time_minutes: 6,
            published_at: new Date().toISOString(),
            categories: { name: 'Productivity', slug: 'productivity' },
            profiles: { full_name: 'Emily Chen', avatar_url: null }
          }
        ];
        setPosts(mockPosts);
        setTotalCount(mockPosts.length);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [supabase, selectedCategory, currentPage, queryParam]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              {posts.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <p className="text-zinc-500 dark:text-zinc-400">No posts found.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-24">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Newsletter />
    </div>
  );
}
