import { Button, CloseIcon, EditIcon, RoundIconButton } from '@seatti-tech/lithium'
import dayjs from 'dayjs'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { SpaceKindSelect } from '../../components/Planning/SpaceKindSelect'
import { BookingOwner, Space, SpaceKind } from '../../types'
import { BookingOwnerSelect } from './BookingOwnerSelect'

interface TitleProps {
  rootSpace?: Space
  onResetRootSpace?: () => void
}

const Title = ({ rootSpace, onResetRootSpace }: TitleProps) => {
  const { t } = useTranslation()

  return rootSpace ? (
    <div className='flex space-x-2 items-center'>
      <h2 className='text-h5 font-semibold'>{rootSpace.name}</h2>
      {onResetRootSpace && (
        <button className='text-grey-600 dark:text-grey-500' onClick={onResetRootSpace}>
          <EditIcon />
        </button>
      )}
    </div>
  ) : (
    <h2 className='text-h5 font-semibold'>{t('application.planning.add-booking')}</h2>
  )
}

interface SubtitleProps {
  date: Date
}

const Subtitle = ({ date }: SubtitleProps) => <p className='text-grey-600 dark:text-grey-500'>{dayjs(date).format('dddd, D MMMM')}</p>

interface HeaderProps {
  date: Date
  isEditing?: boolean
  rootSpace?: Space
  onResetRootSpace: () => void
  spaceKind: SpaceKind
  onSetSpaceKind: (value: SpaceKind) => void
  spaceKindOptions?: SpaceKind[]
  bookingOwner?: BookingOwner
  onSetBookingOwner: (value: BookingOwner) => void
  bookingOwnerOptions?: BookingOwner[]
  onSubmit?: () => void
  onCancel: () => void
  canBook: boolean
}

export const Header = ({
  date,
  isEditing,
  rootSpace,
  onResetRootSpace,
  spaceKind,
  onSetSpaceKind,
  spaceKindOptions,
  bookingOwner,
  onSetBookingOwner,
  bookingOwnerOptions,
  onSubmit,
  onCancel,
  canBook,
}: HeaderProps) => {
  const { t } = useTranslation()

  return (
    <header className='w-full flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0 md:space-x-10 px-4 md:px-0'>
      <div className='flex space-x-2 items-center justify-between'>
        <div className='flex space-x-2 md:space-x-0 items-center'>
          <RoundIconButton className='md:hidden' variant='ghost' onClick={onCancel}>
            <CloseIcon />
          </RoundIconButton>
          <div className='flex flex-col'>
            <Title rootSpace={rootSpace} onResetRootSpace={onResetRootSpace} />
            <Subtitle date={date} />
          </div>
        </div>
        <Button className='flex md:hidden' disabled={!canBook} onClick={onSubmit}>
          {t('application.planning.book')}
        </Button>
      </div>
      {rootSpace && (
        <div className='flex justify-between items-center space-x-2 divide-x divide-grey-300 dark:divide-grey-700'>
          {!isEditing && spaceKindOptions && spaceKindOptions?.length > 1 && (
            <SpaceKindSelect value={spaceKind} setValue={onSetSpaceKind} options={spaceKindOptions} />
          )}
          <div className='h-4 pl-2 flex items-center'>
            <BookingOwnerSelect value={bookingOwner} setValue={onSetBookingOwner} options={bookingOwnerOptions} />
          </div>
        </div>
      )}
    </header>
  )
}
