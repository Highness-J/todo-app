import mongoose, { type Document, type Model } from 'mongoose'

export interface IUser extends Document {
  githubId: string
  username: string
  avatarUrl: string
  createdAt: Date
}

const userSchema = new mongoose.Schema<IUser>({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ?? mongoose.model<IUser>('User', userSchema)

export default User
