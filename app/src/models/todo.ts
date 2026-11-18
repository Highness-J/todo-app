import mongoose, { type Document, type Model, type Types } from 'mongoose'

export type TodoStatus = 'todo' | 'doing' | 'done'

export interface ITodo extends Document {
  title: string
  status: TodoStatus
  userId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: { type: String, required: true, maxlength: 200 },
    status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true },
)

const Todo: Model<ITodo> =
  (mongoose.models.Todo as Model<ITodo>) ?? mongoose.model<ITodo>('Todo', todoSchema)

export default Todo
