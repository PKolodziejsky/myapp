import { selector } from 'recoil'

import { getDatesInWeek } from '../../utilities'
import { meetupBaseDateState, meetupDatesViewState, planningBaseDateState, planningDatesViewState } from '../atoms'

export const planningDateRangeState = selector<Date[]>({
  key: 'planningDateRangeState',
  get: ({ get }) => {
    const planningDatesView = get(planningDatesViewState)
    const planningBaseDate = get(planningBaseDateState)

    return planningDatesView === 'daily' ? [planningBaseDate] : getDatesInWeek(planningBaseDate)
  },
})

export const meetupDateRangeState = selector<Date[]>({
  key: 'meetupDateRangeState',
  get: ({ get }) => {
    const meetupDatesView = get(meetupDatesViewState)
    const meetupBaseDate = get(meetupBaseDateState)

    if (meetupDatesView === 'daily') return [meetupBaseDate]
    else return getDatesInWeek(meetupBaseDate)
  },
})
