import { Input, RoundIconButton, SearchIcon } from '@seatti-tech/lithium'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'

import { InlinePopout } from '../../../components/InlinePopout'
import { meetingRoomFiltersState } from '../../../store'

interface SelectorProps {
  onClick?: () => void
  active?: boolean
}

const Selector = ({ active, onClick }: SelectorProps) => (
  <RoundIconButton variant={active ? 'primary' : 'ghost'} onClick={onClick} active={active}>
    <SearchIcon />
  </RoundIconButton>
)

interface PopoutProps {
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Popout = ({ value, onChange }: PopoutProps) => {
  const { t } = useTranslation()

  return (
    <Input
      autoFocus
      placeholder={t('application.meeting.start-typing-room-name')}
      value={value}
      onChange={onChange}
      iconEnd={<SearchIcon className='text-brand-grey-900 dark:text-grey-300' />}
    />
  )
}

interface SearchButtonProps {
  onClick?: () => void
  isOpen?: boolean
  className?: string
  popoutClassName?: string
  popoutOffset?: number
}

export const SearchButton = ({ onClick, isOpen, ...props }: SearchButtonProps) => {
  const [{ searchQuery }, setFilters] = useRecoilState(meetingRoomFiltersState)

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters(filters => ({
        ...filters,
        searchQuery: event.target.value,
      }))
    },
    [setFilters],
  )

  return (
    <InlinePopout
      selector={<Selector active={isOpen} onClick={onClick} />}
      isOpen={isOpen}
      popout={<Popout onChange={onChange} value={searchQuery} />}
      {...props}
    />
  )
}
