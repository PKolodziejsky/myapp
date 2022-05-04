import React from 'react'
import { useRecoilValue } from 'recoil'

import { BookingList } from '../../components/BookingList'
import { planningBaseDateState } from '../../store'
import { openBookingsState } from '../../store/atoms/bookings'
import { toKey } from '../../utilities'
import { SubmissionScreenFactory } from '../SubmissionScreen/SubmissionScreenFactory'

export const DailyScreen = () => {
  const baseDate = useRecoilValue(planningBaseDateState)
  const dateKey = toKey(baseDate)

  const { [dateKey]: booking } = useRecoilValue(openBookingsState)

  return booking ? <SubmissionScreenFactory date={baseDate} /> : <BookingList date={baseDate} className='px-4 md:px-0 md:w-[540px]' />
}
