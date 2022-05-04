import { gql } from 'graphql-request'

import { graphClient } from '../request'
import { DateTimeRange, MeetingRoom, MeetingRoomBooking, Space } from '../types'

interface GetMeetingRoomsInput {
  dateTimeRange: DateTimeRange
  space?: string
  name?: string
  minCapacity?: number
  filterByAudioDevice?: boolean
  filterByVideoDevice?: boolean
  filterByDisplayDevice?: boolean
  isWheelChairAccessible?: boolean
}

interface GetMeetingRoomsParameters {
  input: GetMeetingRoomsInput
}

type GetMeetingRoomResultRootPath = Partial<Space> & { id: string; name: string }

interface GetMeetingRoomResult {
  room: MeetingRoom & { rootPath: GetMeetingRoomResultRootPath[] }
  isAvailable: boolean
}

interface GetMeetingRoomsResult {
  [key: string]: GetMeetingRoomResult[]
}

const GET_MEETING_ROOMS_QUERY = gql`
  query getMeetingRooms($input: FindMeetingRoomInput!) {
    findMeetingRooms(input: $input) {
      room {
        id
        name
        rootPath {
          id
          name
        }
        capacity
        videoDeviceName
        audioDeviceName
        displayDeviceName
        isWheelChairAccessible
        isFavorite
      }
      isAvailable
    }
  }
`

export const getMeetingRoomsRequest = (parameters: GetMeetingRoomsParameters): Promise<GetMeetingRoomsResult> => {
  return graphClient.request(GET_MEETING_ROOMS_QUERY, parameters)
}

interface CreateMeetingRoomBookingInput {
  room: string
  dateTimeRange: DateTimeRange
}

interface CreateMeetingRoomBookingParameters {
  input: CreateMeetingRoomBookingInput
}

const CREATE_MEETING_ROOM_MUTATION = gql`
  mutation createMeetingRoomBooking($input: CreateMeetingRoomBookingInput!) {
    createMeetingRoomBooking(input: $input)
  }
`

export const createMeetingRoomBookingRequest = (parameters: CreateMeetingRoomBookingParameters): Promise<boolean> => {
  return graphClient.request(CREATE_MEETING_ROOM_MUTATION, parameters)
}

interface GetMeetingRoomBookingsInput {
  date: string
}

interface GetMeetingRoomBookingsParameters {
  input: GetMeetingRoomBookingsInput
}

interface GetMeetingRoomBookingsResult {
  [key: string]: MeetingRoomBooking[]
}

const GET_MEETING_ROOM_BOOKINGS_QUERY = gql`
  query getMeetingRoomBookings($input: MeetingRoomBookingsInput!) {
    meetingRoomBookings(input: $input) {
      room {
        id
        name
        rootPath {
          name
        }
        capacity
        videoDeviceName
        audioDeviceName
        displayDeviceName
        isWheelChairAccessible
      }
      dateTimeRange {
        start {
          dateTime
          timeZone
        }
        end {
          dateTime
          timeZone
        }
      }
    }
  }
`

export const getMeetingRoomBookingsRequest = (parameters: GetMeetingRoomBookingsParameters): Promise<GetMeetingRoomBookingsResult> => {
  return graphClient.request(GET_MEETING_ROOM_BOOKINGS_QUERY, parameters)
}

interface AddFavoriteMeetingRoomParameters {
  id: string
}

interface AddFavoriteMeetingRoomResult {
  [key: string]: boolean
}

const ADD_FAVORITE_MEETING_ROOM = gql`
  mutation addFavoriteMeetingRoom($id: String!) {
    addFavoriteMeetingRoom(id: $id)
  }
`

export const addFavoriteMeetingRoomRequest = (parameters: AddFavoriteMeetingRoomParameters): Promise<AddFavoriteMeetingRoomResult> => {
  return graphClient.request(ADD_FAVORITE_MEETING_ROOM, parameters)
}

interface RemoveFavoriteMeetingRoomParameters {
  id: string
}

interface RemoveFavoriteMeetingRoomResult {
  [key: string]: boolean
}

const REMOVE_FAVORITE_MEETING_ROOM = gql`
  mutation removeFavoriteMeetingRoom($id: String!) {
    removeFavoriteMeetingRoom(id: $id)
  }
`

export const removeFavoriteMeetingRoomRequest = (
  parameters: RemoveFavoriteMeetingRoomParameters,
): Promise<RemoveFavoriteMeetingRoomResult> => {
  return graphClient.request(REMOVE_FAVORITE_MEETING_ROOM, parameters)
}
