import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/session'
import Todo from '@/models/todo'

export async function GET() {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const todos = await Todo.find({ userId: session.userId }).sort({ createdAt: -1 })
  return NextResponse.json(todos)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as { title?: string; status?: string }
  const { title, status } = body

  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: '제목을 입력해주세요' }, { status: 400 })
  }

  await connectDB()
  const todo = await Todo.create({
    title: title.trim(),
    status: status ?? 'todo',
    userId: session.userId,
  })
  return NextResponse.json(todo, { status: 201 })
}
