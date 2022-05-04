import classNames from 'classnames'
import { ClientError } from 'graphql-request'
import { GraphQLError } from 'graphql-request/dist/types'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'

import { createBookingRequest, getLastBookingRequest, getSpaceRootPathRequest, updateBookingRequest } from '../../../api'
import { toBookingInput } from '../../../api/utils/bookings'
import { AnonymousButton } from '../../../components/AnonymousButton'
import { Form } from '../../../components/Planning/Form'
import { GuestInfoInput } from '../../../components/Planning/GuestInfoInput'
import { ErrorToast } from '../../../components/Toast'
import { queryClient } from '../../../request'
import { OpenWorkspaceBookingData } from '../../../store'
import { Booking, Space } from '../../../types'
import { SubmissionScreenProps } from '../Generic'

export const WorkspaceSubmissionScreen = ({
  date,
  bookingData,
  rootSpace,
  onChange,
  onCancel,
  onSuccess,
  onFailure,
  className,
  setCanBook,
  setSubmit,
  isGuestBooking,
}: SubmissionScreenProps<OpenWorkspaceBookingData>) => {
  const { t } = useTranslation()

  const space = bookingData.space ?? rootSpace

  const [spaceError, setSpaceError] = useState<string | null>(null)

  const { data: { lastBooking } = {} } = useQuery(
    ['lastBooking', space?.id, isGuestBooking],
    () => getLastBookingRequest({ spaceId: space?.id ?? '', isGuestBooking }),
    {
      onSuccess: ({ lastBooking }) => {
        if (!lastBooking) return

        onChange({
          note: lastBooking.note,
          space: lastBooking.space ?? space?.id,
          guestInfo: isGuestBooking ? bookingData.guestInfo || lastBooking.guestInfo : null,
        })
      },
      enabled: bookingData.id === undefined,
    },
  )

  const { data: { spaceRootPath = [] } = {} } = useQuery(['rootPath', space?.id], () => getSpaceRootPathRequest({ id: space?.id ?? '' }), {
    keepPreviousData: true,
  })

  const handleError = (error: GraphQLError) => {
    switch (error.extensions.code) {
      case 'BOOKING_DATE_NOT_ALLOWED':
        toast.custom(<ErrorToast>{t('application.planning.booking-not-allowed-at-date-error')}</ErrorToast>, {
          id: error.extensions.code,
        })
        break
      case 'BOOKING_LIMIT_EXCEEDED':
        toast.custom(<ErrorToast>{t('application.planning.booking-limit-exceeded-error')}</ErrorToast>, {
          id: error.extensions.code,
        })
        break
      case 'SPACE_NOT_IN_COMPANY':
      case 'SPACE_NOT_ACCESSIBLE':
        toast.custom(<ErrorToast>{t('application.planning.space-not-found-error')}</ErrorToast>, {
          id: error.extensions.code,
        })
        break
      case 'SPACE_DISABLED':
        setSpaceError(t('application.planning.space-disabled-error'))
        break
      case 'CAPACITY_LIMIT_REACHED':
        setSpaceError(t('application.planning.space-capacity-reached-error'))
        break
      default:
        if (onFailure) onFailure()
    }
  }

  const { mutate: addBooking } = useMutation(createBookingRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings', bookingData.date])
      queryClient.invalidateQueries(['personalBookings'])
      queryClient.invalidateQueries(['bookingStats'])
      if (onSuccess) onSuccess()
    },
    onError: ({ response: { errors = [] } }: ClientError) => {
      setCanBook(false)
      errors.forEach(error => handleError(error))
    },
  })

  const { mutate: updateBooking } = useMutation(updateBookingRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings', bookingData.date])
      if (onSuccess) onSuccess()
    },
    onError: ({ response: { errors = [] } }: ClientError) => {
      errors.forEach(error => handleError(error))
    },
  })

  const leaf: Space | undefined = spaceRootPath.slice(-1).pop()

  useEffect(() => {
    let cannotBook = false

    if (leaf) cannotBook = leaf.hasChildren != null
    else cannotBook = true

    if (spaceError) cannotBook = true

    if (isGuestBooking && !bookingData.guestInfo) cannotBook = true

    setCanBook(!cannotBook)
  }, [isGuestBooking, bookingData, spaceError, leaf, setCanBook])

  const setAnonymous = (isAnonymous: boolean) => onChange({ isAnonymous })

  const setNote = (note: string | null) => onChange({ note })

  const onSelectSpace = (space: Space | null) => {
    setSpaceError(null)
    if (space) onChange({ space })
  }

  useEffect(() => {
    setSubmit(() => () => {
      setSpaceError(null)
      const bookingInput = toBookingInput(bookingData as Booking)
      if (bookingData.id) updateBooking({ id: bookingData.id, bookingInput })
      else addBooking({ bookingInput })
    })
  }, [addBooking, bookingData, setSubmit, updateBooking])

  return (
    <div
      className={classNames('w-full flex flex-col items-center space-y-6 md:space-y-8 overflow-y-auto md:overflow-y-visible', className)}
    >
      {isGuestBooking && (
        <div className='w-full md:w-[540px] px-4 md:px-0'>
          <GuestInfoInput
            autoFocus
            value={bookingData.guestInfo ?? undefined}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ guestInfo: event.target.value })}
          />
        </div>
      )}
      <Form
        rootPath={spaceRootPath}
        date={date}
        onNoteUpdate={setNote}
        defaultNote={bookingData.note ?? undefined}
        onSelectSpace={onSelectSpace}
        onCancel={onCancel}
        lastBooking={lastBooking}
        spaceError={spaceError}
        setSpaceError={setSpaceError}
      />
      {!isGuestBooking && (
        <AnonymousButton className='w-full md:w-[540px] px-4 md:px-0' onChange={setAnonymous} defaultChecked={bookingData.isAnonymous} />
      )}
    </div>
  )
}
