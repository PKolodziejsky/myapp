import { Schema, Document } from 'mongoose'
import { v4 as uuid } from 'uuid'

export interface TrackingEventDocument extends Document {
  type: string
  data: any
}

export const trackingEventSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    type: {
      type: String,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
)
