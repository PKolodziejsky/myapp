import { atom } from 'recoil'

import { queryClient } from '../../request'
import { Equipment, Space } from '../../types'

export type MeetingRoomFilters = {
  includeUnavailable?: boolean
  minCapacity?: number
  space?: Space
  searchQuery?: string
  equipments: Equipment[]
}

export const meetingRoomFiltersState = atom<MeetingRoomFilters>({
  key: 'meetingRoomFilters',
  default: {
    equipments: [],
  },
  effects: [
    ({ onSet }) => {
      onSet(newValue => {
        if (!newValue.minCapacity && !newValue.searchQuery && !newValue.space && newValue.equipments.length === 0) {
          queryClient.resetQueries(['meetingRooms'])
        }
      })
    },
  ],
})

export enum MeetingRoomFilter {
  NONE,
  SEARCH,
  OTHERS,
}

export const activeMeetingRoomFilterState = atom<MeetingRoomFilter>({
  key: 'activeMeetingRoomFilterState',
  default: MeetingRoomFilter.OTHERS,
})
