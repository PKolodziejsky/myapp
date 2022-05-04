import { DatesNavigation } from '@seatti-tech/lithium'
import React from 'react'
import { useRecoilState } from 'recoil'

import { formatWeekLabelForDatesNavigation } from '../../components/DatesNavigation/formatWeeks'
import { FiltersBar, Navbar } from '../../components/Meetup'
import { useLocale } from '../../hooks'
import { useVisibilityRestrictions } from '../../hooks/useCompanySettings'
import { ScreenType, useScreenView } from '../../hooks/useScreenView'
import { meetupBaseDateState, temporaryMeetupFiltersState } from '../../store'
import { DailyScreen } from './DailyScreen'
import { WeeklyScreen } from './WeeklyScreen'

export const MeetupScreen = () => {
  const { range: visibilityRange } = useVisibilityRestrictions()
  const [date, setDate] = useRecoilState(meetupBaseDateState)
  const { screenView } = useScreenView(ScreenType.MEETUP)
  const [filters, setFilters] = useRecoilState(temporaryMeetupFiltersState)

  const [locale] = useLocale()

  return (
    <main className='w-full md:w-[780px] min-h-screen h-fit py-2 md:py-10 mx-auto space-y-2 md:space-y-8'>
      <header className='w-full flex flex-col space-y-6'>
        <Navbar />
        <DatesNavigation
          key={locale} // Temporary Fix for locale
          view={screenView}
          allocations={{}}
          onDatesChange={() => {}}
          formatWeek={week => formatWeekLabelForDatesNavigation(week, locale)}
          selectedDate={date}
          onSelectDate={date => {
            setDate(date)
            setFilters({
              ...filters,
              searchQuery: '',
            })
          }}
          minDate={visibilityRange && visibilityRange.start}
          maxDate={visibilityRange && visibilityRange.end}
        />
      </header>
      <div className='flex flex-col space-y-8 md:space-y-10 px-4 md:px-0 '>
        <FiltersBar />
        {screenView === 'daily' ? <DailyScreen /> : <WeeklyScreen />}
      </div>
    </main>
  )
}
