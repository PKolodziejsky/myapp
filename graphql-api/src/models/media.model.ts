import { Document, Schema, Types } from 'mongoose'
import { CompanyDocument } from './company.model'
import { v4 as uuid } from 'uuid'

export type MediaDocument = {
  key: string
  description: string
  company: string | CompanyDocument
} & Document<string>

export const mediaSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    key: String,
    description: String,
    company: {
      type: String,
      ref: 'Company',
    },
  },
  { timestamps: true },
)
