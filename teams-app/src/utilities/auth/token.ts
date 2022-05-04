import { getBrowserAccessToken } from './browser'
import { getTeamsAccessToken, isTeamsAvailable } from './teams'

const isTeams = isTeamsAvailable()

export const getAccessToken = isTeams ? getTeamsAccessToken : getBrowserAccessToken
