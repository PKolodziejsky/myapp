import mongoose from 'mongoose'
import { spaceSchema } from '../models/space.model'

export default async () => {
  const Space = mongoose.model('Space', spaceSchema)

  await Space.updateMany({ kind: { $eq: null } }, { $set: { kind: 'workspace' } }).exec()
}
