import { useEffect, useRef, useState } from 'react'

import { initializeBrowser, initializeTeams, isTeamsAvailable } from '../utilities'

export type ApplicationEnvironment = 'teams' | 'browser'

interface InitializeEnvironmentResponse {
  environment: ApplicationEnvironment
  isAuthenticated: boolean
  error?: string
}

const initializeEnvironment = (): Promise<InitializeEnvironmentResponse> => {
  const [environment, initialize]: [ApplicationEnvironment, () => Promise<boolean>] = isTeamsAvailable()
    ? ['teams', initializeTeams]
    : ['browser', initializeBrowser]

  return initialize()
    .then(isAuthenticated => ({ environment, isAuthenticated }))
    .catch(error => ({ environment, isAuthenticated: false, error: error.message }))
}

interface UseAuthState {
  isLoading: boolean
  error?: string
  isAuthenticated: boolean
  environment: ApplicationEnvironment | null
}

export const useAuthentication = () => {
  const initialized = useRef(false)

  const [state, setState] = useState<UseAuthState>({
    isLoading: true,
    isAuthenticated: false,
    environment: null,
  })

  useEffect(() => {
    if (!initialized.current) {
      initializeEnvironment().then(({ environment, isAuthenticated, error }) => {
        initialized.current = true

        setState({
          isLoading: false,
          isAuthenticated,
          environment,
          error,
        })
      })
    }
  }, [])

  return state
}
