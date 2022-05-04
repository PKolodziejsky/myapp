import React, { ReactNode, createContext } from 'react'

type ApplicationEnvironments = 'teams' | 'browser' | null

export const ApplicationEnvironmentContext = createContext<ApplicationEnvironments>(null)

interface ApplicationEnvironmentProviderProps {
  environment: ApplicationEnvironments
  children: ReactNode
}

export const ApplicationEnvironmentProvider = ({ environment, children }: ApplicationEnvironmentProviderProps) => {
  return <ApplicationEnvironmentContext.Provider value={environment}>{children}</ApplicationEnvironmentContext.Provider>
}
