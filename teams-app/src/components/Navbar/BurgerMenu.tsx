import { ContextMenuController, MenuIcon, RoundIconButton } from '@seatti-tech/lithium'
import React from 'react'

import { ModalList } from './ModalList'

export const BurgerMenu = () => (
  <div data-tour='menu'>
    <ContextMenuController
      selector={toggle => (
        <RoundIconButton variant='ghost' onClick={toggle}>
          <MenuIcon />
        </RoundIconButton>
      )}
      alignment='right'
    >
      {() => <ModalList />}
    </ContextMenuController>
  </div>
)
