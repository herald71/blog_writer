'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ShareButtons from '@/components/ShareButtons';
import Discussion from '@/components/Discussion';
import { ChevronLeft, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function PostPage() {
    const params = useParams();
    const id = params.id as string;
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);

    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
        };
        getUser();
    }, [supabase]);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('posts')
                .select(`
                    *,
                    categories(name, slug),
                    profiles(id, full_name, avatar_url)
                `)
                .eq('id', id)
                .single();

            if (fetchError || !data) {
                setError(true);
            } else {
                setPost(data);
                // Fetch stats
                fetchStats(data.id);
            }
            setLoading(false);
        };

        if (id) {
            fetchPost();
        }
    }, [id, supabase]);

    const fetchStats = async (postId: string) => {
        // Get likes count
        const { count: likes } = await supabase
            .from('likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);
        setLikesCount(likes || 0);

        // Check if current user liked
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: myLike } = await supabase
                .from('likes')
                .select('id')
                .eq('post_id', postId)
                .eq('user_id', user.id)
                .maybeSingle();
            setIsLiked(!!myLike);
        }

        // Get comments count
        const { count: comments } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId);
        setCommentsCount(comments || 0);
    };

    const handleLikeToggle = async () => {
        if (!currentUser) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (isLiked) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('post_id', post.id)
                .eq('user_id', currentUser.id);

            if (!error) {
                setIsLiked(false);
                setLikesCount(prev => prev - 1);
            }
        } else {
            const { error } = await supabase
                .from('likes')
                .insert({
                    post_id: post.id,
                    user_id: currentUser.id
                });

            if (!error) {
                setIsLiked(true);
                setLikesCount(prev => prev + 1);
            }
        }
    };

    const scrollToComments = () => {
        const element = document.getElementById('discussion-section');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    if (error || !post) {
        notFound();
    }

    const isAuthor = currentUser && post && (currentUser.id === post.author_id);

    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Oct 24, 2023';

    return (
        <main className="min-h-screen pb-24 pt-12">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/"
                    className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Feed
                </Link>

                {/* header */}
                <header className="mb-12">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.categories && (
                            <span className="rounded-lg bg-blue-600/10 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                                #{post.categories.name}
                            </span>
                        )}
                    </div>

                    <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
                        {post.title}
                    </h1>

                    <p className="mb-12 text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {post.summary}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-6 border-y border-zinc-100 py-8 dark:border-zinc-800">
                        <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <Image
                                    src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.full_name || 'User'}`}
                                    alt={post.profiles?.full_name || 'Author'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-zinc-900 dark:text-zinc-50">
                                        {post.profiles?.full_name || 'Anonymous'}
                                    </span>
                                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                        Follow
                                    </button>
                                </div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {publishedDate} • {post.reading_time_minutes || 5} min read
                                </div>
                            </div>
                        </div>

                        <ShareButtons />

                        {currentUser && currentUser.id === post.author_id && (
                            <Link
                                href={`/edit/${post.id}`}
                                className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                <Edit3 className="h-4 w-4" />
                                Edit Post
                            </Link>
                        )}
                    </div>
                </header>

                {/* Thumbnail */}
                <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
                    <Image
                        src={post.cover_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* content */}
                <article className="prose prose-zinc dark:prose-invert max-w-none">
                    <div className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {post.content ? (
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        ) : (
                            <p className="italic text-zinc-500">No content available.</p>
                        )}
                    </div>
                </article>

                {/* Footer Actions (Like/Comment Count) */}
                <div className="mt-16 flex items-center gap-6 border-y border-zinc-100 py-6 dark:border-zinc-800">
                    <button
                        onClick={handleLikeToggle}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${isLiked
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                            : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800'
                            }`}
                    >
                        <span className={isLiked ? 'text-rose-500' : 'text-zinc-400'}>❤️</span>
                        {likesCount.toLocaleString()}
                    </button>
                    <button
                        onClick={scrollToComments}
                        className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                        💬 {commentsCount} Comments
                    </button>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-500">SHARE</span>
                        <ShareButtons />
                    </div>
                </div>

                {/* Discussion Section */}
                <div id="discussion-section">
                    <Discussion postId={id} />
                </div>
            </div>
        </main>
    );
}
