import { GraphQLClient } from 'graphql-request'

import { API_ENDPOINT } from '../config/constants'
import { fetchClient } from './fetchClient'

export const graphClient = new GraphQLClient(API_ENDPOINT, {
  fetch: fetchClient,
})
