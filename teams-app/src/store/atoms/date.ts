import { atom } from 'recoil'

import { TODAY } from '../../utilities'

export const planningBaseDateState = atom<Date>({
  key: 'planningBaseDateState',
  default: TODAY,
})

export const meetupBaseDateState = atom<Date>({
  key: 'meetupBaseDateState',
  default: TODAY,
})

export const includeWeekendState = atom<boolean>({
  key: 'includeWeekendState',
  default: false,
})
