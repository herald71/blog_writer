import Link from 'next/link';
import { Github, Twitter, Rss } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        © {new Date().getFullYear()} DevLog Inc. All rights reserved. Built for developers, by developers.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="https://github.com" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link href="https://twitter.com" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                            <Rss className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
