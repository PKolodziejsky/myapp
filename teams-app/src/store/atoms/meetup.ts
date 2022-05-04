import { atom } from 'recoil'

import { MeetupRootSpaces, TemporaryMeetupFilters } from '../../types/Meetup'

export const temporaryMeetupFiltersState = atom<TemporaryMeetupFilters>({
  key: 'temporaryMeetupFiltersState',
  default: {},
})

export const meetupRootSpacesState = atom<MeetupRootSpaces>({
  key: 'meetupRootSpacesState',
  default: {},
})
