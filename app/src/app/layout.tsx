import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '할일 앱',
  description: 'GitHub OAuth 로그인이 연동된 개인 할일 관리 앱',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
