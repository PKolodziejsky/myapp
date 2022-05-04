import { useEffect, useState } from 'react'

import { getUserRequest } from '../api'

export const useAuthorization = (isAuthenticated: boolean) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authorizationError, setAuthorizationError] = useState<string>()

  useEffect(() => {
    if (isAuthenticated) {
      getUserRequest()
        .then(() => setIsAuthorized(true))
        .catch(({ response }) => {
          const [error] = response.errors

          if (error) {
            setAuthorizationError(error.message)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [isAuthenticated])

  return { isLoading, isAuthorized, error: authorizationError }
}
