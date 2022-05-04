import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState, useRecoilValue } from 'recoil'

import { CopyLastWeekButton } from '../../components/Planning/CopyLastWeekButton'
import { DaySegment } from '../../components/Planning/DaySegment'
import { useBookableDates } from '../../hooks'
import { includeWeekendState, planningBaseDateState, planningDateRangeState } from '../../store'
import { weekHasPassed } from '../../utilities'

export const WeeklyScreen = () => {
  const { t } = useTranslation()

  const dates = useRecoilValue(planningDateRangeState)
  const baseDate = useRecoilValue(planningBaseDateState)
  const [includeWeekend, setIncludeWeekend] = useRecoilState(includeWeekendState)

  let datesAfterFilter = dates
  if (!includeWeekend) datesAfterFilter = dates.slice(0, -2)

  const isPast = weekHasPassed(baseDate)

  const bookableDates = useBookableDates(datesAfterFilter)

  return (
    <section className='w-full flex flex-col items-center space-y-6 md:space-y-10 px-4 md:px-0'>
      {!isPast && bookableDates.length > 0 && <CopyLastWeekButton className='mx-auto' />}
      <section className='w-full flex flex-col space-y-4'>
        {datesAfterFilter.map(date => (
          <DaySegment date={date} />
        ))}
      </section>
      <button
        className='text-purple-600 dark:text-purple-400 transition hover:text-pink-600 dark:hover:text-pink-300 self-start'
        onClick={() => setIncludeWeekend(!includeWeekend)}
      >
        {includeWeekend ? t('application.planning.hide-weekend') : t('application.planning.show-weekend')}
      </button>
    </section>
  )
}
