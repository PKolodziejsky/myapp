import classNames from 'classnames'
import React, { Fragment, HTMLAttributes } from 'react'

import darkSrc from '../../../assets/search_dark.svg'
import regularSrc from '../../../assets/search.svg'

export interface SearchAnimationProps extends Omit<HTMLAttributes<HTMLImageElement>, 'ref'> {}

export const SearchAnimation = ({ className, ...props }: SearchAnimationProps) => {
  return (
    <Fragment>
      <img src={regularSrc} className={classNames('max-w-[280px] inline dark:hidden', className)} {...props} />
      <img src={darkSrc} className={classNames('max-w-[280px] hidden dark:inline', className)} {...props} />
    </Fragment>
  )
}
