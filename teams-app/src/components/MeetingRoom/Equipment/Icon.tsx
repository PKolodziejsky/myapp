import { AccessibilityIcon, AudioIcon, OneScreenEquipmentIcon, VideoIcon } from '@seatti-tech/lithium'
import React from 'react'

import { Equipment, MeetingRoom } from '../../../types'

interface IconProps {
  equipment: Equipment
}

export const Icon = ({ equipment }: IconProps) => {
  switch (equipment) {
    case Equipment.AUDIO:
      return <AudioIcon />
    case Equipment.VIDEO:
      return <VideoIcon />
    case Equipment.DISPLAY:
      return <OneScreenEquipmentIcon />
    case Equipment.ACCESSIBILITY:
      return <AccessibilityIcon />
  }
}

export const getEquipmentIconList = (meetingRoom: MeetingRoom) => {
  const icons = []

  if (meetingRoom.audioDeviceName) icons.push(<AudioIcon />)
  if (meetingRoom.videoDeviceName) icons.push(<VideoIcon />)
  if (meetingRoom.displayDeviceName) icons.push(<OneScreenEquipmentIcon />)
  if (meetingRoom.isWheelChairAccessible) icons.push(<AccessibilityIcon />)

  return icons
}
