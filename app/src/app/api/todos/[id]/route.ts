import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/session'
import Todo from '@/models/todo'

type Params = { params: { id: string } }

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as { title?: string; status?: string }
  await connectDB()

  const $set: Record<string, string> = {}
  if (typeof body.title === 'string') $set.title = body.title
  if (typeof body.status === 'string') $set.status = body.status

  const todo = await Todo.findOneAndUpdate(
    { _id: params.id, userId: session.userId },
    { $set },
    { new: true },
  )
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(todo)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const todo = await Todo.findOneAndDelete({ _id: params.id, userId: session.userId })
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
