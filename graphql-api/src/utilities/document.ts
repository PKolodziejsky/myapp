import { Document, ObjectId } from 'mongoose'

export const toDocumentId = (value: string | Document) => {
  return typeof value === 'string' ? value : value._id.toString()
}
