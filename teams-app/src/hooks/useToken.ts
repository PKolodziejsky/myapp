import { useEffect, useState } from 'react'

import { getAccessToken } from '../utilities/auth'

export const useToken = () => {
  const [token, setToken] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAccessToken().then(token => {
      setToken(token)
      setIsLoading(false)
    })
  }, [])

  return { isLoading, token }
}
