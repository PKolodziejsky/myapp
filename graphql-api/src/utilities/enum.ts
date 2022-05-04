
export const getEnumValues = <E, V extends number | string>(input: { [key: string]: V }): V[] => Object.values(input)