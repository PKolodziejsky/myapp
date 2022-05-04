import { Button, DoubleArrowRightIcon } from '@seatti-tech/lithium'
import React, { createContext } from 'react'
import { useTranslation } from 'react-i18next'
import { TooltipRenderProps } from 'react-joyride'

import { isString } from '../../utilities'

export const TourStartContext = createContext<TooltipRenderProps['primaryProps']['onClick']>(() => {})

export const Tooltip = (props: TooltipRenderProps) => {
  const { index, step, size, closeProps, primaryProps, skipProps, isLastStep, tooltipProps } = props
  const { title } = step
  const { t } = useTranslation()

  return (
    <TourStartContext.Provider value={primaryProps.onClick}>
      <div {...tooltipProps} className='p-6 md:p-8 rounded-2xl bg-white dark:bg-grey-900 max-content'>
        {title && (
          <div className='flex justify-between font-bold mb-3'>
            <div className='text-lg'>{isString(title) ? t(title) : title}</div>
            <div className='text-xs ml-3'>
              {index}/{size - 1}
            </div>
          </div>
        )}
        <div className='text-grey-600 dark:text-grey-500 text-sm'>{step.content}</div>
        {!step.hideFooter && (
          <div className='mt-4'>
            {!isLastStep ? (
              <div className='flex justify-between space-x-4'>
                <button {...skipProps} className='text-purple-600 dark:text-purple-400 text-sm'>
                  {t('product-tour.skip')}
                </button>
                <Button {...primaryProps} iconEnd={<DoubleArrowRightIcon />}>
                  {t('product-tour.next')}
                </Button>
              </div>
            ) : (
              <div className='flex justify-end'>
                <Button {...closeProps}>{t('product-tour.finish')}</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </TourStartContext.Provider>
  )
}
