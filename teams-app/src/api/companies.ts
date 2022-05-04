import { gql } from 'graphql-request'

import { graphClient } from '../request'
import { Company } from '../types'

export const COMPANY_SETTINGS_QUERY = gql`
  query GetCompanySettings {
    company {
      settings {
        booking {
          restrictions {
            defaults {
              future {
                value
                unit
              }
              past {
                value
                unit
              }
            }
            maxGuestBookings
          }
        }
        visibility {
          restrictions {
            defaults {
              future {
                value
                unit
              }
              past {
                value
                unit
              }
            }
          }
        }
      }
    }
  }
`

interface GetCompanySettingsResult {
  [key: string]: Company
}

export const getCompanySettingsRequest = (): Promise<GetCompanySettingsResult> => graphClient.request(COMPANY_SETTINGS_QUERY)
