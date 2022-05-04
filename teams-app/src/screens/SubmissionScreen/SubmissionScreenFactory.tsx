import { Button } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

import { BookingFailedMessage, BookingSuccessfulMessage } from '../../components/Messages'
import { Header } from '../../components/Planning'
import { RootSpaceSelect } from '../../components/Planning/RootSpaceSelect'
import { useHasEnoughGuestBookings, useHasMeetingRooms, useHasPersonalBooking } from '../../hooks'
import {
  OpenMeetingRoomBookingData,
  OpenWorkspaceBookingData,
  openBookingsState,
  useCloseOpenBooking,
  useCreateOpenBooking,
  useUpdateOpenBooking,
  useUpdateOpenBookingData,
} from '../../store'
import { BookingOwner, Space, SpaceKind } from '../../types'
import { toKey } from '../../utilities'
import { useScrollLock } from './useScrollLock'
import { MeetingRoomSubmissionScreen, WorkspaceSubmissionScreen } from '.'

const MESSAGE_TIMEOUT_IN_MS = 2000

enum State {
  INIT,
  OPEN,
  SUCCESS,
  FAILURE,
}

interface SubmissionScreenFactoryProps {
  date: Date
  className?: string
}

export const SubmissionScreenFactory = ({ date, className }: SubmissionScreenFactoryProps) => {
  const { t } = useTranslation()

  const dateKey = toKey(date)
  const { [dateKey]: booking } = useRecoilValue(openBookingsState)
  const { spaceKind, context: { rootSpace } = {} } = booking

  const isEditing = spaceKind === SpaceKind.WORKSPACE && booking.data?.id !== undefined

  const [state, setState] = useState<State>(isEditing ? State.OPEN : State.INIT)

  const hasRootSpace = useMemo(() => booking.context?.rootSpace !== undefined, [booking.context])

  useEffect(() => {
    if (hasRootSpace) setState(State.OPEN)
    else setState(State.INIT)
  }, [hasRootSpace])

  const hasPersonalBooking = useHasPersonalBooking(date)
  const hasEnoughGuestBookings = useHasEnoughGuestBookings(date)
  const hasMeetingRooms = useHasMeetingRooms(rootSpace?.id)

  const possibleBookingOwners = useMemo(() => {
    const possibleBookingOwners = []

    const canCreatePersonalBooking = !hasPersonalBooking || spaceKind === SpaceKind.MEETING_ROOM
    const isEditingPersonalBooking = spaceKind === SpaceKind.WORKSPACE && booking.data?.guestInfo == null && isEditing

    if (canCreatePersonalBooking || isEditingPersonalBooking) possibleBookingOwners.push(BookingOwner.SELF)

    const canCreateGuestBooking = !hasEnoughGuestBookings && spaceKind === SpaceKind.WORKSPACE
    const isEditingGuestBooking = spaceKind === SpaceKind.WORKSPACE && booking.data?.guestInfo && isEditing

    if (canCreateGuestBooking || isEditingGuestBooking) possibleBookingOwners.push(BookingOwner.ON_BEHALF)

    return possibleBookingOwners
  }, [hasPersonalBooking, spaceKind, booking, isEditing, hasEnoughGuestBookings])

  const defaultBookingOwner = useMemo(
    () => (possibleBookingOwners.includes(BookingOwner.SELF) ? BookingOwner.SELF : BookingOwner.ON_BEHALF),
    [possibleBookingOwners],
  )

  const currentBookingOwner = useMemo(
    () =>
      spaceKind === SpaceKind.WORKSPACE && isEditing ? (booking.data?.guestInfo ? BookingOwner.ON_BEHALF : BookingOwner.SELF) : undefined,
    [booking.data, isEditing, spaceKind],
  )

  const [bookingOwner, setBookingOwner] = useState<BookingOwner>()

  useEffect(() => {
    setBookingOwner(currentBookingOwner ?? defaultBookingOwner)
  }, [defaultBookingOwner, currentBookingOwner])

  const possibleSpaceKinds = useMemo(() => {
    const possibleSpaceKinds = [SpaceKind.WORKSPACE]

    const canBookMeetingRoom = hasMeetingRooms
    if (canBookMeetingRoom) possibleSpaceKinds.push(SpaceKind.MEETING_ROOM)

    return possibleSpaceKinds
  }, [hasMeetingRooms])

  const createOpenBooking = useCreateOpenBooking(dateKey)
  const updateOpenBooking = useUpdateOpenBooking(dateKey)
  const updateOpenBookingData = useUpdateOpenBookingData(dateKey)
  const closeOpenBooking = useCloseOpenBooking(dateKey)

  const onSelectRootSpace = useCallback(
    (space: Space) => {
      updateOpenBooking({
        context: { rootSpace: space },
        data: spaceKind === SpaceKind.WORKSPACE ? { space } : {},
      })
      setState(State.OPEN)
    },
    [spaceKind, updateOpenBooking],
  )

  const setSpaceKind = useCallback((spaceKind: SpaceKind) => createOpenBooking({ spaceKind }), [createOpenBooking])

  const onResetRootSpace = useCallback(() => {
    updateOpenBooking({
      context: { rootSpace: undefined },
      data: spaceKind === SpaceKind.WORKSPACE ? { space: undefined } : {},
    })
    setState(State.INIT)
  }, [spaceKind, updateOpenBooking])

  const onSuccess = () => {
    setState(State.SUCCESS)
    setTimeout(closeOpenBooking, MESSAGE_TIMEOUT_IN_MS)
  }

  const onFailure = () => {
    setState(State.FAILURE)
    setTimeout(closeOpenBooking, MESSAGE_TIMEOUT_IN_MS)
  }

  useEffect(() => {
    if (spaceKind !== SpaceKind.WORKSPACE) return

    const data: OpenWorkspaceBookingData = {}

    if (bookingOwner === BookingOwner.ON_BEHALF && booking.data?.isAnonymous !== undefined) data.isAnonymous = undefined

    updateOpenBooking({ data })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingOwner, spaceKind])

  const [canBook, setCanBook] = useState<boolean>(false)
  const [submit, setSubmit] = useState<() => void>()

  let content
  const isActionable = useMemo(() => [State.INIT, State.OPEN].includes(state), [state])

  useScrollLock(true, 'submission-scroll-lock')

  switch (state) {
    case State.SUCCESS:
      content = <BookingSuccessfulMessage className={classNames('md:mx-auto', className)} />
      break
    case State.FAILURE:
      content = <BookingFailedMessage className={classNames('md:mx-auto', className)} onBack={closeOpenBooking} />
      break
    case State.OPEN:
      switch (spaceKind) {
        case SpaceKind.MEETING_ROOM:
          content = (
            <MeetingRoomSubmissionScreen
              bookingData={booking.data as OpenMeetingRoomBookingData}
              date={date}
              rootSpace={rootSpace}
              onChange={updateOpenBookingData}
              onCancel={closeOpenBooking}
              onSuccess={onSuccess}
              onFailure={onFailure}
              className={className}
              setSubmit={setSubmit}
              setCanBook={setCanBook}
            />
          )
          break
        default:
          content = (
            <WorkspaceSubmissionScreen
              bookingData={booking.data as OpenWorkspaceBookingData}
              date={date}
              rootSpace={rootSpace}
              onChange={updateOpenBookingData}
              onCancel={closeOpenBooking}
              onSuccess={onSuccess}
              onFailure={onFailure}
              className={className}
              setSubmit={setSubmit}
              setCanBook={setCanBook}
              isGuestBooking={bookingOwner === BookingOwner.ON_BEHALF}
            />
          )
      }
      break
    default:
      content = <RootSpaceSelect date={date} onSelect={onSelectRootSpace} kind={spaceKind} className='p-4 md:w-[572px] overflow-y-auto' />
  }

  return (
    <div
      className={classNames(
        'w-full flex flex-col items-center space-y-6 bg-white dark:bg-grey-900 fixed inset-0 md:static py-2 z-10',
        className,
      )}
    >
      {isActionable && (
        <Header
          date={date}
          isEditing={isEditing}
          rootSpace={rootSpace}
          onResetRootSpace={onResetRootSpace}
          spaceKind={spaceKind}
          onSetSpaceKind={setSpaceKind}
          spaceKindOptions={possibleSpaceKinds}
          bookingOwner={bookingOwner}
          onSetBookingOwner={setBookingOwner}
          bookingOwnerOptions={possibleBookingOwners}
          onCancel={closeOpenBooking}
          canBook={canBook}
          onSubmit={submit}
        />
      )}
      {content}
      {isActionable && (
        <div className='hidden md:flex justify-center space-x-4'>
          <Button variant='secondary' onClick={closeOpenBooking}>
            {t('application.planning.cancel')}
          </Button>
          <Button className='transition' disabled={!canBook} onClick={submit}>
            {t('application.planning.book')}
          </Button>
        </div>
      )}
    </div>
  )
}
