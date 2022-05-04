import { Toast } from '@seatti-tech/lithium'
import { createElement } from 'react'
import toast from 'react-hot-toast'

import i18n from '../i18n'
import { getAccessToken } from '../utilities'
import { createFetchClient } from './createFetchClient'

export const fetchClient = createFetchClient({
  onRequest: (init: RequestInit = {}) => {
    return getAccessToken()
      .then(token => {
        return {
          ...init,
          headers: {
            ...init.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      })
      .catch(() => init)
  },
  onResponse: response => {
    toast.remove('global-server-error')

    return response
  },
  onError: error => {
    const title = i18n.t('application.errors.server-not-reachable', { ns: 'main' })

    toast.custom(createElement(Toast, { variant: 'error', message: title, className: 'w-full md:w-fit' }), {
      id: 'global-server-error',
    })

    throw error
  },
})
