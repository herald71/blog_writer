'use client';

import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Newsletter subscription logic would go here
        alert(`Subscribed with: ${email}`);
        setEmail('');
    };

    return (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-24">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 py-16 px-6 sm:px-24">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-6">
                        Subscribe to our newsletter
                    </h2>
                    <p className="text-lg leading-8 text-zinc-400 mb-10 max-w-2xl">
                        Get the latest articles, tutorials, and developer insights delivered
                        straight to your inbox weekly. No spam, ever.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
            </div>
        </section>
    );
}
