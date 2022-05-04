import React from 'react'

import { AllButton } from './AllButton'
import { FavoriteAndSpaceFilterButton } from './FavoriteAndSpaceFilterButton'
import { FavoriteFilterButton } from './FavoriteFilterButton'
import { SearchButton } from './SearchButton'
import { SpaceFilterSection } from './SpaceFilterSection'
import { TeamFilterButton } from './TeamFilterButton'

export const FiltersBar = () => (
  <section className='w-full flex items-start justify-between space-x-4'>
    <section className='hidden md:flex md:space-x-2'>
      <AllButton />
      <FavoriteFilterButton />
      <SpaceFilterSection />
    </section>
    <section className='!ml-0 flex md:hidden md:space-x-2'>
      <FavoriteAndSpaceFilterButton />
    </section>
    <section className='flex space-x-2'>
      <TeamFilterButton />
      <SearchButton popoutClassName='w-screen md:w-[460px] pl-8 md:pl-0' />
    </section>
  </section>
)
