import * as microsoftTeams from '@microsoft/teams-js'

const TEAMS_PROVIDER_INITIALIZE_TIMEOUT = 5000

export const getTeamsAccessToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    microsoftTeams.authentication.getAuthToken({
      successCallback: token => resolve(token),
      failureCallback: () => reject(null),
    })
  })
}

export const isTeamsAvailable = () => {
  if (window.parent === window.self && window.nativeInterface) {
    return true
  }

  return window.name === 'embedded-page-container' || window.name === 'extension-tab-frame'
}

export const initializeTeams = (): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    const timeout = setTimeout(() => reject(), TEAMS_PROVIDER_INITIALIZE_TIMEOUT)

    microsoftTeams.initialize(() => {
      clearTimeout(timeout)

      resolve(true)
    })
  })
}
