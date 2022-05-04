import { useRecoilValue } from 'recoil'

import { queryClient } from '../request'
import { temporaryMeetupFiltersState } from '../store'
import { CustomUserSetting } from '../types/User'
import { useCustomUserSetting } from './useCustomUserSetting'

const onMutationSuccess = () => {
  queryClient.invalidateQueries(['user'])
  queryClient.invalidateQueries(['bookings'])
  queryClient.invalidateQueries(['spaceChildren'])
}

export const useTeamFilterState = () => {
  const { data, mutate } = useCustomUserSetting({
    key: CustomUserSetting.TeamFilter,
    onMutationSuccess,
    initialData: [] as string[],
  })

  return {
    teamFilter: data,
    setTeamFilter: (value: typeof data) => mutate(value),
  }
}

export const useSpaceFilterState = () => {
  const { data, mutate } = useCustomUserSetting({
    key: CustomUserSetting.SpaceFilter,
    onMutationSuccess,
    initialData: [] as string[],
  })

  return {
    spaceFilter: data,
    setSpaceFilter: (value: typeof data) => mutate(value),
  }
}

export const useFavoriteFilterState = () => {
  const { data, mutate } = useCustomUserSetting({
    key: CustomUserSetting.FavoriteFilter,
    onMutationSuccess,
    initialData: null,
  })

  return {
    favoriteFilterIsUndefined: data === null,
    favoriteFilter: data,
    setFavoriteFilter: (value: typeof data) => mutate(value),
  }
}

export const useMeetupFiltersState = () => {
  const filters = useRecoilValue(temporaryMeetupFiltersState)

  return {
    ...useTeamFilterState(),
    ...useSpaceFilterState(),
    ...useFavoriteFilterState(),
    searchQuery: filters.searchQuery,
  }
}
