import { FilterIcon, RoundIconButton } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { InlinePopout } from '../../../components/InlinePopout'
import { meetingRoomFiltersState } from '../../../store'
import { Space } from '../../../types'
import { CapacityFilter } from './CapacityFilter'
import { EquipmentFilter } from './EquipmentFilter'
import { ShowUnavailableButton } from './ShowUnavailableButton'
import { SpaceFilter } from './SpaceFilter'

interface SelectorProps {
  onClick?: () => void
  active?: boolean
  count: number
}

const Selector = ({ active, onClick, count }: SelectorProps) => (
  <>
    <RoundIconButton variant={active ? 'primary' : 'ghost'} onClick={onClick} active={active}>
      <FilterIcon />
    </RoundIconButton>
    <span className='text-xs italic text-grey-600 dark:text-grey-500'>{`(${count})`}</span>
  </>
)

interface PopoutProps {
  date: Date
  rootSpace?: Space
}

const Popout = ({ date, rootSpace }: PopoutProps) => (
  <>
    <div className='flex flex-col md:flex-row gap-2'>
      <CapacityFilter className='w-full md:w-[140px]' />
      <EquipmentFilter className='w-full md:w-[400px]' />
    </div>
    <SpaceFilter date={date} rootSpace={rootSpace} />
    <ShowUnavailableButton />
  </>
)

interface FilterButtonProps {
  date: Date
  rootSpace?: Space
  onClick?: () => void
  isOpen?: boolean
  popoutClassName?: string
  popoutOffset?: number
  className?: string
}

export const FilterButton = ({ date, rootSpace, onClick, isOpen, popoutClassName, ...props }: FilterButtonProps) => {
  const { equipments, includeUnavailable, minCapacity, space } = useRecoilValue(meetingRoomFiltersState)

  const count = useMemo(() => {
    let count = 0
    if (equipments.length > 0) count += 1
    if (includeUnavailable) count += 1
    if (minCapacity !== undefined && minCapacity > 0) count += 1
    if (space) count += 1
    return count
  }, [equipments, includeUnavailable, minCapacity, space])

  return (
    <InlinePopout
      selector={<Selector active={isOpen} onClick={onClick} count={count} />}
      selectorClassName='flex items-center space-x-1'
      isOpen={isOpen}
      popout={<Popout date={date} rootSpace={rootSpace} />}
      popoutClassName={classNames('flex flex-col space-y-2', popoutClassName)}
      {...props}
    />
  )
}
