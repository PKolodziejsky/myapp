import { Space } from './Space'
import { User } from './User'

export type Booking = {
  id: string
  date: string
  space: Partial<Space> & { id: string }
  user?: User
  note?: string | null
  isAnonymous?: boolean
  guestInfo?: string | null
}

export enum BookingOwner {
  SELF = 'self',
  ON_BEHALF = 'onBehalf',
}
