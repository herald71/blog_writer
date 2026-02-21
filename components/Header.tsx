'use client';

import Link from 'next/link';
import { Search, Edit3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
            params.set('q', searchQuery);
        } else {
            params.delete('q');
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                            D
                        </div>
                        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">DevLog</span>
                    </Link>

                    <div className="hidden md:block">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-zinc-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-80 rounded-full border-zinc-200 bg-zinc-100 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:focus:bg-zinc-900"
                            />
                        </form>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/write"
                                className="flex items-center gap-2 rounded-full border border-blue-600 px-4 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30"
                            >
                                <Edit3 className="h-4 w-4" />
                                <span>Write</span>
                            </Link>
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.email}</span>
                            <button
                                onClick={() => supabase.auth.signOut()}
                                className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
