import { ButtonListEntry, ContextMenuController, List, MyBookingIcon, OnBehalfBookingIcon, RoundIconButton } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { BookingOwner } from '../../types'

const AllBookingOwners = Object.values(BookingOwner)

interface IconProps {
  kind: BookingOwner
}

const Icon = ({ kind }: IconProps) => {
  switch (kind) {
    case BookingOwner.SELF:
      return <MyBookingIcon />
    case BookingOwner.ON_BEHALF:
      return <OnBehalfBookingIcon />
  }
}

interface BookingOwnerSelectProps {
  value?: BookingOwner
  setValue: (newValue: BookingOwner) => void
  options?: BookingOwner[]
}

export const BookingOwnerSelect = ({ value = BookingOwner.SELF, setValue, options = AllBookingOwners }: BookingOwnerSelectProps) => {
  const { t } = useTranslation()

  const getLabel = (value: BookingOwner) => {
    switch (value) {
      case BookingOwner.SELF:
        return t('application.planning.book-for-me')
      case BookingOwner.ON_BEHALF:
        return t('application.planning.book-for-someone')
    }
  }

  return (
    <ContextMenuController
      selector={toggle => (
        <RoundIconButton variant='ghost' onClick={toggle}>
          <Icon kind={value} />
        </RoundIconButton>
      )}
      alignment='right'
    >
      {toggle => (
        <List className='md:w-max'>
          {AllBookingOwners.map(option => {
            const icon = <Icon kind={option} />
            const label = getLabel(option)
            const selected = option === value
            const disabled = !options.includes(option)

            return (
              <ButtonListEntry
                className='md:w-full'
                icon={icon}
                selected={selected}
                disabled={disabled}
                onClick={
                  selected || disabled
                    ? undefined
                    : () => {
                        setValue(option)
                        toggle()
                      }
                }
                key={option}
              >
                {label}
              </ButtonListEntry>
            )
          })}
        </List>
      )}
    </ContextMenuController>
  )
}
