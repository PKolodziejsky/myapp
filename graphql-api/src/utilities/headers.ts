import { isString } from 'lodash'
import { IncomingHttpHeaders } from 'http'

export const createAuthorizationHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

export const getTokenFromHeaders = (headers: IncomingHttpHeaders = {}) => {
  if (headers.authorization && isString(headers.authorization)) {
    const components = headers.authorization.split(' ')

    if (components.length === 2 && components[0].toLowerCase() === 'bearer') {
      return components[1]
    }
  }

  return null
}
