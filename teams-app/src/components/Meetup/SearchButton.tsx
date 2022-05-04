import { Input, RoundIconButton, SearchIcon } from '@seatti-tech/lithium'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'

import { temporaryMeetupFiltersState } from '../../store'
import { InlinePopout } from '../InlinePopout'

interface SearchButtonProps {
  className?: string
  popoutClassName?: string
  popoutOffset?: number
}

export const SearchButton = (props: SearchButtonProps) => {
  const { t } = useTranslation()

  const [filters, setFilters] = useRecoilState(temporaryMeetupFiltersState)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const Selector = () => (
    <RoundIconButton
      variant={isOpen ? 'primary' : 'ghost'}
      onClick={() => {
        setFilters({
          ...filters,
          searchQuery: '',
        })
        setIsOpen(!isOpen)
      }}
      active={isOpen}
    >
      <SearchIcon />
    </RoundIconButton>
  )

  const Popout = () => (
    <Input
      autoFocus
      placeholder={t('application.planning.search-name-place-role')}
      value={filters.searchQuery}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        setFilters({
          ...filters,
          searchQuery: event.target.value,
        })
      }
      iconEnd={<SearchIcon className='text-brand-grey-900 dark:text-grey-300' />}
    />
  )

  return <InlinePopout selector={<Selector />} isOpen={isOpen} popout={<Popout />} {...props} />
}
