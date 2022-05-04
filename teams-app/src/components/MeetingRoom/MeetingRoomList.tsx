import { MeetingRoomCard, SkeletonMeetingRoomCard } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'

import { addFavoriteMeetingRoomRequest, removeFavoriteMeetingRoomRequest } from '../../api'
import { queryClient } from '../../request'
import { meetingRoomFiltersState, userState } from '../../store'
import { MeetingRoom } from '../../types'
import { ErrorToast, InformationToast, SuccessToast } from '../Toast'
import { getEquipmentIconList } from './Equipment'

const COUNT_OF_PLACEHOLDER_CARDS = 3
const COUNT_OF_ITEMS_PER_PAGE = 3

interface MeetingRoomListSkeletonProps {
  count?: number
  className?: string
}

export const MeetingRoomListSkeleton = ({ count, className }: MeetingRoomListSkeletonProps) => (
  <ul className={classNames('w-full flex flex-col space-y-2 md:space-y-4', className)}>
    {Array.from(Array(count ?? COUNT_OF_PLACEHOLDER_CARDS).keys()).map(i => (
      <li className='w-full' key={i}>
        <SkeletonMeetingRoomCard />
      </li>
    ))}
  </ul>
)

interface MeetingRoomListItem {
  room: MeetingRoom
  isAvailable: boolean
}

type MeetingRoomListCompareItem = MeetingRoomListItem & { isSelected: boolean }

// source: https://codereview.stackexchange.com/questions/70314/elegant-way-to-sort-on-multiple-properties-that-might-be-undefineds
const compare = (a: MeetingRoomListCompareItem, b: MeetingRoomListCompareItem): number => {
  const compareProperty = (a: string | undefined, b: string | undefined) => {
    return a || b ? (!a ? 1 : !b ? -1 : a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })) : 0
  }

  return (
    compareProperty(b.isSelected.toString(), a.isSelected.toString()) ||
    compareProperty(b.room.isFavorite?.toString(), a.room.isFavorite?.toString()) ||
    compareProperty(b.isAvailable.toString(), a.isAvailable.toString()) ||
    compareProperty(a.room.capacity?.toString(), b.room.capacity?.toString()) ||
    compareProperty(a.room.name, b.room.name)
  )
}

interface MeetingRoomListProps {
  items: MeetingRoomListItem[]
  onSelect: (item: MeetingRoom) => void
  selectedId?: string
  className?: string
}

export const MeetingRoomList = ({ items, onSelect, selectedId, className }: MeetingRoomListProps) => {
  const { t } = useTranslation()

  const currentUser = useRecoilValue(userState)

  const { includeUnavailable } = useRecoilValue(meetingRoomFiltersState)
  const [page, setPage] = useState<number>(1)

  const { mutate: addFavorite } = useMutation(addFavoriteMeetingRoomRequest)
  const { mutate: removeFavorite } = useMutation(removeFavoriteMeetingRoomRequest)

  useEffect(() => {
    setPage(1)
  }, [includeUnavailable])

  const visibleItems = useMemo(() => {
    const favoriteMeetingRoomIds = currentUser?.favoriteMeetingRooms?.map(room => room.id) ?? []

    let visibleItems = items.map(item => ({
      ...item,
      isSelected: selectedId === item.room.id,
      room: {
        ...item.room,
        isFavorite: favoriteMeetingRoomIds?.includes(item.room.id) ?? false,
      },
    }))

    /* availability */
    if (!includeUnavailable) visibleItems = visibleItems.filter(item => item.isAvailable || item.isSelected)

    /* pagination */
    visibleItems = visibleItems.slice(0, page * COUNT_OF_ITEMS_PER_PAGE)

    /* sort */
    visibleItems = visibleItems.sort(compare)

    return visibleItems
  }, [currentUser, includeUnavailable, items, page, selectedId])

  const hasItemsToShow = useMemo(() => page * COUNT_OF_ITEMS_PER_PAGE < items.length, [items, page])

  return (
    <div className={classNames('flex flex-col items-end space-y-4 p-4', className)}>
      <ul className='w-full flex flex-col space-y-2 md:space-y-4'>
        {visibleItems.map(({ room, isAvailable, isSelected }) => {
          const { id, name, rootPath, capacity, isFavorite } = room

          return (
            <li className='w-full' key={id}>
              <MeetingRoomCard
                role={isAvailable ? 'button' : undefined}
                favorite={isFavorite}
                onClickFavorite={() => {
                  if (!room.id) return
                  if (!isFavorite)
                    addFavorite(
                      { id: room.id },
                      {
                        onSuccess: ({ addFavoriteMeetingRoom: isSuccess }) => {
                          if (isSuccess) {
                            queryClient.invalidateQueries('user')
                            toast.custom(
                              <SuccessToast>
                                {t('application.planning.name-added-to-favourites-success', { name: room.name })}
                              </SuccessToast>,
                            )
                          } else toast.custom(<ErrorToast>{t('application.planning.name-added-to-favourites-error')}</ErrorToast>)
                        },
                      },
                    )
                  else
                    removeFavorite(
                      { id: room.id },
                      {
                        onSuccess: ({ removeFavoriteMeetingRoom: isSuccess }) => {
                          if (isSuccess) {
                            queryClient.invalidateQueries('user')
                            toast.custom(
                              <InformationToast>
                                {t('application.planning.name-removed-from-favourites-success', { name: room.name })}
                              </InformationToast>,
                            )
                          }
                        },
                      },
                    )
                }}
                onClick={isAvailable ? () => onSelect(room) : undefined}
                selected={isSelected}
                name={name}
                spaces={rootPath.map(space => space.name)}
                capacity={capacity}
                available={isAvailable}
                equipments={getEquipmentIconList(room)}
              />
            </li>
          )
        })}
      </ul>
      {hasItemsToShow && (
        <button
          className='transition text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-300'
          onClick={() => setPage(page + 1)}
        >
          {t('application.meeting.show-more-rooms')}
        </button>
      )}
    </div>
  )
}
