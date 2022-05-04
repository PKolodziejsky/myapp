import { MeetingRoomFilter, MeetingRoomFilters } from '../../store'
import { DateTimeRange, Equipment, MeetingRoomBooking } from '../../types'

export const toMeetingRoomInput = (activeFilter: MeetingRoomFilter, filters: MeetingRoomFilters, dateTimeRange: DateTimeRange) => {
  switch (activeFilter) {
    case MeetingRoomFilter.OTHERS:
      return {
        space: filters.space?.id,
        minCapacity: filters.minCapacity,
        dateTimeRange,
        ...(filters.equipments.length > 0
          ? {
              filterByAudioDevice: filters.equipments.includes(Equipment.AUDIO),
              filterByVideoDevice: filters.equipments.includes(Equipment.VIDEO),
              filterByDisplayDevice: filters.equipments.includes(Equipment.DISPLAY),
              isWheelChairAccessible: filters.equipments.includes(Equipment.ACCESSIBILITY),
            }
          : {}),
      }
    case MeetingRoomFilter.SEARCH:
      return {
        name: filters.searchQuery,
        dateTimeRange,
      }
    default:
      return {
        dateTimeRange,
      }
  }
}

export const toMeetingRoomBookingInput = (subject: string, booking: MeetingRoomBooking) => ({
  subject,
  room: booking.room.id,
  dateTimeRange: booking.dateTimeRange,
})
