import { Checkbox } from '@seatti-tech/lithium'
import React from 'react'

type FilterListEntryProps = {
  id: string
  selected: boolean
  text: string
  count?: number
  onClick: () => void
}

export const FilterListEntry = ({ id, selected, text, count, onClick }: FilterListEntryProps) => (
  <li className='flex items-center space-x-4 justify-between w-full py-4 cursor-pointer' key={id} onClick={onClick}>
    <div className='flex space-x-4 items-center'>
      <span className='font-semibold'>{text}</span>
      {count !== undefined && <span className='italic text-grey-600 dark:text-grey-500'>{`(${count})`}</span>}
    </div>
    <Checkbox className='cursor-pointer' checked={selected} />
  </li>
)
