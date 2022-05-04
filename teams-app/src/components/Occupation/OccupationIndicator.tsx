import { Avatar } from '@seatti-tech/lithium'
import React, { useMemo } from 'react'
import { BASE_ENDPOINT } from '../../config/constants'
import { useToken } from '../../hooks/useToken'
import { Person } from '../../types'

interface OccupationIndicatorProps {
  person: Person
}

export const OccupationIndicator = ({ person }: OccupationIndicatorProps) => {
  const { profileImage, displayName } = person
  const { isLoading, token } = useToken()

  const src = useMemo(() => (profileImage ? `${BASE_ENDPOINT}${profileImage}?access_token=${token}` : undefined), [profileImage, token])

  return (
    <div className='flex items-center space-x-2'>
      {displayName && <span className='text-xs italic text-grey-600 dark:text-grey-400 whitespace-nowrap'>{displayName}</span>}
      <Avatar loading={isLoading} image={src} name={displayName} />
    </div>
  )
}
