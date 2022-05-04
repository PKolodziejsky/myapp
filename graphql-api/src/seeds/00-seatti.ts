import * as mongoose from 'mongoose'
import { companySchema } from '../models/company.model'
import {baseSpaceSchema, meetingRoomSchema, SpaceDocument, spaceSchema, workspaceSchema} from '../models/space.model'
import { toDocumentId } from '../utilities/document'
import {SpaceType} from "../types/space";

const spaces: any[] = [
  {
    parent: null,
    name: 'Berlin',
    capacity: 30,
  },
  {
    parent: 0,
    name: '1st Floor',
    capacity: 5,
  },
  {
    parent: 0,
    name: '2nd Floor',
    capacity: 15,
  },
  {
    parent: 0,
    name: '3rd Floor',
    capacity: 10,
  },
  {
    parent: null,
    name: 'Munich',
    capacity: 10,
  },
  {
    parent: null,
    name: 'Home Office',
    capacity: null,
    canHaveNote: true,
  },
  {
    parent: null,
    name: 'Vienna',
    capacity: 30,
  },
  {
    parent: 6,
    name: 'Main',
    capacity: 10,
  },
  {
    parent: 6,
    name: 'Shared',
    capacity: 20,
  },
  {
    parent: null,
    name: 'Office with Limit without Spaces',
    capacity: 1,
    canHaveNote: true,
  },
  {
    parent: null,
    name: 'Office without Limit without Spaces',
    capacity: null,
  },
  {
    parent: null,
    name: 'Office with Spaces',
    capacity: null,
  },
  {
    parent: 11,
    name: 'Child space with Limit',
    capacity: 1,
  },
  {
    parent: 11,
    name: 'Child space without Limit',
    capacity: null,
  },
]

export default async () => {
  const Company = mongoose.model('Company', companySchema)
  const Space = mongoose.model('Space', baseSpaceSchema)
  const Workspace = Space.discriminator(SpaceType.Workspace, workspaceSchema)

  const company = new Company({
    name: 'Seatti',
    tenant: 'a00806e8-e429-4b02-b2b4-90e9680b7a35',
  })

  await company.save()

  const spaceEntities = []
  for (const { parent, name, capacity, canHaveNote } of spaces) {
    const space: any = new Workspace({
      company: toDocumentId(company),
      parent: spaceEntities[parent] ? toDocumentId(spaceEntities[parent]) : null,
      name,
      kind: SpaceType.Workspace,
      capacity,
      canHaveNote: canHaveNote ?? false,
    })

    await space.save()

    spaceEntities.push(space)
  }
}
