import { arrayToTree } from 'performant-array-to-tree'
import { Dictionary, groupBy, keyBy } from 'lodash'
import { Occupation } from '../application/occupation/occupation.interface'
import { WorkspaceDocument } from '../models/workspace.schema'

type SpaceLookupItem = {
  id: string
  parent: string
  capacity: number | null
}

type OccupationTreeItem = {
  children: OccupationTreeItem[]
  data: SpaceLookupItem
}

const spacesToTree = (spaces: WorkspaceDocument[]): OccupationTreeItem[] => {
  return arrayToTree(spaces.map(({ id, parent, capacity }) => ({ id, parentId: parent, capacity }))) as OccupationTreeItem[]
}

const calc = (item: OccupationTreeItem, occupationsBySpace: Dictionary<{
  occupation: number
  date: string
  space: string
}>, date: string) => {
  if (item.children.length === 0) {
    if (item.data.capacity == null) {
      return null
    }

    return occupationsBySpace[item.data.id]?.occupation ?? 0
  }

  const occupation = sumOccupation(item.children.map((child) => calc(child, occupationsBySpace, date)))

  if (occupation !== null) {
    const space = item.data.id

    occupationsBySpace[space] = {
      space,
      date,
      occupation,
    }
  }

  return occupation
}

const sumOccupation = (capacities: (number | null)[]) => capacities.reduce((sum, value) => (value === null || sum === null ? null : sum + value), 0)

export const addOccupationsForParent = (capacities: Occupation[], spaces: WorkspaceDocument[]) => {
  let calculatedOccupation: Occupation[] = []
  const occupationsByDate = groupBy(capacities, 'date')
  const spaceLookupTree = spacesToTree(spaces)

  for (const date in occupationsByDate) {
    const occupationsBySpace = keyBy(occupationsByDate[date], 'space')

    for (const rootSpace of spaceLookupTree) {
      calc(rootSpace, occupationsBySpace, date)
    }

    calculatedOccupation = [...calculatedOccupation, ...Object.values(occupationsBySpace)]
  }

  return calculatedOccupation
}
