import { Space } from './Space'

export type TemporaryMeetupFilters = {
  searchQuery?: string
}

export type MeetupRootSpaces = {
  [date: string]: Space[]
}
