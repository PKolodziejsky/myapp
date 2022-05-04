import { useContext } from 'react'

import { ApplicationEnvironmentContext } from '../providers'

export const useApplicationEnvironment = () => {
  return useContext(ApplicationEnvironmentContext)
}
