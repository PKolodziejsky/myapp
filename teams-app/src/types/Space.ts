import { User } from './User'

export type FloorPlan = {
  id: string
}

export type Medium = {
  id: string
}

export type SpaceStatus = {
  date: string
  occupation: number
  users?: User[] | null
}

export enum SpaceKind {
  WORKSPACE = 'workspace',
  MEETING_ROOM = 'meetingRoom',
}

export type Space = {
  id: string
  name: string
  parent: string | null
  capacity: number | null
  labels?: string[]
  canHaveNote: boolean
  company: string
  floorPlans: Medium[] | null
  isAccessible: boolean
  occupation?: number
  disabled?: boolean
  hasChildren: number | null
  rootPath: Space[]
  status?: SpaceStatus
}
