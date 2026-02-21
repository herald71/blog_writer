'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
    likes_count?: number;
    is_liked?: boolean;
}

export default function Discussion({ postId }: { postId: string }) {
    const supabase = createClient();
    const router = useRouter();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const fetchComments = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
        } else if (data) {
            const { data: { user } } = await supabase.auth.getUser();

            // Map comments with likes data
            const commentsWithLikes = await Promise.all(data.map(async (c: any) => {
                const { count } = await supabase
                    .from('comment_likes')
                    .select('*', { count: 'exact', head: true })
                    .eq('comment_id', c.id);

                let isLiked = false;
                if (user) {
                    const { data: myLike } = await supabase
                        .from('comment_likes')
                        .select('id')
                        .eq('comment_id', c.id)
                        .eq('user_id', user.id)
                        .maybeSingle();
                    isLiked = !!myLike;
                }

                return { ...c, likes_count: count || 0, is_liked: isLiked };
            }));

            setComments(commentsWithLikes);
        }
        setLoading(false);
    }, [postId, supabase]);

    useEffect(() => {
        fetchComments();

        // Get current user for comment input
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [fetchComments, supabase]);

    const handleSubmit = async (parentId: string | null = null) => {
        const content = parentId ? replyContent : comment;
        if (!content.trim()) return;

        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/auth/login');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    user_id: user.id,
                    content: content.trim(),
                    parent_id: parentId,
                });

            if (error) throw error;

            if (parentId) {
                setReplyContent('');
                setReplyTo(null);
            } else {
                setComment('');
            }
            fetchComments();
        } catch (error: any) {
            console.error('Error posting comment:', error);
            alert('댓글 저장 중 오류가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCommentLikeToggle = async (commentId: string, currentlyLiked: boolean) => {
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/auth/login');
            return;
        }

        try {
            if (currentlyLiked) {
                await supabase
                    .from('comment_likes')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', user.id);
            } else {
                await supabase
                    .from('comment_likes')
                    .insert({
                        comment_id: commentId,
                        user_id: user.id
                    });
            }
            fetchComments();
        } catch (error) {
            console.error('Error toggling comment like:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId)
                .eq('user_id', user.id);

            if (error) throw error;
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <section className="mt-24 border-t border-zinc-200 pt-16 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-12">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Discussion</h2>
                <span className="text-zinc-500 dark:text-zinc-400">({comments.length})</span>
            </div>

            {/* Comment Input */}
            <div className="mb-16 flex gap-4">
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <Image
                        src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email || 'User'}`}
                        alt="Current User"
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </div>
                <div className="flex-1">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={user ? "What are your thoughts?" : "Please sign in to join the discussion"}
                        disabled={!user || submitting}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 text-sm text-zinc-900 outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 dark:focus:border-blue-400 dark:focus:bg-zinc-900 disabled:opacity-50"
                        rows={3}
                    />
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={() => handleSubmit()}
                            disabled={!user || submitting || !comment.trim()}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:translate-y-0.5 disabled:opacity-50"
                        >
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="space-y-12">
                    {comments.filter(c => !(c as any).parent_id).map((c) => (
                        <div key={c.id} className="space-y-8">
                            {/* Main Comment */}
                            <CommentItem
                                comment={c}
                                formatDate={formatDate}
                                user={user}
                                replyTo={replyTo}
                                setReplyTo={setReplyTo}
                                replyContent={replyContent}
                                setReplyContent={setReplyContent}
                                onReplySubmit={() => handleSubmit(c.id)}
                                onLikeToggle={() => handleCommentLikeToggle(c.id, !!c.is_liked)}
                                onDelete={() => handleDeleteComment(c.id)}
                                submitting={submitting}
                            />

                            {/* Replies */}
                            <div className="ml-14 space-y-8 border-l-2 border-zinc-100 pl-8 dark:border-zinc-800">
                                {comments.filter(reply => (reply as any).parent_id === c.id)
                                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // Replies old to new
                                    .map(reply => (
                                        <CommentItem
                                            key={reply.id}
                                            comment={reply}
                                            formatDate={formatDate}
                                            user={user}
                                            isReply
                                            onLikeToggle={() => handleCommentLikeToggle(reply.id, !!reply.is_liked)}
                                            onDelete={() => handleDeleteComment(reply.id)}
                                        />
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 text-sm">
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

function CommentItem({
    comment,
    formatDate,
    user,
    isReply = false,
    replyTo,
    setReplyTo,
    replyContent,
    setReplyContent,
    onReplySubmit,
    onLikeToggle,
    onDelete,
    submitting
}: any) {
    const isLiked = comment.is_liked;
    const likesCount = comment.likes_count || 0;
    const isOwner = user && user.id === comment.user_id;

    return (
        <div className="flex gap-4">
            <div className={`${isReply ? 'h-8 w-8' : 'h-10 w-10'} flex-shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs flex items-center justify-center`}>
                <Image
                    src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles?.full_name || 'Anonymous'}`}
                    alt={comment.profiles?.full_name || 'Author'}
                    width={isReply ? 32 : 40}
                    height={isReply ? 32 : 40}
                    className="object-cover"
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`${isReply ? 'text-xs' : 'text-sm'} font-bold text-zinc-900 dark:text-zinc-50`}>
                        {comment.profiles?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">• {formatDate(comment.created_at)}</span>
                </div>
                <p className={`${isReply ? 'text-xs' : 'text-sm'} leading-relaxed text-zinc-600 dark:text-zinc-400`}>
                    {comment.content}
                </p>
                <div className="mt-3 flex items-center gap-4">
                    <button
                        onClick={onLikeToggle}
                        className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${isLiked
                            ? 'text-rose-500'
                            : 'text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400'
                            }`}
                    >
                        <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
                        {likesCount}
                    </button>
                    {!isReply && (
                        <button
                            onClick={() => setReplyTo?.(replyTo === comment.id ? null : comment.id)}
                            className="text-[10px] font-medium text-zinc-500 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                        >
                            Reply
                        </button>
                    )}
                    {isOwner && (
                        <button
                            onClick={onDelete}
                            className="text-[10px] font-medium text-zinc-500 transition-colors hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
                        >
                            Delete
                        </button>
                    )}
                </div>

                {/* Reply Input */}
                {replyTo === comment.id && (
                    <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <Image
                                src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.email || 'User'}`}
                                alt="User"
                                width={32}
                                height={32}
                            />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 text-xs text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50"
                                rows={2}
                            />
                            <div className="mt-2 flex justify-end gap-2">
                                <button
                                    onClick={() => setReplyTo(null)}
                                    className="px-3 py-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onReplySubmit}
                                    disabled={submitting || !replyContent.trim()}
                                    className="rounded-md bg-blue-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Post Reply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
