import * as mongoose from 'mongoose'
import { companySchema } from '../models/company.model'
import {baseSpaceSchema, SpaceDocument, spaceSchema, workspaceSchema} from '../models/space.model'
import { userSchema } from '../models/user.model'
import { toDocumentId } from '../utilities/document'
import {SpaceType} from "../types/space";

export const users: any[] = [
  {
    objectId: '00000000-4000-0000-0000-200000000000',
  },
]

// # root name, groups[], inheritedGroups[]
//                      .
//               /                      \                      \
//           0 [0][]                   1 [3]                   2 [][]
//    /                \                 \                      \
//   0,0 [1][0]       0,1 [2][]        1,0 [4][3]              2,0 [][]
//  /                   \                 \
// 0,0,0 [1][0]       0,1,0 [][2]       1,0,0 [5][3,4]

export const spaces: any[] = [
  {
    // 0
    parent: null,
    name: 'Root 0',
    capacity: 15,
    permissions: {
      groups: ['0'],
    },
  },
  {
    // 1
    parent: 0,
    name: 'Root 0,0',
    capacity: 5,
    permissions: {
      groups: ['1'],
      inheritedGroups: ['0'],
    },
  },
  {
    // 2
    parent: 1,
    name: 'Root 0,0,0',
    capacity: 10,
    permissions: {
      inheritedGroups: ['1', '0'],
    },
  },
  {
    // 3
    parent: 0,
    name: 'Root 0,1',
    permissions: {
      groups: ['2'],
      inherit: false,
    },
  },
  {
    // 4
    parent: 3,
    name: 'Root 0,1,0',
    permissions: {
      inheritedGroups: ['2'],
    },
  },
  {
    // 5,
    parent: null,
    name: 'Root 1',
    permissions: {
      groups: ['3'],
    },
  },
  {
    // 6,
    parent: 5,
    name: 'Root 1,0',
    permissions: {
      groups: ['5'],
      inheritedGroups: ['3'],
    },
  },
  {
    // 7,
    parent: 6,
    name: 'Root 1,0,0',
    permissions: {
      groups: ['4'],
      inheritedGroups: ['3', '4'],
    },
  },
  {
    // 8,
    parent: null,
    name: 'Root 2',
  },
  {
    // 9,
    parent: 8,
    name: 'Root 2,0',
  },
]

export const companies = {
  name: 'Group Permissions Test',
  tenant: '0000-0000-0000-0000-0002',
}

export default async (connection?: mongoose.Connection) => {
  const adapter = connection ? connection : mongoose.connection

  const Company = adapter.model('Company', companySchema)
  const User = adapter.model('User', userSchema)
  const Space = mongoose.model('Space', baseSpaceSchema)
  const Workspace = Space.discriminator(SpaceType.Workspace, workspaceSchema)

  const company = new Company(companies)

  await company.save()

  const userEntities = []
  for (const { objectId } of users) {
    const user = new User({
      company: toDocumentId(company),
      objectId,
    })

    await user.save()

    userEntities.push(user)
  }

  const spaceEntities = []
  for (const { parent, name, capacity, permissions } of spaces) {
    const space: any = new Workspace({
      company: toDocumentId(company),
      parent: spaceEntities[parent] ? toDocumentId(spaceEntities[parent]) : null,
      name,
      capacity,
      permissions,
      canHaveNote: false,
    })

    await space.save()

    spaceEntities.push(space)
  }
}
