import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState, useRecoilValue } from 'recoil'

import { DaySegment } from '../../components/Meetup'
import { includeWeekendState, meetupDateRangeState } from '../../store'

export const WeeklyScreen = () => {
  const { t } = useTranslation()

  const dates = useRecoilValue(meetupDateRangeState)
  const [includeWeekend, setIncludeWeekend] = useRecoilState(includeWeekendState)

  let datesAfterFilter = dates
  if (!includeWeekend) datesAfterFilter = dates.slice(0, -2)

  return (
    <>
      <ul className='w-full flex flex-col space-y-8'>
        {datesAfterFilter.map(date => (
          <li key={date.toString()}>
            <DaySegment date={date} />
          </li>
        ))}
      </ul>
      <button
        className='text-purple-600 dark:text-purple-400 transition hover:text-pink-600 dark:hover:text-pink-300 self-start'
        onClick={() => setIncludeWeekend(!includeWeekend)}
      >
        {includeWeekend ? t('application.planning.hide-weekend') : t('application.planning.show-weekend')}
      </button>
    </>
  )
}
