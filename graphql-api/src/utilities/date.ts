import { parseISO } from 'date-fns'
import * as dayjs from 'dayjs'
import { TimePeriod } from '../types/time.interface'

export const isValidDateFormat = (date: string) => {
  try {
    parseISO(date)

    return true
  } catch (error) {
    return false
  }
}

export const currentDate = () => dayjs()

export const getDate = (date: string) => dayjs(date)

export const dateFromTimePeriod = ({ value, unit }: TimePeriod) => dayjs().startOf('day').add(value, unit)
