import { Document, Schema, Types } from 'mongoose'
import { SpaceDocument } from './space.model'
import { UserDocument } from './user.model'
import { v4 as uuid } from 'uuid'
import { TimePeriod } from '../types/time.interface'

interface BookingRestrictions {
  future?: TimePeriod
  past?: TimePeriod
}

interface BookingSettings {
  access: {
    groups: string[]
  }
  booking: {
    restrictions?: {
      defaults?: BookingRestrictions
      maxGuestBookings?: number
    }
  }
  visibility?: {
    restrictions?: {
      defaults?: BookingRestrictions
    }
  }
}

export interface CompanyDocument extends Document {
  name: string
  tenant: string
  users: string[] | UserDocument[]
  spaces: string[] | SpaceDocument[]
  settings?: BookingSettings
}

export const companySchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    name: String,
    tenant: String,
    users: {
      type: [String],
      ref: 'User',
    },
    spaces: {
      type: [String],
      ref: 'Space',
    },
    settings: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
)
