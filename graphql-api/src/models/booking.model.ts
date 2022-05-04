import { Document, Schema } from 'mongoose'
import { SpaceDocument } from './space.model'
import { UserDocument } from './user.model'
import { CompanyDocument } from './company.model'
import { v4 as uuid } from 'uuid'

export interface BookingDocument extends Document {
  user?: string | UserDocument | null
  date: string
  note: string
  company: string | CompanyDocument
  space: string | SpaceDocument
  isAnonymous?: boolean
  guestInfo?: string
}

export const bookingSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    user: {
      type: String,
      ref: 'User',
      index: true,
    },
    company: {
      type: String,
      ref: 'Company',
      index: true,
    },
    date: {
      type: String,
      index: true,
    },
    note: String,
    groups: {},
    isAnonymous: {
      type: Boolean,
      default: () => false,
    },
    space: {
      type: String,
      ref: 'Space',
    },
    guestInfo: {
      type: String,
    },
  },
  { timestamps: true },
)
