import { DeskIcon, MeetingIcon, RoundIconButton } from '@seatti-tech/lithium'
import React from 'react'

import { SpaceKind } from '../../types'

const AllSpaceKinds = Object.values(SpaceKind)

interface IconProps {
  value: SpaceKind
}

const Icon = ({ value }: IconProps) => {
  switch (value) {
    case SpaceKind.WORKSPACE:
      return <DeskIcon />
    case SpaceKind.MEETING_ROOM:
      return <MeetingIcon />
    default:
      return <DeskIcon />
  }
}

interface SpaceKindSelectProps {
  value: SpaceKind
  setValue: (newValue: SpaceKind) => void
  options?: SpaceKind[]
}

export const SpaceKindSelect = ({ value = SpaceKind.WORKSPACE, setValue, options = AllSpaceKinds }: SpaceKindSelectProps) => (
  <div className='flex space-x-2 items-center'>
    {options.map(option => {
      const selected = value === option

      return (
        <RoundIconButton
          variant='ghost'
          onClick={
            selected
              ? undefined
              : () => {
                  setValue(option)
                }
          }
          active={selected}
          key={option}
        >
          <Icon value={option} />
        </RoundIconButton>
      )
    })}
  </div>
)
