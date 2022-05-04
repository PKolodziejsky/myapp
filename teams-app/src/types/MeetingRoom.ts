import { Space } from '.'

export type DateTime = {
  dateTime: string
  timeZone: string
}

export type DateTimeRange = {
  start: DateTime
  end: DateTime
}

export enum Equipment {
  AUDIO = 'audio',
  VIDEO = 'video',
  DISPLAY = 'display',
  ACCESSIBILITY = 'accessibility',
}

export type MeetingRoom = {
  id: string
  name: string
  rootPath: Space[]
  capacity?: number
  videoDeviceName?: string
  audioDeviceName?: string
  displayDeviceName?: string
  isWheelChairAccessible?: boolean
  isFavorite?: boolean
}

export type MeetingRoomBooking = {
  room: MeetingRoom
  dateTimeRange: DateTimeRange
}
