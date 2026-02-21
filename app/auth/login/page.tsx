'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input, Button } from '@/components/ui/auth-elements';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(searchParams.get('error') || '');
    const [message, setMessage] = useState(searchParams.get('message') || '');

    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
            return;
        }

        router.push('/');
        router.refresh();
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">다시 만나서 반가워요</h2>
                <p className="text-sm text-gray-400 leading-relaxed">당신의 멋진 아이디어를 기록해 보세요.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300" htmlFor="email">
                        이메일 주소
                    </label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300" htmlFor="password">
                            비밀번호
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            비밀번호를 잊으셨나요?
                        </Link>
                    </div>
                    <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </Button>

                {message && (
                    <p className="mt-4 p-4 bg-blue-500/10 text-blue-400 text-center text-sm rounded-xl border border-blue-500/20">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="mt-4 p-4 bg-red-500/10 text-red-400 text-center text-sm rounded-xl border border-red-500/20">
                        {error}
                    </p>
                )}
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#1E293B] px-2 text-gray-400 font-medium tracking-wider">또는 다른 방법으로 계속하기</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" disabled>
                    <span className="mr-2">G</span> Google
                </Button>
                <Button variant="outline" type="button" disabled>
                    <span className="mr-2">🐙</span> GitHub
                </Button>
            </div>

            <div className="text-center text-sm text-gray-400">
                계정이 없으신가요?{' '}
                <Link href="/auth/signup" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
                    회원가입
                </Link>
            </div>
        </div>
    )
}
