import { Checkbox } from '@seatti-tech/lithium'
import React from 'react'

import { Icon } from '../../../components/MeetingRoom/'
import { useTranslateEquipment } from '../../../hooks'
import { Equipment } from '../../../types'

interface LabelProps {
  equipment: Equipment
}

export const Label = ({ equipment }: LabelProps) => {
  const t = useTranslateEquipment()

  return <span className='font-semibold'>{t(equipment)}</span>
}

type EquipmentListEntryProps = {
  id: string
  checked: boolean
  equipment: Equipment
  onClick: () => void
}

export const EquipmentListEntry = ({ id, checked, equipment, onClick }: EquipmentListEntryProps) => {
  return (
    <li className='flex items-center space-x-4 justify-between w-full py-4 cursor-pointer' key={id} onClick={onClick}>
      <div className='flex space-x-4 items-center'>
        <Icon equipment={equipment} />
        <Label equipment={equipment} />
      </div>
      <Checkbox className='cursor-pointer' checked={checked} />
    </li>
  )
}
