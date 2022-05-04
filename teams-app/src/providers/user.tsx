import React, { Fragment, ReactNode } from 'react'
import { useQuery } from 'react-query'
import { useSetRecoilState } from 'recoil'

import { getUserRequest } from '../api'
import { userState } from '../store'

interface UserProviderProps {
  children: ReactNode
  signedIn: boolean
}

export const UserProvider = ({ children, signedIn }: UserProviderProps) => {
  const setUser = useSetRecoilState(userState)

  useQuery(['user'], getUserRequest, {
    onSuccess: ({ user }) => setUser(user),
    enabled: signedIn,
  })

  return <Fragment>{children}</Fragment>
}
