import { Avatar, EmployeeCard } from '@seatti-tech/lithium'
import { ClientError } from 'graphql-request'
import React from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { addFavoriteRequest, removeFavoriteRequest } from '../../api'

import { BASE_ENDPOINT } from '../../config/constants'
import { useToken } from '../../hooks/useToken'
import { queryClient } from '../../request'
import { userState } from '../../store/atoms/user'
import { Booking, Person } from '../../types'
import { toKey } from '../../utilities'
import { ErrorToast, InformationToast, SuccessToast } from '../Toast'

interface PersonAvatarProps {
  person: Person
}

export const PersonAvatar = ({ person }: PersonAvatarProps) => {
  const { isLoading, token } = useToken()

  return (
    <Avatar
      size='large'
      loading={isLoading}
      image={`${BASE_ENDPOINT}${person.profileImage}?access_token=${token}`}
      name={person.displayName}
    />
  )
}

interface OccupationCardProps {
  booking: Booking
}

export const OccupationCard = ({ booking: { user, space, note, date } }: OccupationCardProps) => {
  const { t } = useTranslation()
  const currentUser = useRecoilValue(userState)

  // const isFavorite = useMemo(
  //   () => user !== undefined && currentUser?.favorites?.map(user => user.id).includes(user.id),
  //   [currentUser, user],
  // )

  const { mutate: addFavorite } = useMutation(addFavoriteRequest, {
    onSuccess: ({ addFavorite: { person } }) => {
      // queryClient.invalidateQueries(['user'])
      queryClient.invalidateQueries(['bookings', toKey(date)])
      toast.custom(<SuccessToast>{t('application.planning.name-added-to-favourites-success', { name: person.displayName })}</SuccessToast>)
    },
    onError: ({ response: { errors = [] } }: ClientError) => {
      errors.forEach(error => {
        switch (error.extensions.code) {
          case 'USER_CANNOT_BE_ADDED_AS_FAVORITE':
            toast.custom(<ErrorToast>{t('application.planning.name-added-to-favourites-error')}</ErrorToast>)
            break
          default:
        }
      })
    },
  })

  const { mutate: removeFavorite } = useMutation(removeFavoriteRequest, {
    onSuccess: ({ removeFavorite: { person } }) => {
      // queryClient.invalidateQueries(['user'])
      queryClient.invalidateQueries(['bookings', toKey(date)])
      toast.custom(
        <InformationToast>{t('application.planning.name-removed-from-favourites-success', { name: person.displayName })}</InformationToast>,
      )
    },
  })

  const spaces = space.rootPath?.map(space => space.name).slice(1) || []
  if (note && note.length > 0) spaces.push(note)

  return (
    <EmployeeCard
      className='h-full'
      spaces={spaces}
      name={user?.person?.displayName}
      job={user?.person?.jobTitle}
      department={user?.person?.department}
      avatar={user?.person && <PersonAvatar person={user.person} />}
      favorite={user?.isFavorite}
      onClickFavorite={() => {
        if (!user) return

        if (!user?.isFavorite) addFavorite({ user: user?.id })
        else removeFavorite({ user: user?.id })
      }}
      self={user?.id === currentUser?.id}
    />
  )
}
