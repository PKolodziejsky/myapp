import { RoundButton, RoundButtonProps, RoundIconButton } from '@seatti-tech/lithium'
import React from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const LinkButton = ({ to, children, iconStart, iconEnd }: RoundButtonProps & LinkProps): JSX.Element => (
  <Link to={to}>
    {iconStart && <RoundIconButton className='xs:hidden'>{iconStart}</RoundIconButton>}
    <RoundButton iconStart={iconStart} iconEnd={iconEnd} className='hidden xs:flex items-center space-x-2'>
      <span>{children}</span>
    </RoundButton>
    {iconEnd && <RoundIconButton className='xs:hidden'>{iconEnd}</RoundIconButton>}
  </Link>
)
