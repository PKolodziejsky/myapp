import { Schema, Document, Types } from 'mongoose'
import { CompanyDocument } from './company.model'
import { v4 as uuid } from 'uuid'

interface UserSettingsDocument extends Document {
  custom: Map<string, JSONObject>
}

export interface UserDocument extends Document {
  objectId: string
  company: string | CompanyDocument
  settings: UserSettingsDocument
  activated?: boolean
  favorites?: string[]
  favoriteMeetingRooms?: string[]
}

const userSettingsSchema = new Schema({
  custom: Schema.Types.Map,
  of: Schema.Types.Mixed,
})

export const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    objectId: {
      type: String,
      index: true,
      unique: true,
    },
    settings: {
      type: userSettingsSchema,
    },
    company: {
      type: String,
      index: true,
      ref: 'Company',
    },
    favorites: {
      type: [String],
      ref: 'User',
    },
    favoriteMeetingRooms: {
      type: [String],
      ref: 'Space',
    },
    activated: Boolean,
  },
  { timestamps: true },
)
