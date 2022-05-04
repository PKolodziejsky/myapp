import { Input } from '@seatti-tech/lithium'
import React, { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface NoteProps {
  onNoteUpdate?: (note: string | null) => void
  defaultValue?: string
}

export const Note = ({ onNoteUpdate, defaultValue }: NoteProps) => {
  const { t } = useTranslation()
  return (
    <Input
      placeholder={t('application.planning.city-district')}
      defaultValue={defaultValue}
      onBlur={(event: ChangeEvent<HTMLInputElement>) => {
        if (onNoteUpdate) onNoteUpdate(event?.target.value ?? null)
      }}
    />
  )
}
