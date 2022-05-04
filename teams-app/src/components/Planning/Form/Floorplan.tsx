import { FloorPlan as FloorplanCanvas } from '@seatti-tech/lithium'
import React from 'react'

import { MEDIA_ENDPOINT } from '../../../config/constants'
import { useToken } from '../../../hooks/useToken'
import { Medium } from '../../../types'

interface FloorplanProps {
  medium: Medium
  onClose?: () => void
}

export const Floorplan = ({ medium, onClose }: FloorplanProps) => {
  const { isLoading, token } = useToken()

  if (isLoading) {
    return null
  }

  return <FloorplanCanvas imageSource={`${MEDIA_ENDPOINT}/${medium.id}?access_token=${token}`} onClose={onClose} />
}
