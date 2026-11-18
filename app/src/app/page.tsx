import { getSession } from '@/lib/session'

export default async function Home() {
  const session = await getSession()

  if (!session.userId) {
    return (
      <main style={{ maxWidth: 480, margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
        <h1>할일 앱</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>GitHub 계정으로 로그인하여 시작하세요.</p>
        <a
          href="/auth/github"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#24292e',
            color: '#fff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          GitHub로 로그인
        </a>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        {session.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.avatarUrl} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
        )}
        <div>
          <div style={{ fontWeight: 700 }}>{session.username}</div>
          <div style={{ fontSize: 13, color: '#666' }}>로그인됨</div>
        </div>
        <form action="/api/auth/logout" method="post" style={{ marginLeft: 'auto' }}>
          <button
            type="submit"
            style={{
              padding: '6px 14px',
              border: '1px solid #d0d0d0',
              borderRadius: 6,
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            로그아웃
          </button>
        </form>
      </header>
      <h2 style={{ marginBottom: 16 }}>내 할일</h2>
      <p style={{ color: '#666', fontSize: 14 }}>
        API를 통해 할일을 관리할 수 있습니다. <code>GET /api/todos</code>
      </p>
    </main>
  )
}
