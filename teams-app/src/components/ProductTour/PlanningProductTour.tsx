import React, { useCallback } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'

import { useTheme } from '../../hooks'
import { Tooltip } from './Tooltip'

interface ProductTourProps {
  steps: Step[]
  onEnd: () => void
}

export const ProductTour = ({ steps, onEnd }: ProductTourProps) => {
  const theme = useTheme()

  const onCallback = useCallback(({ status }: CallBackProps) => {
    const endStatus: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (endStatus.includes(status)) {
      onEnd()
    }
  }, [])

  return (
    <Joyride
      continuous={true}
      run={true}
      steps={steps}
      tooltipComponent={Tooltip}
      disableOverlayClose
      callback={onCallback}
      styles={{
        options: {
          arrowColor: theme === 'dark' ? '#202020' : '#FFFFFF',
        },
      }}
    />
  )
}
