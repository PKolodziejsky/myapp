import { MediaData } from './media.interface'

export interface SpaceData {
  id: string
  parent?: string
  name: string
  capacity?: number
  hasChildren?: number
  company?: string
  labels?: string[]
  canHaveNote: boolean
  floorPlans?: MediaData[]
  disabled?: boolean
  isAccessible: boolean
}
