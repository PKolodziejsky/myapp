import { Avatar } from '@seatti-tech/lithium'
import React from 'react'

import { BASE_ENDPOINT } from '../../../config/constants'
import { useToken } from '../../../hooks/useToken'
import { User } from '../../../types/User'
import { Label } from '../Label'

type UserLabelProps = {
  user: User
  onClick?: () => void
  onDelete?: () => void
}

export const UserLabel = ({ user, onClick, onDelete }: UserLabelProps) => {
  const { isLoading, token } = useToken()

  return (
    <Label onClick={onClick} onDelete={onDelete}>
      <div className='flex items-center space-x-1'>
        <Avatar
          loading={isLoading}
          image={`${BASE_ENDPOINT}${user?.person?.profileImage}?access_token=${token}`}
          name={user?.person?.displayName}
        />
        <div>{user.person?.displayName}</div>
      </div>
    </Label>
  )
}
