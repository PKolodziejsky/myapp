import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { queryClient } from '../request'
import { meetupDatesViewState, planningDatesViewState } from '../store'
import { DatesView } from '../types'
import { CustomUserSetting } from '../types/User'
import { useCustomUserSetting } from './useCustomUserSetting'

export enum ScreenType {
  MEETUP = 'meetup',
  PLANNING = 'planning',
}

const getRecoilState = (screen: ScreenType) => (screen === ScreenType.MEETUP ? meetupDatesViewState : planningDatesViewState)

const getCustomUserSettingKey = (screen: ScreenType) =>
  screen === ScreenType.MEETUP ? CustomUserSetting.MeetupView : CustomUserSetting.PlanningView

export const useScreenView = (screen: ScreenType) => {
  const [view, setView] = useRecoilState(getRecoilState(screen))

  const { data, mutate } = useCustomUserSetting({
    key: getCustomUserSettingKey(screen),
    initialData: view,
    onMutationSuccess: () => {
      queryClient.invalidateQueries(['user'])
    },
  })

  useEffect(() => setView(data), [data, setView])

  return {
    screenView: view,
    setScreenView: (value: DatesView) => mutate(value),
  }
}
