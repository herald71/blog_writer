'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input, Button } from '@/components/ui/auth-elements';

export default function SignupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(searchParams.get('error') || '');

    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signupError) {
            setError(signupError.message);
            setLoading(false);
            return;
        }

        router.push('/auth/login?message=회원가입을 완료하려면 이메일을 확인해 주세요.');
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-2 text-center">
                <h2 className="text-2xl font-bold text-white tracking-tight">계정 생성하기</h2>
                <p className="text-sm text-gray-400 leading-relaxed">오늘부터 글쓰기 여정을 시작해 보세요.</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col space-y-4">
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
                    <label className="text-sm font-medium text-gray-300" htmlFor="password">
                        비밀번호
                    </label>
                    <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? '가입 중...' : '회원가입'}
                </Button>

                {error && (
                    <p className="mt-4 p-4 bg-red-500/10 text-red-400 text-center text-sm rounded-xl border border-red-500/20">
                        {error}
                    </p>
                )}
            </form>

            <div className="text-center text-sm text-gray-400">
                이미 계정이 있으신가요?{' '}
                <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
                    로그인
                </Link>
            </div>
        </div>
    )
}
