export const isString = (value: unknown): value is string => typeof value === 'string' || value instanceof String

export const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString)
