export interface Person {
  id: string
  displayName: string
  department: string
  jobTitle: string
  profileImage: string
}

export interface MicrosoftGraphMeetingRoom {
  displayName: string
  id: string
  capacity: number
  emailAddress: string
  audioDeviceName?: string
  videoDeviceName?: string
  displayDeviceName?: string
  isWheelChairAccessible?: boolean
}

export interface MicrosoftGraphCalendarSchedule {
  scheduleId: string
  availabilityView: string
  scheduleItems: unknown[]
}

export interface MicrosoftGraphLocation {
  displayName: string
  locationUri: string
}

export interface MicrosoftDateTime {
  dateTime: string
  timeZone: string
}

export interface MicrosoftOrganizer {
  emailAddress: {
    name: string
    address: string
  }
}

export interface MicrosoftLocation {
  displayName: string
  locationType: string
  uniqueIdType: string
  uniqueId: string
}

export interface MicrosoftGraphEvent {
  start: MicrosoftDateTime
  end: MicrosoftDateTime
  organizer: MicrosoftOrganizer
  location: MicrosoftLocation
}

export interface MicrosoftProfile {
  displayName: string
  mail: string
  userPrincipalName: string
  id: string
  givenName: string
  surname: string
}
