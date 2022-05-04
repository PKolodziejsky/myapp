import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'

import { TimePeriod } from '../types'

dayjs.extend(weekday)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)
dayjs.extend(timezone)

export const TODAY = dayjs().startOf('day').toDate()
export const DAYS_IN_WEEK = 7
export const TIMEZONE = dayjs.tz.guess()
export const TIME_FORMAT = 'HH:mm'

export const toKey = (date: Date | string) => dayjs(date).format('YYYY-MM-DD')

export const pastTimePeriodToDate = (timePeriod: TimePeriod): Date => dayjs(TODAY).subtract(timePeriod.value, timePeriod.unit).toDate()

export const futureTimePeriodToDate = (timePeriod: TimePeriod): Date => dayjs(TODAY).add(timePeriod.value, timePeriod.unit).toDate()

export const dayInRange = (date: Date, range: { start?: Date; end?: Date }) => {
  const dayIsSameOrAfterStart = !range.start || dayjs(date).isSameOrAfter(range.start, 'day')

  const dayIsBeforeEnd = !range.end || dayjs(date).isBefore(range.end, 'day')

  return dayIsSameOrAfterStart && dayIsBeforeEnd
}

export const getDatesInWeek = (date: string | Date): Date[] =>
  Array.from(Array(DAYS_IN_WEEK).keys()).map(day => dayjs(date).weekday(day).toDate())

export const dayHasPassed = (date: Date | string) => dayjs(date).isBefore(TODAY, 'day')

export const weekHasPassed = (date: Date | string) => dayjs(date).isBefore(TODAY, 'week')

export const nextHalfHour = () => {
  const currentMinute = dayjs().get('minute')

  if (currentMinute < 30) return dayjs().startOf('hour').add(30, 'minute').toDate()
  else return dayjs().startOf('hour').add(1, 'hour').toDate()
}

export const nextHalfHourOnDate = (date: Date) => {
  const t = nextHalfHour()
  const hour = dayjs(t).hour()
  const minute = dayjs(t).minute()
  return dayjs(date).startOf('day').add(hour, 'hour').add(minute, 'minute').toDate()
}

export const getHour = (time: string) => time.split(':')[0]

export const getMinute = (time: string) => time.split(':')[1]

export const getReadableDuration = (from: Date, to: Date) => {
  const diff = dayjs(to).diff(from, 'minute')

  const duration = []

  if (diff >= 60) duration.push(`${Math.floor(diff / 60)}h`)
  if (diff % 60) duration.push(`${diff % 60}min`)

  return duration.join(' ')
}
export const toLocalISOString = (date: Date) => dayjs(date).format('YYYY-MM-DDTHH:mm:ss')

export const toBrowserTimezone = (date: Date | string, timezone: string) => dayjs.tz(date, timezone).tz(TIMEZONE).toDate()
