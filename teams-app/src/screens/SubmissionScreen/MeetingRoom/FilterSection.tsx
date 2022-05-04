import classNames from 'classnames'
import React, { createRef, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState, useRecoilValue } from 'recoil'

import { queryClient } from '../../../request'
import { MeetingRoomFilter, activeMeetingRoomFilterState, meetingRoomFiltersState } from '../../../store'
import { Space } from '../../../types'
import { FilterButton } from './FilterButton'
import { SearchButton } from './SearchButton'

const Title = () => {
  const { t } = useTranslation()

  const activeFilter = useRecoilValue(activeMeetingRoomFilterState)

  const title = useMemo(
    () =>
      activeFilter === MeetingRoomFilter.SEARCH
        ? t('application.meeting.find-meeting-room')
        : t('application.meeting.suggested-meeting-rooms'),
    [activeFilter, t],
  )

  return <h2 className='text-h6 font-bold'>{title}</h2>
}

interface SubtitleProps {
  count?: number
}

const Subtitle = ({ count }: SubtitleProps) => {
  const { t } = useTranslation()

  const activeFilter = useRecoilValue(activeMeetingRoomFilterState)
  const { searchQuery } = useRecoilValue(meetingRoomFiltersState)

  const subtitle = useMemo(() => {
    let subtitle

    if (activeFilter === MeetingRoomFilter.SEARCH) {
      if (!searchQuery) subtitle = t('application.meeting.list-will-appear-while-typing')
      else {
        if (!count) subtitle = t('application.meeting.nothing-to-choose')
        else subtitle = t('application.meeting.you-can-choose-from', { count: count })
      }
    } else if (count && count > 0) {
      subtitle = t('application.meeting.count-available', { count: count })
    } else subtitle = t('application.meeting.select-your-requirements')

    return subtitle
  }, [activeFilter, count, searchQuery, t])

  return <p className='text-xs text-grey-600 dark:text-grey-500 italic'>{subtitle}</p>
}

interface FilterSectionProps {
  date: Date
  rootSpace?: Space
  className?: string
  count?: number
}

export const FilterSection = ({ date, rootSpace, className, count }: FilterSectionProps) => {
  const [activeFilter, setActiveFilter] = useRecoilState(activeMeetingRoomFilterState)

  const onClickFilter = useCallback(() => {
    switch (activeFilter) {
      case MeetingRoomFilter.OTHERS:
        setActiveFilter(MeetingRoomFilter.NONE)
        break
      default:
        queryClient.invalidateQueries(['meetingRooms'])
        setActiveFilter(MeetingRoomFilter.OTHERS)
    }
  }, [activeFilter, setActiveFilter])

  const onClickSearch = useCallback(() => {
    switch (activeFilter) {
      case MeetingRoomFilter.SEARCH:
        setActiveFilter(MeetingRoomFilter.NONE)
        break
      default:
        queryClient.resetQueries(['meetingRooms'])
        setActiveFilter(MeetingRoomFilter.SEARCH)
    }
  }, [activeFilter, setActiveFilter])

  const headerRef = createRef<HTMLElement>()
  const [headerHeight, setHeaderHeight] = useState<number>()

  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current?.offsetHeight)
  }, [headerRef])

  return (
    <section className='flex justify-between w-full md:w-[540px] px-4 md:px-0'>
      <header className='h-fit flex flex-col space-y-0.5' ref={headerRef}>
        <Title />
        <Subtitle count={count} />
      </header>
      <div className={classNames('flex space-x-2', className)}>
        <FilterButton
          date={date}
          rootSpace={rootSpace}
          onClick={onClickFilter}
          isOpen={activeFilter === MeetingRoomFilter.OTHERS}
          popoutClassName='w-screen md:w-[540px] pl-8 md:pl-0 -right-[52px]'
          popoutOffset={headerHeight}
        />
        <SearchButton
          onClick={onClickSearch}
          isOpen={activeFilter === MeetingRoomFilter.SEARCH}
          popoutClassName='w-screen md:w-[540px] pl-8 md:pl-0'
          popoutOffset={headerHeight}
        />
      </div>
    </section>
  )
}
