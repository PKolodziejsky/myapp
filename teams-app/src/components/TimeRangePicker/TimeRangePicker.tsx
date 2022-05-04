import { ArrowLeftIcon, Button, ContextMenuController, RoundIconButton } from '@seatti-tech/lithium'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TIME_FORMAT } from '../../utilities'
import { Duration } from './components/Duration'
import { Selector } from './components/Selector'
import { TimeInput } from './components/TimeInput'
import { DEFAULT_MINUTE_INTERVAL } from './constants'

export interface TimeRangePickerProps {
  from: Date
  to: Date
  onSave?: (from: Date, to: Date) => void
  minuteInterval?: number
  className?: string
}

export const TimeRangePicker = ({
  from: initialFrom,
  to: initialTo,
  onSave,
  minuteInterval = DEFAULT_MINUTE_INTERVAL,
  className,
}: TimeRangePickerProps) => {
  const { t } = useTranslation()

  const duration = dayjs(initialTo).diff(initialFrom, 'minute')

  const [from, setFrom] = useState<Date>(initialFrom)
  const [to, setTo] = useState<Date>(initialTo)

  const [toErrorMessage, setToErrorMessage] = useState<string>()

  const hasError = toErrorMessage !== undefined

  useEffect(() => {
    setTo(dayjs(from).add(duration, 'minute').toDate())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from])

  const [selectFromTime, selectToTime] = useMemo(() => {
    const selectFromTime = dayjs(from).add(minuteInterval, 'minute').toDate()
    const selectToTime = dayjs(selectFromTime).add(minuteInterval, 'minute').toDate()

    return [selectFromTime, selectToTime]
  }, [from, minuteInterval])

  useEffect(() => {
    if (dayjs(to).isSameOrBefore(from, 'minute')) setToErrorMessage(t('application.meeting.invalid-end-time'))
    else setToErrorMessage(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to])

  return (
    <ContextMenuController
      className={className}
      alignment='center'
      selector={toggle => (
        <Selector onClick={toggle}>
          <span className='flex space-x-2'>
            <span className='text-sm'>
              {t('application.planning.from-time-to-time', {
                from: dayjs(initialFrom).format(TIME_FORMAT),
                to: dayjs(initialTo).format(TIME_FORMAT),
              })}
            </span>
            <Duration from={initialFrom} to={initialTo} withBrackets />
          </span>
        </Selector>
      )}
    >
      {toggle => (
        <div className='h-screen md:h-fit w-full md:w-[540px] flex flex-col items-center gap-y-4 md:gap-y-8 py-2 md:py-8 px-4 md:px-6'>
          <header className='w-full flex items-center justify-between space-x-2 md:hidden'>
            <span className='flex items-center'>
              <RoundIconButton variant='ghost' onClick={toggle}>
                <ArrowLeftIcon />
              </RoundIconButton>
              <span className='flex flex-col'>
                <h2 className='text-h5 font-semibold'>{t('application.meeting.select-time-slot')}</h2>
                <div className='text-xs text-grey-600 dark:text-grey-500'>{dayjs(from).format('dddd, D MMMM')}</div>
              </span>
            </span>
            <Button
              disabled={hasError}
              onClick={() => {
                if (onSave) onSave(from, to)
                toggle()
              }}
            >
              {t('application.meeting.select')}
            </Button>
          </header>
          <div className='w-full flex md:divide-x divide-grey-200 dark:divide-grey-800'>
            <TimeInput
              label={t('application.meeting.from')}
              time={from}
              selectStartTime={selectFromTime}
              minuteInterval={minuteInterval}
              onChange={setFrom}
              autoFocus
            />
            <TimeInput
              label={t('application.meeting.to')}
              time={to}
              showDuration={!hasError}
              startTimeOfDuration={from}
              selectStartTime={selectToTime}
              minuteInterval={minuteInterval}
              onChange={setTo}
              errorMessage={toErrorMessage}
            />
          </div>
          <div className='hidden md:flex space-x-4'>
            <Button variant='secondary' onClick={toggle}>
              {t('application.planning.cancel')}
            </Button>
            <Button
              disabled={hasError}
              onClick={() => {
                if (onSave) onSave(from, to)
                toggle()
              }}
            >
              {t('application.meeting.select')}
            </Button>
          </div>
        </div>
      )}
    </ContextMenuController>
  )
}
