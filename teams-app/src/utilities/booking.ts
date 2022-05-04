import { Booking } from '../types'

// source: https://codereview.stackexchange.com/questions/70314/elegant-way-to-sort-on-multiple-properties-that-might-be-undefineds
export const compare = (a: Booking, b: Booking): number => {
  const compareProperty = (a: string | undefined, b: string | undefined) => {
    return a || b ? (!a ? -1 : !b ? 1 : a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })) : 0
  }

  return (
    compareProperty(b.user?.isFavorite?.toString(), a.user?.isFavorite?.toString()) ||
    compareProperty(a.user?.person?.department, b.user?.person?.department) ||
    compareProperty(a.user?.person?.displayName, b.user?.person?.displayName)
  )
}
