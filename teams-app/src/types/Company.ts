import { TimePeriodRange } from './global'
import { Space } from './Space'
import { User } from './User'

export type CompanyBookingRestrictions = {
  defaults?: TimePeriodRange
  maxGuestBookings?: number | null
}

export type CompanyVisibilityRestrictions = {
  defaults?: TimePeriodRange
}

export type CompanySettings = {
  booking?: {
    restrictions?: CompanyBookingRestrictions
  }
  visibility?: {
    restrictions?: CompanyVisibilityRestrictions
  }
}

export type Company = {
  id?: string
  name?: string
  users?: User[]
  spaces?: Space[]
  settings?: CompanySettings
}
