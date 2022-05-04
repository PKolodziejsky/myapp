import { Card } from '@seatti-tech/lithium'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React from 'react'

import { TIME_FORMAT } from '../../../utilities'
import { DEFAULT_MINUTE_INTERVAL } from '../constants'
import { Duration } from './Duration'

const OPTION_COUNT = 6

export interface TimeSelectProps {
  from: Date
  showDuration?: boolean
  startTimeOfDuration?: Date
  minuteInterval?: number
  onSelect?: (time: Date) => void
  className?: string
}

export const TimeSelect = ({
  from,
  showDuration,
  minuteInterval = DEFAULT_MINUTE_INTERVAL,
  startTimeOfDuration,
  onSelect,
  className,
}: TimeSelectProps) => {
  if (startTimeOfDuration && dayjs(from).isAfter(startTimeOfDuration, 'day')) return <></>

  if (dayjs(from).get('hour') === 0 && dayjs(from).get('minute') === 0) return <></>

  return (
    <ul className={classNames('w-full flex flex-col space-y-1', className)}>
      {Array.from(Array(OPTION_COUNT).keys()).map(i => {
        const time = dayjs(from)
          .add(i * minuteInterval, 'minute')
          .toDate()

        if (dayjs(time).isAfter(from, 'day')) return

        return (
          <li key={i}>
            <Card onClick={onSelect ? () => onSelect(time) : undefined}>
              {
                <span className='flex items-center justify-between'>
                  <span className='text-sm font-semibold'>{dayjs(time).format(TIME_FORMAT)}</span>
                  {showDuration && startTimeOfDuration && <Duration from={startTimeOfDuration} to={time} />}
                </span>
              }
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
