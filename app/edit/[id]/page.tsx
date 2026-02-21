import BlogEditor from '@/components/BlogEditor';
import { useParams } from 'next/navigation';

export default function EditPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black pt-16">
            <BlogEditor postId={id} />
        </main>
    );
}
