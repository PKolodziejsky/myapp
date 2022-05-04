import { useTranslation } from 'react-i18next'

import { Equipment } from '../types'

export const useTranslateEquipment = () => {
  const { t } = useTranslation()

  return (equipment: Equipment) => {
    switch (equipment) {
      case Equipment.AUDIO:
        return t('application.meeting.equipment.audio')
      case Equipment.VIDEO:
        return t('application.meeting.equipment.video')
      case Equipment.DISPLAY:
        return t('application.meeting.equipment.display')
      case Equipment.ACCESSIBILITY:
        return t('application.meeting.equipment.accessibility')
    }
  }
}
