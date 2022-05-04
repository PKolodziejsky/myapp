import { Button, ContextMenuController, DropdownIcon } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'

import { useTranslateEquipment } from '../../../hooks'
import { meetingRoomFiltersState } from '../../../store'
import { Equipment } from '../../../types'
import { EquipmentListEntry } from './EquipmentFilterListEntry'

const AllEquipments = Object.values(Equipment)

interface EquipmentFilterProps {
  className?: string
}

export const EquipmentFilter = ({ className }: EquipmentFilterProps) => {
  const { t } = useTranslation()
  const translateEquipment = useTranslateEquipment()

  const [{ equipments }, setFilters] = useRecoilState(meetingRoomFiltersState)

  const check = useCallback(
    (equipment: Equipment) => {
      const newEquipments = [...equipments]

      if (equipments.includes(equipment)) {
        const index = newEquipments.indexOf(equipment)
        newEquipments.splice(index, 1)
      } else newEquipments.push(equipment)

      setFilters(filters => ({
        ...filters,
        equipments: newEquipments,
      }))
    },
    [equipments, setFilters],
  )

  const reset = useCallback(() => setFilters(filters => ({ ...filters, equipments: [] })), [setFilters])

  return (
    <ContextMenuController
      alignment='right'
      selector={toggle => (
        <button
          className='w-full text-sm leading-4 py-3.5 px-4 flex items-center justify-between rounded-2xl border border-purple-600 dark:border-purple-400 bg-white dark:bg-grey-900'
          onClick={toggle}
        >
          <span
            className={classNames('flex items-center space-x-3', {
              'text-grey-600': equipments.length === 0,
            })}
          >
            {equipments.length > 0
              ? equipments.map(equipment => translateEquipment(equipment)).join(', ')
              : t('application.meeting.any-equipment')}
          </span>
          <DropdownIcon width='16px' height='16px' />
        </button>
      )}
      className={className}
    >
      {toggle => (
        <ul className='w-full flex flex-col max-h-[420px] md:min-w-[375px] md:w-max px-0 py-4 space-y-4'>
          <li className='px-6 overflow-y-scroll'>
            <ul className='flex flex-col w-full divide-y divide-grey-200 dark:divide-grey-700'>
              {AllEquipments.map(equipment => (
                <EquipmentListEntry
                  id={equipment}
                  checked={equipments.includes(equipment)}
                  equipment={equipment}
                  onClick={() => {
                    check(equipment)
                  }}
                />
              ))}
            </ul>
          </li>
          <li className='px-6 h-fit w-full'>
            <ul className='w-full flex justify-center items-center space-x-2'>
              <li>
                <Button variant='secondary' onClick={reset}>
                  {t('application.planning.clear-all')}
                </Button>
              </li>
              <li>
                <Button onClick={toggle}>{t('application.planning.done')}</Button>
              </li>
            </ul>
          </li>
        </ul>
      )}
    </ContextMenuController>
  )
}
