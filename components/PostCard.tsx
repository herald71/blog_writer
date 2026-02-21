import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
    post: {
        id: string;
        title: string;
        summary: string;
        cover_image: string | null;
        reading_time_minutes: number | null;
        published_at: string | null;
        categories: {
            name: string;
            slug: string;
        } | null;
        profiles: {
            full_name: string | null;
            avatar_url: string | null;
        } | null;
    };
}

export default function PostCard({ post }: PostCardProps) {
    const publishedDate = post.published_at
        ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Oct 24, 2023'; // Fallback for demo

    return (
        <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={post.cover_image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {post.categories && (
                    <div className="absolute bottom-4 left-4">
                        <span className="rounded-lg bg-blue-600/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                            {post.categories.name}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        • {post.reading_time_minutes || 5} min read
                    </span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    <Link href={`/posts/${post.id}`}>
                        {post.title}
                    </Link>
                </h3>

                <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {post.summary}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <Image
                                src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.full_name || 'User'}`}
                                alt={post.profiles?.full_name || 'Author'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
                                {post.profiles?.full_name || 'Alex Johnson'}
                            </span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                {publishedDate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
