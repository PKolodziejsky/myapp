import React from 'react'

import { ErrorLayout } from '../ErrorLayout'

interface AuthenticationErrorScreenProps {
  error?: string
}
// TODO match errors
export const AuthenticationErrorScreen = ({ error }: AuthenticationErrorScreenProps) => {
  return <ErrorLayout title='Login Error' description={error ?? ''} />
}
