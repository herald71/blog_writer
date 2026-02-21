import BlogEditor from '@/components/BlogEditor';

export const metadata = {
    title: '새 글 작성 | DevLog',
    description: 'DevLog에 새로운 글을 작성하세요.',
};

export default function WritePage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black pt-16">
            <BlogEditor />
        </main>
    );
}
