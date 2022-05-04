import { CalendarIcon, ContextMenuController, DatePicker } from '@seatti-tech/lithium'
import React from 'react'

import { FormatDate } from '../Date/FormatDate'

interface DateButtonProps {
  date: Date
  onClick?: () => void
}

const DateButton = ({ date, onClick }: DateButtonProps) => (
  <button onClick={onClick} className='group flex items-center gap-2 font-semibold text-sm'>
    <FormatDate date={date} format='MMM' />
    <span className='transition text-grey-500 dark:text-grey-600 group-hover:text-pink-600'>
      <CalendarIcon />
    </span>
  </button>
)

interface CalendarButtonProps {
  date: Date
  onSelectDate: (date: Date) => void
}

export const CalendarButton = ({ date, onSelectDate }: CalendarButtonProps) => (
  <ContextMenuController selector={onClick => <DateButton date={date} onClick={onClick} />} alignment='left'>
    {onDismiss => (
      <div className='p-4 w-full md:w-80'>
        <DatePicker
          selected={date}
          onSelect={date => {
            onDismiss()
            onSelectDate(date)
          }}
        />
      </div>
    )}
  </ContextMenuController>
)
