import { AdminIcon, ButtonListEntry, FeedbackIcon, List, RoundButton } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { useFeedback, useLocale } from '../../hooks'
import { AVAILABLE_LOCALES } from '../../i18n'
import { userState } from '../../store'

export const ModalList = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [locale, setLocale] = useLocale()
  const currentUser = useRecoilValue(userState)
  const navigateToFeedback = useFeedback()

  return (
    <div className='w-full md:w-max'>
      <List>
        <div className='px-6 py-4'>
          <div className='flex space-x-4 md:justify-end'>
            {AVAILABLE_LOCALES.map(availableLocale => (
              <RoundButton
                key={availableLocale}
                variant={'secondary'}
                active={availableLocale === locale}
                className='uppercase'
                onClick={() => setLocale(availableLocale)}
              >
                {availableLocale}
              </RoundButton>
            ))}
          </div>
        </div>
        <ButtonListEntry icon={<FeedbackIcon />} onClick={navigateToFeedback}>
          {t('application.planning.give-feedback')}
        </ButtonListEntry>
        {currentUser?.isAdmin ? (
          <ButtonListEntry icon={<AdminIcon />} onClick={() => navigate('/admin')}>
            {t('application.planning.admin-panel')}
          </ButtonListEntry>
        ) : (
          <></>
        )}
      </List>
    </div>
  )
}
