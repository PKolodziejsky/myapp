import { Context } from '@microsoft/teams-js'
import * as microsoftTeams from '@microsoft/teams-js'

const TEAMS_GET_CONTEXT_TIMEOUT = 5000

export const getTeamsContext = () => {
  return new Promise<Context>((resolve, reject) => {
    const timeout = setTimeout(() => reject(), TEAMS_GET_CONTEXT_TIMEOUT)

    microsoftTeams.getContext(context => {
      clearTimeout(timeout)
      resolve(context)
    })
  })
}
