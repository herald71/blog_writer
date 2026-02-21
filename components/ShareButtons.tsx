'use client';

import { useState } from 'react';
import { Share2, Twitter, Github, Link2, Check } from 'lucide-react';

export default function ShareButtons() {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">SHARE</span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:text-blue-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                    title="Share on Twitter"
                >
                    <Twitter className="h-5 w-5" />
                </button>
                <button
                    onClick={() => window.open(`https://github.com/`, '_blank')}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    title="Share on GitHub"
                >
                    <Github className="h-5 w-5" />
                </button>
                <button
                    onClick={handleCopyLink}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    title="Copy Link"
                >
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Link2 className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
}
