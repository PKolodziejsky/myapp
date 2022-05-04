import { Toggle } from '@seatti-tech/lithium'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'

import {
  addDeskLabelRequest,
  getSpaceChildrenRequest,
  getSpaceRootPathRequest,
  removeDeskLabelRequest,
  toggleDisableSpaceRequest,
  updateSpaceRequest,
} from '../../../api'
import { queryClient } from '../../../request'
import { Space, SpaceKind } from '../../../types'
import { Label } from '../Label'
import { LabelInput } from './LabelInput'
import { SpaceLabel } from './SpaceLabel'
import { SpaceNavigation } from './SpaceNavigation'

export const SpacesScreen = () => {
  const navigate = useNavigate()
  const { spaceId = null } = useParams()
  const { t } = useTranslation()
  const [spaceRootPath, setSpaceRootPath] = useState<Space[]>([])

  const getSpaceChildrenRequestKey = ['spaceChildren', SpaceKind.WORKSPACE, spaceId]
  const { data: { spaceChildren = [] } = {} } = useQuery(getSpaceChildrenRequestKey, () => getSpaceChildrenRequest({ id: spaceId }))

  useQuery(['rootPath', spaceId], () => getSpaceRootPathRequest({ id: spaceId ?? '' }), {
    onSuccess: ({ spaceRootPath }) => setSpaceRootPath(spaceRootPath),
    keepPreviousData: true,
  })

  const { mutate: toggleDisableSpace } = useMutation(toggleDisableSpaceRequest, {
    onSuccess: () => queryClient.invalidateQueries(getSpaceChildrenRequestKey),
  })

  const { mutate: updateSpace } = useMutation(updateSpaceRequest, {
    onSuccess: () => queryClient.invalidateQueries(getSpaceChildrenRequestKey),
  })

  const { mutate: addLabel } = useMutation(addDeskLabelRequest, {
    onSuccess: () => queryClient.invalidateQueries(getSpaceChildrenRequestKey),
  })

  const { mutate: removeLabel } = useMutation(removeDeskLabelRequest, {
    onSuccess: () => queryClient.invalidateQueries(getSpaceChildrenRequestKey),
  })

  return (
    <section className='w-full flex flex-col items-start space-y-8 px-4 md:px-0'>
      <SpaceNavigation space={spaceRootPath.slice(-1)[0]} spaceRootPath={spaceRootPath} />
      <table className='w-full'>
        <thead>
          <tr className='text-sm'>
            <th className='md:w-[320px]'>{t('application.admin.name')}</th>
            <th className='hidden md:table-cell'>{t('application.admin.subspaces')}</th>
            <th className='hidden md:table-cell'>{t('application.admin.capacity')}</th>
            <th className='hidden md:table-cell'>{t('application.admin.text')}</th>
            <th>{t('application.admin.enabled')}</th>
          </tr>
        </thead>
        <tbody className='text-sm'>
          {spaceChildren.map(space => (
            <tr className='border-b border-grey-200 dark:border-grey-700'>
              <td className='py-[16px] flex flex-col space-y-2 md:w-[320px]'>
                <SpaceLabel
                  space={space}
                  onClick={space.hasChildren ? () => navigate(`/admin/spaces/${space.id}`) : undefined}
                  onSave={name => updateSpace({ id: space.id, name })}
                  key={space.id}
                />
                {space.labels && (
                  <ul className='flex flex-wrap gap-1'>
                    <li>
                      <LabelInput onSave={value => addLabel({ id: space.id, label: value })} />
                    </li>
                    {space.labels.map((label, index) => (
                      <li key={index}>
                        <Label
                          onDelete={() => {
                            removeLabel({ id: space.id, index })
                          }}
                        >
                          {label}
                        </Label>
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td className='py-[16px] hidden md:table-cell'>{space.hasChildren || '-'}</td>
              <td className='py-[16px] hidden md:table-cell'>{space.capacity || '-'}</td>
              <td className='py-[16px] hidden md:table-cell'>{space.canHaveNote ? t('application.admin.free') : '-'}</td>
              <td className='py-[16px]'>
                {!space.hasChildren && <Toggle checked={!space.disabled} onChange={() => toggleDisableSpace({ id: space.id })} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
