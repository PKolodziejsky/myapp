import { Team } from '@microsoft/microsoft-graph-types'
import { gql } from 'graphql-request'

import { graphClient } from '../request'

export const GET_JOINED_TEAMS = gql`
  query GetJoinedTeams {
    joinedTeams {
      id
      displayName
      description
    }
  }
`

type GetJoinedTeamsResult = {
  [key: string]: Team[]
}

export const getJoinedTeamsRequest = (): Promise<GetJoinedTeamsResult> => {
  return graphClient.request(GET_JOINED_TEAMS)
}
