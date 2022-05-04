// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * This component is used to display the required
 * privacy statement which can be found in a link in the
 * about tab.
 */
export const PrivacyScreen = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('application.privacy.header')}</h1>
    </div>
  )
}
