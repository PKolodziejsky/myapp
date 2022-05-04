import classNames from 'classnames'
import React, { Fragment, HTMLAttributes } from 'react'

import darkSrc from '../../../assets/meeting_dark.svg'
import regularSrc from '../../../assets/meeting.svg'

export interface MeetingAnimationProps extends Omit<HTMLAttributes<HTMLImageElement>, 'ref'> {}

export const MeetingAnimation = ({ className, ...props }: MeetingAnimationProps) => {
  return (
    <Fragment>
      <img src={regularSrc} className={classNames('max-w-[280px] inline dark:hidden', className)} {...props} />
      <img src={darkSrc} className={classNames('max-w-[280px] hidden dark:inline', className)} {...props} />
    </Fragment>
  )
}
