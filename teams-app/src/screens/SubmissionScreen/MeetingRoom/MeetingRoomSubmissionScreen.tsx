import classNames from 'classnames'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

import { createMeetingRoomBookingRequest, getMeetingRoomsRequest } from '../../../api'
import { toMeetingRoomBookingInput, toMeetingRoomInput } from '../../../api/utils/meeting-room'
import { MeetingRoomList, MeetingRoomListSkeleton } from '../../../components/MeetingRoom'
import {
  ChangeMeetingRoomCriteriaMessage,
  NoMeetingRoomWithNameMessage,
  NoSuggestedMeetingRoomsMessage,
} from '../../../components/Messages'
import { TimeRangePicker } from '../../../components/TimeRangePicker'
import { DEFAULT_MINUTE_INTERVAL } from '../../../components/TimeRangePicker/constants'
import { queryClient } from '../../../request'
import { MeetingRoomFilter, OpenMeetingRoomBookingData, activeMeetingRoomFilterState, meetingRoomFiltersState } from '../../../store'
import { hasMeetingRoomFiltersState } from '../../../store/selectors/meetingRoom'
import { DateTimeRange, MeetingRoomBooking } from '../../../types'
import { TIMEZONE, TODAY, nextHalfHour, nextHalfHourOnDate, toKey, toLocalISOString } from '../../../utilities'
import { SubmissionScreenProps } from '../Generic'
import { FilterSection } from './FilterSection'

export const MeetingRoomSubmissionScreen = ({
  bookingData,
  rootSpace,
  date,
  onChange,
  onSuccess,
  className,
  setCanBook,
  setSubmit,
}: SubmissionScreenProps<OpenMeetingRoomBookingData>) => {
  const { t } = useTranslation()

  const dateKey = toKey(date)

  const activeFilter = useRecoilValue(activeMeetingRoomFilterState)
  const filters = useRecoilValue(meetingRoomFiltersState)
  const { minCapacity, searchQuery, includeUnavailable } = useMemo(() => filters, [filters])

  const hasFilters = useRecoilValue(hasMeetingRoomFiltersState)

  const [from, setFrom] = useState<Date>(dayjs(date).isSame(TODAY, 'day') ? nextHalfHour() : nextHalfHourOnDate(date))
  const [to, setTo] = useState<Date>(dayjs(from).add(DEFAULT_MINUTE_INTERVAL, 'minute').toDate())

  const dateTimeRange = useMemo<DateTimeRange>(
    () => ({
      start: {
        dateTime: toLocalISOString(from),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: toLocalISOString(to),
        timeZone: TIMEZONE,
      },
    }),
    [from, to],
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onChange({ dateTimeRange }), [dateTimeRange])

  const { data: { findMeetingRooms = [] } = {}, isLoading } = useQuery(['meetingRooms', dateTimeRange, activeFilter, filters], () =>
    getMeetingRoomsRequest({
      input: toMeetingRoomInput(activeFilter, filters, dateTimeRange),
    }),
  )

  const meetingRooms = useMemo(
    () =>
      hasFilters ? findMeetingRooms : findMeetingRooms.filter(room => room.room?.isFavorite && (room.isAvailable || includeUnavailable)),
    [findMeetingRooms, hasFilters, includeUnavailable],
  )

  useEffect(() => {
    let cannotBook = false
    const selectedMeetingRoom = meetingRooms.find(meetingRoom => meetingRoom.room.id === bookingData.room?.id)

    if (!bookingData.room) cannotBook = true
    else if (!selectedMeetingRoom?.isAvailable) cannotBook = true

    setCanBook(!cannotBook)
  }, [bookingData, meetingRooms, setCanBook])

  const { mutate: addBooking } = useMutation(createMeetingRoomBookingRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['meetingRoomBookings', dateKey])
      if (onSuccess) onSuccess()
    },
  })

  useEffect(() => {
    setSubmit(() => () => {
      const subject = t('application.meeting.event-title', { name: bookingData.room?.name })

      const input = toMeetingRoomBookingInput(subject, bookingData as MeetingRoomBooking)
      addBooking({ input })
    })
  }, [addBooking, bookingData, setSubmit, t])

  const [content, setContent] = useState<JSX.Element | null>(<NoSuggestedMeetingRoomsMessage />)

  useEffect(() => {
    if (isLoading) {
      setContent(<MeetingRoomListSkeleton className='w-full md:w-[540px] px-4 md:px-0' />)
    } else if (meetingRooms.length > 0) {
      setContent(
        <MeetingRoomList
          className='w-full md:w-[540px] px-4 md:px-0'
          onSelect={room => {
            if (room.id === bookingData.room?.id) onChange({ room: undefined })
            else onChange({ room })
          }}
          selectedId={bookingData.room?.id}
          items={meetingRooms}
        />,
      )
    } else {
      if (activeFilter === MeetingRoomFilter.SEARCH) {
        if (searchQuery) setContent(<NoMeetingRoomWithNameMessage />)
        else setContent(null)
      } else if (activeFilter === MeetingRoomFilter.OTHERS && minCapacity && minCapacity > 0)
        setContent(<ChangeMeetingRoomCriteriaMessage capacity={minCapacity} />)
      else setContent(<NoSuggestedMeetingRoomsMessage />)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, minCapacity, searchQuery !== undefined, isLoading, bookingData])

  return (
    <div
      className={classNames('w-full flex flex-col items-center space-y-6 md:space-y-8 overflow-y-auto md:overflow-y-visible', className)}
    >
      <TimeRangePicker
        className='w-full md:w-[540px] px-4 md:px-0'
        from={from}
        to={to}
        onSave={(from, to) => {
          setFrom(from)
          setTo(to)
        }}
      />
      <FilterSection
        date={date}
        rootSpace={rootSpace}
        count={includeUnavailable ? meetingRooms.length : meetingRooms.filter(room => room.isAvailable).length}
      />
      {content}
    </div>
  )
}
