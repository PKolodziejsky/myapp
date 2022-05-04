import React from 'react'
import { useRecoilState } from 'recoil'

import { DatesNavigationWithAllocations } from '../../components/DatesNavigation/DatesNavigation'
import { Navbar } from '../../components/Planning'
import { useBookingRestrictions } from '../../hooks/useCompanySettings'
import { ScreenType, useScreenView } from '../../hooks/useScreenView'
import { useShowProductTour } from '../../hooks/useShowProductTour'
import { planningBaseDateState, useMoveOpenBooking } from '../../store'
import { dayHasPassed, toKey } from '../../utilities'
import { DailyScreen } from './DailyScreen'
import { WeeklyScreen } from './WeeklyScreen'

export const PlanningScreen = () => {
  const { range: bookingRange } = useBookingRestrictions()

  const { screenView } = useScreenView(ScreenType.PLANNING)
  const isDailyView = screenView === 'daily'

  const [baseDate, setBaseDate] = useRecoilState(planningBaseDateState)
  const dateKey = toKey(baseDate)

  const moveOpenBooking = useMoveOpenBooking(dateKey)

  const onSelectDate = (date: Date) => {
    if (isDailyView && !dayHasPassed(date)) moveOpenBooking(toKey(date))
    setBaseDate(date)
  }

  useShowProductTour()

  return (
    <main className='w-full md:w-[780px] min-h-screen h-fit py-2 md:py-10 mx-auto flex flex-col items-center gap-y-4 md:gap-y-8'>
      <header className='w-full flex flex-col space-y-6'>
        <Navbar />
        <DatesNavigationWithAllocations
          view={screenView}
          selectedDate={baseDate}
          onSelectDate={onSelectDate}
          maxDate={bookingRange && bookingRange.end}
        />
      </header>
      {isDailyView ? <DailyScreen /> : <WeeklyScreen />}
    </main>
  )
}
