import { atom } from 'recoil'

import { User } from '../../types/User'

export const userState = atom<User | undefined>({
  key: 'currentUser',
  default: undefined,
})
