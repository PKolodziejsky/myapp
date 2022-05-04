
const isObject = (input: any): input is Record<string, unknown> =>
    Object.prototype.toString.call(input) === '[object Object]'

const sort = (unordered: Record<string, unknown>) => {
  return Object
      .keys(unordered)
      .sort()
      .reduce<Record<string, unknown>>((ordered, key) => {
        const value = unordered[key]

        ordered[key] = isObject(value) ? sort(value) : value
        return ordered
      }, {})
}

export const objectHashKey = (object: Record<string, unknown>) => {
  return JSON.stringify(sort(object))
}
