import { MeetupIcon } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'

import { ScreenType, useScreenView } from '../../hooks/useScreenView'
import { planningBaseDateState, useMoveOpenBooking } from '../../store'
import { TODAY, toKey } from '../../utilities'
import { BurgerMenu, CalendarButton, ChangeViewButton, LinkButton, TodayButton } from '../Navbar'

export const Navbar = () => {
  const { t } = useTranslation()
  const [baseDate, setBaseDate] = useRecoilState(planningBaseDateState)

  const { screenView, setScreenView } = useScreenView(ScreenType.PLANNING)
  const isDailyView = screenView === 'daily'

  const dateKey = toKey(baseDate)

  const moveOpenBooking = useMoveOpenBooking(dateKey)

  const onSelectDate = (date: Date) => {
    if (isDailyView) moveOpenBooking(toKey(date))
    setBaseDate(date)
  }

  return (
    <nav className='flex items-center justify-between'>
      <ul className='flex items-center gap-3 md:gap-4 divide-x divide-grey-300 dark:divide-grey-700 h-max md:ml-0 ml-4'>
        <li className='h-4 flex items-center'>
          <CalendarButton date={baseDate} onSelectDate={setBaseDate} />
        </li>
        <li className='pl-3 h-4 flex items-center'>
          <ChangeViewButton view={screenView} onChange={setScreenView} />
        </li>
        <li className='pl-3 h-4 flex items-center'>
          <TodayButton onClick={() => onSelectDate(TODAY)} />
        </li>
      </ul>
      <ul className='flex'>
        <li>
          <LinkButton to='/meetup' iconEnd={<MeetupIcon />}>
            {t('application.navbar.meetup')}
          </LinkButton>
        </li>
        <li>
          <BurgerMenu />
        </li>
      </ul>
    </nav>
  )
}
