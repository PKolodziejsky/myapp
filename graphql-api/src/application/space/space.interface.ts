
export interface SpaceStatus {
  occupation: number
  date: string
  space: string
  users: string[]
  hasAnonymous: boolean[]
  capacity: number
}

export interface Space {
  id: string
  name: string
  parent: string
}
