import { getIronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId?: string
  username?: string
  avatarUrl?: string
  oauthState?: string
}

export const sessionOptions: SessionOptions = {
  cookieName: 'todo-session',
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  },
}

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  return session
}
