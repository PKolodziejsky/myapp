import { selector } from 'recoil'

import { meetingRoomFiltersState } from '../atoms'

export const hasMeetingRoomFiltersState = selector<boolean>({
  key: 'hasMeetingRoomFiltersState',
  get: ({ get }) => {
    const filters = get(meetingRoomFiltersState)

    return (
      (filters.minCapacity !== undefined && filters.minCapacity > 0) ||
      (filters.searchQuery !== undefined && filters.searchQuery !== '') ||
      filters.space !== undefined ||
      filters.equipments.length > 0
    )
  },
})
