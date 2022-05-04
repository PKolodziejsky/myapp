import { CheckIcon, CloseIcon, Input } from '@seatti-tech/lithium'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type LabelInputProps = {
  onSave: (value: string) => void
}

export const LabelInput = ({ onSave }: LabelInputProps) => {
  const { t } = useTranslation()

  const [value, setValue] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)

  const reset = () => {
    setIsEditing(false)
    setValue('')
  }

  return (
    <div className='w-fit flex items-center space-x-1 h-[32px]'>
      {!isEditing ? (
        <div
          className='transition py-1 px-2 bg-grey-200 hover:bg-grey-300 dark:bg-grey-600 dark:text-white dark:hover:bg-grey-700 rounded-xl text-xs cursor-pointer h-full flex items-center'
          onClick={() => setIsEditing(true)}
        >
          {t('application.admin.label')}
        </div>
      ) : (
        <>
          <Input
            className='!py-1'
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
            autoFocus
          />
          <CheckIcon
            className='transition hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer'
            onClick={() => {
              onSave(value)
              reset()
            }}
          />
          <CloseIcon className='transition hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer' onClick={reset} />
        </>
      )}
    </div>
  )
}
