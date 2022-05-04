import { atom } from 'recoil'

import { DatesView } from '../../types'

export const planningDatesViewState = atom<DatesView>({
  key: 'planningDatesViewState',
  default: 'daily' as DatesView,
})

export const meetupDatesViewState = atom<DatesView>({
  key: 'meetupDatesViewState',
  default: 'daily' as DatesView,
})
