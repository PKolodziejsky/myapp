import { DateTimeRange } from '../../types'
import { SpaceDocument } from '../../models/space.model'
import { MeetingRoomDocument } from '../../models/meeting-room.schema'
import { Space } from './space.interface'

export interface CreateMeetingRoomBookingData {
  subject: string
  room: string
  dateTimeRange: DateTimeRange
}

export interface GetMeetingRoomBookingsData {
  date: string
}

export interface FindMeetingRoomsData {
  dateTimeRange: DateTimeRange
  name?: string
  space?: string
  minCapacity?: number
  filterByAudioDevice?: boolean
  filterByVideoDevice?: boolean
  filterByDisplayDevice?: boolean
  isWheelChairAccessible?: boolean
}

export interface MeetingRoom {
  id: string
  name: string
  capacity?: number
  emailAddress: string
  rootPath: Space[]
  audioDeviceName?: string
  videoDeviceName?: string
  displayDeviceName?: string
  isWheelChairAccessible?: boolean
  isFavorite: boolean
}

export type CreateChildSpacesAggregationType = MeetingRoomDocument & { rootPath: Array<SpaceDocument & { order: number }> }
