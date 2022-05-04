import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { userState } from '../../store'
import { Header } from './Header'

export const AdminScreen = () => {
  const navigate = useNavigate()
  const currentUser = useRecoilValue(userState)

  if (currentUser?.isAdmin === false) navigate('/oops')

  return (
    <main className='w-full md:w-[780px] min-h-screen h-fit py-2 md:py-10 mx-auto space-y-4 md:space-y-10'>
      <Header />
      <Outlet />
    </main>
  )
}
