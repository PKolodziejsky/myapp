import { Input } from '@seatti-tech/lithium'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'

import { getAdminsRequest, getUsersRequest, setCustomUserSettingRequest } from '../../../api'
import { queryClient } from '../../../request'
import { UserLabel } from './UserLabel'

export const UsersScreen = () => {
  const { t } = useTranslation()
  const [nameInput, setNameInput] = useState<string>('')

  const { data: { admins = [] } = {} } = useQuery(['admins'], getAdminsRequest)

  const { data: { users = [] } = {} } = useQuery(['searchedUsers', nameInput], () => getUsersRequest({ name: nameInput }), {
    enabled: !!nameInput,
    keepPreviousData: true,
  })

  const searchedUsers = users.filter(user => !user.isAdmin)

  const { mutate: setUserSetting } = useMutation(setCustomUserSettingRequest, {
    onSuccess: () => queryClient.invalidateQueries(['users']),
  })

  return (
    <div className='w-full flex flex-col md:flex-row mt-8 space-y-8 md:space-x-8 md:space-y-0 px-4 md:px-0'>
      <div className='md: flex-1 flex flex-col space-y-4'>
        <div className='text-base font-semibold'>{t('application.admin.select-user')}</div>
        <Input
          placeholder={t('application.admin.search')}
          value={nameInput}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNameInput(event.target.value)}
        />
        {searchedUsers && (
          <ul className='flex flex-wrap gap-2'>
            {searchedUsers.map(user => (
              <li key={user.id}>
                <UserLabel user={user} onClick={() => setUserSetting({ objectId: user.objectId, key: 'admin', value: true })} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='md:flex-1 flex flex-col space-y-4'>
        <div className='text-base font-semibold'>{t('application.admin.admins')}</div>
        {admins && (
          <ul className='flex flex-wrap gap-2'>
            {admins.map(admin => (
              <li key={admin.id}>
                <UserLabel user={admin} onDelete={() => setUserSetting({ objectId: admin.objectId, key: 'admin', value: false })} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
