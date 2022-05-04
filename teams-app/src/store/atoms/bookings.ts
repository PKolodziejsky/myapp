import { atom, useRecoilState } from 'recoil'

import { Booking, MeetingRoomBooking, Space, SpaceKind } from '../../types'

export type OpenWorkspaceBookingData = Partial<Booking>
export type OpenMeetingRoomBookingData = Partial<MeetingRoomBooking>

export type OpenBookingData = OpenWorkspaceBookingData | OpenMeetingRoomBookingData
export type OpenBookingDataChanges = OpenBookingData

export type OpenBookingContext = {
  rootSpace?: Space
}

export type OpenWorkspaceBooking = {
  data?: OpenWorkspaceBookingData
  context?: OpenBookingContext
  spaceKind: SpaceKind.WORKSPACE
}

export type OpenMeetingRoomBooking = {
  data?: OpenMeetingRoomBookingData
  context?: OpenBookingContext
  spaceKind: SpaceKind.MEETING_ROOM
}

export type OpenBooking = OpenWorkspaceBooking | OpenMeetingRoomBooking
export type OpenBookingContextChanges = Partial<OpenBookingContext>

export type OpenBookingByDate = {
  [key: string]: OpenBooking
}

export const openBookingsState = atom<OpenBookingByDate>({
  key: 'openBookingsState',
  default: {},
})

export const useCreateOpenBooking = (date: string) => {
  const [openBookings, setOpenBookings] = useRecoilState(openBookingsState)

  return (booking: OpenBooking) => {
    const currentBooking = openBookings[date]

    setOpenBookings({
      ...openBookings,
      [date]: {
        data: {},
        ...booking,
        context: {
          ...currentBooking?.context,
          ...booking.context,
        },
      },
    })
  }
}

export const useCreateOpenBookingByDate = () => {
  const [openBookings, setOpenBookings] = useRecoilState(openBookingsState)

  return (date: string, booking: OpenBooking) => {
    const currentBooking = openBookings[date]

    setOpenBookings({
      ...openBookings,
      [date]: {
        data: {},
        ...booking,
        context: {
          ...currentBooking?.context,
          ...booking.context,
        },
      },
    })
  }
}

interface UpdateOpenBookingParameters {
  data?: OpenBookingDataChanges
  context?: OpenBookingContextChanges
}

export const useUpdateOpenBooking = (date: string) => {
  const [openBookings, setOpenBookings] = useRecoilState(openBookingsState)

  return ({ data = {}, context = {} }: UpdateOpenBookingParameters) => {
    if (data === {} && context === {}) return

    const booking = openBookings[date]

    setOpenBookings({
      ...openBookings,
      [date]: {
        ...booking,
        context: {
          ...booking.context,
          ...context,
        },
        data: {
          ...booking.data,
          ...data,
        },
      } as typeof booking,
    })
  }
}

export const useUpdateOpenBookingData = (date: string) => {
  const updateOpenBooking = useUpdateOpenBooking(date)

  return (data: OpenBookingDataChanges) => updateOpenBooking({ data })
}

export const useUpdateOpenBookingContext = (date: string) => {
  const updateOpenBooking = useUpdateOpenBooking(date)

  return (context: OpenBookingContextChanges) => updateOpenBooking({ context })
}

export const useCloseOpenBooking = (date: string) => {
  const [openBookings, setOpenBookings] = useRecoilState(openBookingsState)

  const newOpenBookings = { ...openBookings }

  return () => {
    delete newOpenBookings[date]
    setOpenBookings(newOpenBookings)
  }
}

export const useMoveOpenBooking = (from: string) => {
  const [openBookings, setOpenBookings] = useRecoilState(openBookingsState)

  const newOpenBookings = { ...openBookings }

  const booking = newOpenBookings[from]

  return (to: string) => {
    if (!booking || from === to) return

    delete newOpenBookings[from]
    setOpenBookings({
      ...newOpenBookings,
      [to]: booking,
    })
  }
}
