const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!

function getRedirectUri() {
  return `${process.env.NEXTAUTH_URL}/auth/github/callback`
}

export function getGitHubAuthURL(state: string): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: getRedirectUri(),
    scope: 'read:user',
    state,
  })
  return `https://github.com/login/oauth/authorize?${params}`
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: getRedirectUri(),
    }),
  })
  const data = await res.json() as { access_token?: string; error?: string; error_description?: string }
  if (data.error) throw new Error(data.error_description ?? data.error)
  return data.access_token!
}

export async function getGitHubUser(accessToken: string) {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!res.ok) throw new Error('GitHub API error: ' + res.status)
  return res.json() as Promise<{ id: number; login: string; avatar_url: string }>
}
