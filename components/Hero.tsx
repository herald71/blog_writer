import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-zinc-900 py-16 sm:py-24 rounded-3xl mx-auto max-w-7xl my-8">
            <div className="px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <span className="inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-600/20 mb-6">
                            Featured Update
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
                            The Future of <span className="text-blue-500">Web Development</span>
                        </h1>
                        <p className="text-lg leading-8 text-zinc-400 mb-10 max-w-2xl">
                            Explore deep dives into modern architecture, server-side rendering patterns,
                            and the evolving landscape of frontend frameworks.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <button className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors">
                                Start Reading
                            </button>
                            <button className="rounded-xl bg-zinc-800 px-6 py-3 text-base font-semibold text-white hover:bg-zinc-700 transition-colors border border-zinc-700">
                                Browse Topics
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative w-full h-[400px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl" />
                        <div className="relative h-full w-full rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                                alt="Web Development Illustration"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
