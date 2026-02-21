# DevLog - 현대적인 기술 블로그 플랫폼 🚀

이 프로젝트는 [Next.js](https://nextjs.org)를 기반으로 구축된 강력하고 세련된 기술 블로그 플랫폼입니다. 개발자가 글을 쓰고 독자와 소통할 수 있는 최적의 환경을 제공합니다.

## 🌟 주요 기능

-   **현대적인 UI/UX**: 다크 모드 지원 및 반응형 레이아웃으로 모든 기기에서 아름답게 보입니다.
-   **마크다운 에디터**: 개발자에게 친숙한 마크다운 방식으로 글을 작성하고 이미지 업로드를 지원합니다.
-   **계층형 댓글 시스템**: 답글(대댓글) 기능을 통해 깊이 있는 토론이 가능합니다.
-   **좋아요 & 소셜기능**: 포스트와 댓글에 좋아요를 누르고 소셜 미디어로 간편하게 공유할 수 있습니다.
-   **보안 및 인증**: Supabase Auth와 Middleware를 사용한 안전한 경로 보호 및 사용자 관리.
-   **검색 및 필터링**: 카테고리별 필터링과 전체 텍스트 검색 기능을 제공합니다.

## 🚀 시작하기

먼저, 로컬 환경에서 개발 서버를 실행하세요:

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

## ⚙️ 데이터베이스 설정

이 프로젝트는 Supabase를 사용합니다. 데이터베이스를 설정하려면 다음 단계를 따르세요:

1.  Supabase 대시보드에서 프로젝트를 생성합니다.
2.  `.env.local` 파일에 Supabase URL과 Anon Key를 설정합니다.
3.  `supabase/final_setup_all.sql` 파일의 내용을 SQL Editor에서 실행하여 모든 테이블과 정책을 생성합니다.

## 🛠 사용된 기술

-   **Framework**: Next.js 15+ (App Router)
-   **Styling**: Tailwind CSS
-   **Backend/DB**: Supabase (PostgreSQL)
-   **Icons**: Lucide React
-   **Fonts**: Next/font (Geist)

## 더 알아보기

Next.js에 대해 더 자세히 알아보려면 다음 리소스를 참조하세요:

-   [Next.js 공식 문서](https://nextjs.org/docs)
-   [Next.js 학습 가이드](https://nextjs.org/learn)

문의사항이나 피드백은 언제든 환영합니다! 😊
