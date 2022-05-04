import lodash from 'lodash'
import { selector } from 'recoil'

import { Space } from '../../types'
import { toKey } from '../../utilities'
import { meetupRootSpacesState } from '../atoms'
import { meetupDateRangeState } from './dates'

export const meetupAllRootSpacesState = selector<Space[]>({
  key: 'meetupAllRootSpacesState',
  get: ({ get }) => {
    const dateRange = get(meetupDateRangeState)
    const rootSpaces = get(meetupRootSpacesState)
    const rootSpacesInDateRange: Space[] = []

    dateRange.forEach(date => {
      const rootSpacesByDay = rootSpaces[toKey(date)]
      if (!rootSpacesByDay) return

      rootSpacesByDay.forEach(rootSpace => {
        const existingRootSpace = rootSpacesInDateRange.find(_rootSpace => _rootSpace.id === rootSpace.id)

        if (!existingRootSpace) {
          rootSpacesInDateRange.push(lodash.cloneDeep(rootSpace))
          return
        }

        if (existingRootSpace.status && rootSpace.status) existingRootSpace.status.occupation += rootSpace.status?.occupation
      })
    })

    return rootSpacesInDateRange
  },
})
