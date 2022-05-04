import { HttpMethod, TeamsMsal2Config } from '@microsoft/mgt'

import { CLIENT_ID, GRAPH_SCOPES } from './constants'

const redirectUriSSO = `${window.location.origin}/auth2`

export const browserMsal2Config = {
  clientId: CLIENT_ID,
  redirectUri: redirectUriSSO,
  scopes: GRAPH_SCOPES,
}

export const teamsMsal2Config: TeamsMsal2Config = {
  clientId: CLIENT_ID,
  authPopupUrl: redirectUriSSO,
  scopes: ['https://graph.microsoft.com/.default'],
  httpMethod: HttpMethod.POST,
  autoConsent: true,
}
