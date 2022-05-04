export interface TrackingUserData {
  userId: string
  objectId: string
  companyId: string
  tenantId: string
}

interface UserData {
  userId: string
  objectId: string
}

interface CompanyData {
  companyId: string
  tenantId: string
}

interface BookingData {
  note: string
  spaceId: string
}

export interface GenericTrackingEvent {
  type: string
}

export interface UserLoggedInTrackingEvent extends UserData, CompanyData {
  type: 'user_logged_in'
}

export interface UserSignedUpTrackingEvent extends UserData, CompanyData {
  type: 'user_signed_up'
}

export interface BookingCreateTrackingEvent extends UserData, CompanyData, BookingData {
  type: 'booking_created'
}

export interface BookingUpdatedTrackingEvent extends UserData, CompanyData, BookingData {
  type: 'booking_updated'
}

export type TrackingEvent = UserLoggedInTrackingEvent | UserSignedUpTrackingEvent | BookingCreateTrackingEvent | BookingUpdatedTrackingEvent
