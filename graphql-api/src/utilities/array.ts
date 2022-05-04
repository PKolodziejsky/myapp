export const intersect = <T>(left: T[], right: T[]): boolean => left.filter((value) => right.includes(value)).length > 0
