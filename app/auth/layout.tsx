import { Suspense } from 'react'

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1440px] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-[420px] transition-all duration-500 ease-in-out relative z-10">
                <div className="bg-[#1E293B]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col space-y-3 text-center mb-10">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(37,99,235,0.4)] transform hover:scale-110 transition-transform duration-300 rotate-3">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-10 h-10 text-white -rotate-3"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                            DevBlog
                        </h1>
                    </div>

                    <Suspense fallback={<div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                        {children}
                    </Suspense>

                    <div className="mt-12 flex justify-center space-x-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        <a href="#" className="hover:text-blue-400 transition-colors duration-300">이용약관</a>
                        <a href="#" className="hover:text-blue-400 transition-colors duration-300">개인정보</a>
                        <a href="#" className="hover:text-blue-400 transition-colors duration-300">문서</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
