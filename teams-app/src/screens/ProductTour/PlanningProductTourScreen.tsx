import {
  AllocationsEditSection,
  Button,
  DatesNavigation,
  DatesNavigationDates,
  DatesNavigationDatesAllocations,
  MeetupIcon,
} from '@seatti-tech/lithium'
import dayjs from 'dayjs'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { BurgerMenu, CalendarButton, ChangeViewButton, LinkButton, TodayButton } from '../../components/Navbar'
import { ProductTour } from '../../components/ProductTour/PlanningProductTour'
import { TODAY, getDatesInWeek } from '../../utilities'
import { steps } from './steps'

const AddButton = () => {
  const { t } = useTranslation()

  return (
    <button data-tour='add-booking' className='font-semibold text-purple-600 dark:text-purple-400'>
      + {t('application.planning.add')}
    </button>
  )
}

export const PlanningProductTourScreen = () => {
  const { t } = useTranslation()
  const [allocations, setAllocations] = useState<DatesNavigationDatesAllocations>({})
  const navigate = useNavigate()

  const selectedDate = useRef(TODAY)
  const dates = useMemo(() => getDatesInWeek(selectedDate.current), [])

  const onDatesChange = useCallback((dates: DatesNavigationDates) => {
    const mockAllocations: DatesNavigationDatesAllocations = {}

    for (const key in dates) {
      mockAllocations[key] = dates[key].map((_, index) => (index === 0 ? 7 : 0))
    }

    setAllocations(mockAllocations)
  }, [])

  const onEnd = () => navigate('/planning')

  return (
    <Fragment>
      <ProductTour steps={steps} onEnd={onEnd} />
      <main className='w-full md:w-[780px] min-h-[200vh] h-fit py-2 md:py-10 mx-auto space-y-4 md:space-y-10 pointer-events-none'>
        <header className='w-full flex flex-col space-y-6'>
          <nav className='flex items-center justify-between'>
            <ul className='flex items-center gap-3 md:gap-4 divide-x divide-grey-300 dark:divide-grey-700 h-max md:ml-0 ml-4'>
              <li className='h-full'>
                <CalendarButton date={selectedDate.current} onSelectDate={() => {}} />
              </li>
              <li className='pl-3 h-full'>
                <ChangeViewButton view={'weekly'} onChange={() => {}} />
              </li>
              <li className='pl-3 h-[28px] md:h-[20px] flex items-center'>
                <TodayButton onClick={() => {}} />
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
          <DatesNavigation
            view='weekly'
            selectedDate={selectedDate.current}
            onSelectDate={() => {}}
            allocations={allocations}
            formatWeek={week => week}
            onDatesChange={onDatesChange}
          />
        </header>
        <Fragment>
          <section className='flex justify-center'>
            <span data-tour='copy-last-week'>
              <Button>{t('application.planning.copy-last-week')}</Button>
            </span>
          </section>
          <section className='flex flex-col space-y-4 px-4 md:px-0'>
            {dates.map(date => (
              <AllocationsEditSection title={dayjs(date).format('ddd, D')} addOn={<AddButton />} />
            ))}
          </section>
        </Fragment>
      </main>
    </Fragment>
  )
}
