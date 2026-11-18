import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, getGitHubUser } from '@/lib/github'
import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/session'
import User from '@/models/user'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=oauth_denied', request.url))
  }

  const session = await getSession()

  if (!state || state !== session.oauthState) {
    return NextResponse.redirect(new URL('/?error=invalid_state', request.url))
  }
  session.oauthState = undefined

  try {
    const accessToken = await exchangeCodeForToken(code)
    const githubUser = await getGitHubUser(accessToken)

    await connectDB()
    const user = await User.findOneAndUpdate(
      { githubId: String(githubUser.id) },
      {
        githubId: String(githubUser.id),
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
      },
      { upsert: true, new: true },
    )

    session.userId = String(user._id)
    session.username = user.username
    session.avatarUrl = user.avatarUrl
    await session.save()

    return NextResponse.redirect(new URL('/', request.url))
  } catch (err) {
    console.error('OAuth callback error:', err)
    return NextResponse.redirect(new URL('/?error=oauth_failed', request.url))
  }
}
