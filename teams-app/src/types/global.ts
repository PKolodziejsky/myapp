export type TimePeriod = {
  value: number
  unit: 'day' | 'week' | 'month'
}

export type DateRange = {
  start?: Date
  end?: Date
}

export type TimePeriodRange = {
  future: TimePeriod
  past: TimePeriod
}
