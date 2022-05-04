import { BookingCard, ButtonListEntry, DeleteIcon, EditIcon } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'

import { deleteBookingRequest } from '../../api'
import { queryClient } from '../../request'
import { useCreateOpenBooking } from '../../store'
import { Booking, SpaceKind } from '../../types'
import { dayHasPassed, toKey } from '../../utilities'
import { BookingDeletedSuccessfullyMessage, DeleteBookingConfirmationMessage } from '../Messages'

interface ItemProps {
  booking: Booking
  onEdit: () => void
  onDelete: () => void
}

export const Item = ({ booking, onEdit, onDelete }: ItemProps) => {
  const { t } = useTranslation()

  const { isAnonymous, guestInfo, space, note } = booking
  const { canHaveNote, name, rootPath } = space

  const isPast = dayHasPassed(booking.date)
  const spaces = rootPath?.map(space => space.name).slice(0, -1)

  const options = [
    <ButtonListEntry icon={<EditIcon />} onClick={onEdit}>
      {t('application.planning.edit')}
    </ButtonListEntry>,
    <DeleteBookingConfirmationMessage
      selector={toggle => (
        <ButtonListEntry icon={<DeleteIcon />} onClick={toggle}>
          {t('application.planning.delete')}
        </ButtonListEntry>
      )}
      onConfirm={onDelete}
      className='w-full'
    />,
  ]

  return (
    <BookingCard
      kind='workspace'
      name={name}
      spaces={spaces && spaces.length > 0 ? spaces : canHaveNote && note ? [note] : undefined}
      timeslot={t('application.planning.all-day')}
      options={isPast ? undefined : options}
      onBehalfOf={guestInfo ?? undefined}
      anonymous={isAnonymous}
    />
  )
}

interface ListProps {
  bookings: Booking[]
  onEditBooking: (booking: Booking) => void
  onDeleteBooking: (booking: Booking) => void
}

const List = ({ bookings, onEditBooking, onDeleteBooking }: ListProps) => (
  <ul className='w-full flex flex-col space-y-2 md:space-y-4 items-center'>
    {bookings.map(booking => (
      <li className='w-full' key={booking.id}>
        <Item booking={booking} onEdit={() => onEditBooking(booking)} onDelete={() => onDeleteBooking(booking)} />
      </li>
    ))}
  </ul>
)

const MESSAGE_TIMEOUT_IN_MS = 2000

enum Message {
  NONE,
  DELETE,
}

interface BookingListProps {
  date: Date
  bookings: Booking[]
  className?: string
}

export const WorkspaceBookingList = ({ date, bookings, className }: BookingListProps) => {
  const dateKey = toKey(date)

  const [message, setMessage] = useState<Message>(Message.NONE)
  const hasMessage = useMemo(() => message !== Message.NONE, [message])
  const closeMessage = useCallback(() => setMessage(Message.NONE), [setMessage])

  const createOpenBooking = useCreateOpenBooking(dateKey)
  const onEditBooking = (booking: Booking) =>
    createOpenBooking({ data: booking, spaceKind: SpaceKind.WORKSPACE, context: { rootSpace: booking.space.rootPath?.[0] } })

  const { mutate: deleteBooking } = useMutation(deleteBookingRequest, {
    onSuccess: () => {
      setMessage(Message.DELETE)
      setTimeout(() => {
        closeMessage()
        queryClient.invalidateQueries(['personalBookings'])
        queryClient.invalidateQueries(['bookingStats'])
      }, MESSAGE_TIMEOUT_IN_MS)
    },
  })
  const onDeleteBooking = (booking: Booking) => deleteBooking({ id: booking.id })

  return (
    <section className={classNames('w-full flex flex-col items-center gap-y-6 md:gap-y-10', className)}>
      <List bookings={bookings} onEditBooking={onEditBooking} onDeleteBooking={onDeleteBooking} />
      {hasMessage && <BookingDeletedSuccessfullyMessage onClose={closeMessage} />}
    </section>
  )
}
