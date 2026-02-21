'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, Send, Save, Eye, Edit3 } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function BlogEditor({ postId }: { postId?: string }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        category_id: '',
        cover_image: '',
        published_at: null as string | null,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*').order('name');
            if (data) setCategories(data);
        };

        const fetchPost = async () => {
            if (!postId) return;
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (data) {
                setFormData({
                    title: data.title,
                    summary: data.summary,
                    content: data.content,
                    category_id: data.category_id || '',
                    cover_image: data.cover_image || '',
                    published_at: data.published_at,
                });
            }
        };

        fetchCategories();
        fetchPost();
    }, [supabase, postId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `post-covers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('blog-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('blog-assets')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, cover_image: publicUrl }));
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('이미지 업로드 중 오류가 발생했습니다: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (status: 'draft' | 'published') => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('로그인이 필요합니다.');
                router.push('/auth/login');
                return;
            }

            // Ensure profile exists before posting (Prevents posts_author_id_fkey error)
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            if (!profile) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                        avatar_url: user.user_metadata?.avatar_url || null,
                    });

                if (profileError) {
                    console.error('Error creating profile:', profileError);
                    // RLS may block this if not set up correctly, but we try anyway.
                }
            }

            const postData: any = {
                ...formData,
                author_id: user.id,
                status,
                published_at: status === 'published' ? (formData.published_at || new Date().toISOString()) : null,
                reading_time_minutes: Math.ceil(formData.content.split(/\s+/).length / 200),
            };

            const { error } = postId
                ? await supabase.from('posts').update(postData).eq('id', postId)
                : await supabase.from('posts').insert(postData);

            if (error) throw error;

            alert(postId ? '수정되었습니다!' : (status === 'published' ? '게시되었습니다!' : '임시 저장되었습니다.'));
            router.push('/');
            router.refresh();
        } catch (error: any) {
            console.error('Error saving post:', error);
            alert('저장 중 오류가 발생했습니다: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {postId ? '글 수정하기' : '새 글 작성'}
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPreview(!preview)}
                        className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    >
                        {preview ? <Edit3 size={18} /> : <Eye size={18} />}
                        {preview ? '편집하기' : '미리보기'}
                    </button>
                    <button
                        onClick={() => handleSubmit('draft')}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        임시 저장
                    </button>
                    <button
                        onClick={() => handleSubmit('published')}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        게시하기
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">제목</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="제목을 입력하세요"
                            className="w-full rounded-lg border border-zinc-200 bg-white p-3 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">카테고리</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-zinc-200 bg-white p-3 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <option value="">카테고리 선택</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">요약 (Summary)</label>
                    <input
                        type="text"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="글의 간단한 요약을 입력하세요"
                        className="w-full rounded-lg border border-zinc-200 bg-white p-3 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium">커버 이미지</label>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="cover_image"
                            value={formData.cover_image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-lg border border-zinc-200 bg-white p-3 focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                        />
                        <div className="flex items-center gap-4">
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                이미지 파일 선택
                            </label>
                            {formData.cover_image && (
                                <span className="text-xs text-zinc-500">이미지가 설정되었습니다.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">내용 (Markdown)</label>
                    {preview ? (
                        <div className="prose prose-zinc dark:prose-invert min-h-[400px] w-full max-w-none rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <ReactMarkdown>{formData.content || '*내용이 없습니다.*'}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="마크다운으로 내용을 작성하세요..."
                            rows={15}
                            className="w-full rounded-lg border border-zinc-200 bg-white p-4 font-mono text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
