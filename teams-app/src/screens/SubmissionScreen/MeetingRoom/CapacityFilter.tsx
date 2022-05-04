import { Input } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'

import { meetingRoomFiltersState } from '../../../store'

const LOWEST_MIN_CAPACITY = 1

interface CapacityFilterProps {
  className?: string
}

export const CapacityFilter = ({ className }: CapacityFilterProps) => {
  const { t } = useTranslation()

  const [{ minCapacity }, setFilters] = useRecoilState(meetingRoomFiltersState)

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value: number | undefined

      if (event.target.value === '') value = undefined
      else value = event.target.valueAsNumber

      setFilters(filters => ({
        ...filters,
        minCapacity: value,
      }))
    },
    [setFilters],
  )

  return (
    <div className={classNames('w-full', className)}>
      <Input
        autoFocus
        type='number'
        placeholder={t('application.meeting.capacity')}
        min={LOWEST_MIN_CAPACITY}
        value={minCapacity}
        onChange={onChange}
      />
    </div>
  )
}
