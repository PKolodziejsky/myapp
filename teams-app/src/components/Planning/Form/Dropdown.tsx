import { ArrowLeftIcon, CloseIcon, ContextMenuController, MapIcon, RoundIconButton } from '@seatti-tech/lithium'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

import { getSpaceChildrenWithStatusRequest } from '../../../api'
import { userState } from '../../../store'
import { Booking, Medium, Space, SpaceKind } from '../../../types'
import { toKey } from '../../../utilities'
import { FloorplanButton } from '../../FloorplanButton'
import { SkeletonSpaceList, SpaceList, SpaceSelector } from '../../Space'
import { Floorplan } from './Floorplan'

interface DropdownProps {
  space: Space
  date: Date
  openFloorplanSpaceId: string | null
  setOpenFloorplanSpaceId: (spaceId: string | null) => void
  defaultSelection?: Space
  onSelect?: (space: Space) => void
  isLeaf: boolean
  onCancel: () => void
  setSpaceError?: (err: string | null) => void
  spaceError: string | null
  lastBooking?: Booking
}

export const Dropdown = ({
  space,
  date,
  openFloorplanSpaceId,
  setOpenFloorplanSpaceId,
  defaultSelection,
  onSelect,
  isLeaf,
  onCancel,
  setSpaceError,
  spaceError,
  lastBooking,
}: DropdownProps) => {
  const { t } = useTranslation()
  const [selectedOption, setSelectedOption] = useState<Space>()
  const currentUser = useRecoilValue(userState)
  const isFloorplanOpen = openFloorplanSpaceId === space.id

  useEffect(() => setSelectedOption(defaultSelection), [defaultSelection])

  const { data: { spaceChildren = [] } = {}, isLoading } = useQuery(['spaceChildren', SpaceKind.WORKSPACE, space, date], () =>
    getSpaceChildrenWithStatusRequest({ id: space ? space.id : null, date: toKey(date) }),
  )
  const { floorPlans: media } = space
  const medium: Medium | null | undefined = media === null || !media.length ? null : media[0]

  const defaultSpace = spaceChildren.find(space => space.id === defaultSelection?.id)

  let errorMessage: string | undefined
  if (isLeaf) errorMessage = spaceError ?? undefined

  if (setSpaceError) {
    if (
      defaultSpace &&
      defaultSpace.id === selectedOption?.id &&
      defaultSpace.capacity === 1 &&
      defaultSpace.status?.occupation === 1 &&
      defaultSpace.status?.users?.[0].id !== currentUser?.id
    ) {
      if (lastBooking && lastBooking.space.id === defaultSpace.id) {
        setSpaceError(t('application.planning.last-space-already-booked', { space: selectedOption.name }))
      } else {
        setSpaceError(t('application.planning.space-capacity-reached-error'))
      }
    } else setSpaceError(null)
  }

  return (
    <div className='w-full flex flex-col items-center space-y-2'>
      {medium && isFloorplanOpen && (
        <div className='hidden md:block'>
          <Floorplan medium={medium} onClose={() => setOpenFloorplanSpaceId(null)} />
        </div>
      )}
      {medium && (
        <FloorplanButton
          className='hidden md:flex self-end'
          isOpen={isFloorplanOpen}
          onClick={() => setOpenFloorplanSpaceId(isFloorplanOpen ? null : space.id)}
        />
      )}
      <ContextMenuController
        alignment='center'
        className='w-full'
        selector={toggle => <SpaceSelector selectedSpace={selectedOption} errorMessage={errorMessage} onClick={toggle} />}
      >
        {toggle => (
          <div className='fixed top-0 left-0 md:static bg-white dark:bg-grey-900 h-full flex flex-col space-y-6 md:space-y-0 w-full md:w-[540px] z-10 py-2 md:py-0'>
            <header className='w-full md:hidden flex justify-between items-center space-x-8 px-4 md:px-0'>
              <div className='flex space-x-2 md:space-x-0 items-center'>
                <RoundIconButton
                  className='md:hidden'
                  variant='ghost'
                  onClick={!space.hasChildren ? onCancel : () => onSelect && onSelect(space)}
                >
                  {!space.hasChildren ? <CloseIcon /> : <ArrowLeftIcon />}
                </RoundIconButton>
                <div className='flex flex-col'>
                  <h2 className='text-h5 font-semibold'>{space.name}</h2>
                  <p className='text-grey-600 dark:text-grey-500'>{dayjs(date).format('dddd, D MMMM')}</p>
                </div>
              </div>
              <RoundIconButton
                className='md:hidden'
                active={isFloorplanOpen}
                onClick={event => {
                  event.stopPropagation()
                  setOpenFloorplanSpaceId(isFloorplanOpen ? null : space.id)
                }}
              >
                <MapIcon />
              </RoundIconButton>
            </header>
            {medium && isFloorplanOpen && (
              <div className='block md:hidden w-full px-4'>
                <Floorplan medium={medium} onClose={() => setOpenFloorplanSpaceId(null)} />
              </div>
            )}
            <div className='w-full md:w-[540px] md:max-h-[344px] overflow-y-auto'>
              {isLoading ? (
                <SkeletonSpaceList />
              ) : (
                <SpaceList
                  className='p-4'
                  spaces={spaceChildren}
                  selectedSpace={selectedOption}
                  onSelect={space => {
                    setSelectedOption(space)
                    if (onSelect) {
                      onSelect(space)
                      toggle()
                    }
                  }}
                />
              )}
            </div>
          </div>
        )}
      </ContextMenuController>
    </div>
  )
}
