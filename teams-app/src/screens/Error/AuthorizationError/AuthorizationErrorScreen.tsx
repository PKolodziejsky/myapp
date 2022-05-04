import React from 'react'

import { ErrorLayout } from '../ErrorLayout'

interface AuthorizationErrorScreenProps {
  error?: string
}

export const AuthorizationErrorScreen = ({ error }: AuthorizationErrorScreenProps) => {
  return <ErrorLayout title='No Access' description={error ?? ''} />
}
