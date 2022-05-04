import { Input } from '@seatti-tech/lithium'
import dayjs from 'dayjs'
import React from 'react'

import { TIME_FORMAT, getHour, getMinute } from '../../../utilities'
import { DEFAULT_MINUTE_INTERVAL } from '../constants'
import { Duration } from './Duration'
import { TimeSelect } from './TimeSelect'

export interface TimeInputProps {
  time: Date
  selectStartTime: Date
  startTimeOfDuration?: Date
  showDuration?: boolean
  minuteInterval?: number
  onChange?: (time: Date) => void
  errorMessage?: string
  label?: string
  autoFocus?: boolean
}

export const TimeInput = ({
  time,
  selectStartTime,
  startTimeOfDuration,
  showDuration,
  minuteInterval = DEFAULT_MINUTE_INTERVAL,
  onChange,
  errorMessage,
  ...props
}: TimeInputProps) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return

    const newTime = event.target.value
    if (!newTime) return

    const hour = Number(getHour(newTime))
    const minute = Number(getMinute(newTime))

    const newDate = dayjs(time).startOf('day').add(hour, 'hour').add(minute, 'minute').toDate()

    onChange(newDate)
  }

  return (
    <div className='w-full flex-1 flex flex-col space-y-1 md:h-[228px]'>
      <div className='w-full px-1 md:px-4'>
        <Input
          type='time'
          variant={!errorMessage ? 'default' : 'error'}
          value={dayjs(time).format(TIME_FORMAT)}
          onChange={onInputChange}
          iconEnd={
            showDuration &&
            startTimeOfDuration &&
            dayjs(time).diff(startTimeOfDuration) > 0 && <Duration className='mt-1' from={startTimeOfDuration} to={time} />
          }
          required // https://bugzilla.mozilla.org/show_bug.cgi?id=1479708
          errorMessage={errorMessage}
          {...props}
        />
      </div>
      <TimeSelect
        className='px-1 md:px-4 py-4 overflow-y-scroll'
        showDuration={showDuration}
        startTimeOfDuration={startTimeOfDuration}
        minuteInterval={minuteInterval}
        from={selectStartTime}
        onSelect={onChange}
      />
    </div>
  )
}
