import { NextResponse } from 'next/server'
import { getGitHubAuthURL } from '@/lib/github'
import { getSession } from '@/lib/session'

export async function GET() {
  const state = crypto.randomUUID()
  const session = await getSession()
  session.oauthState = state
  await session.save()

  const url = getGitHubAuthURL(state)
  return NextResponse.redirect(url, { status: 302 })
}
