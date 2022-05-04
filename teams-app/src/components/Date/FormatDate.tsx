import dayjs from 'dayjs'
import React, { Fragment } from 'react'

interface FormatDateProps {
  date: Date
  format: string
}

export const FormatDate = ({ date, format }: FormatDateProps) => <Fragment>{dayjs(date).format(format)}</Fragment>
