import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // sesson 토큰 업데이트
    const { data: { user } } = await supabase.auth.getUser()

    // 경로 보호 로직 추가
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/write') ||
        request.nextUrl.pathname.startsWith('/edit')

    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        url.searchParams.set('error', '로그인이 필요한 페이지입니다.')
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
