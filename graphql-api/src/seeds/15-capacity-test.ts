import * as mongoose from 'mongoose'
import { companySchema } from '../models/company.model'
import {baseSpaceSchema, SpaceDocument, spaceSchema, workspaceSchema} from '../models/space.model'
import { userSchema } from '../models/user.model'
import { bookingSchema } from '../models/booking.model'
import { toDocumentId } from '../utilities/document'
import {SpaceType} from "../types/space";

const users: any[] = [
  {
    objectId: '00000000-4000-0000-0000-100000000000',
  },
  {
    objectId: '00000000-4000-0000-0000-100000000001',
  },
]

const spaces: any[] = [
  {
    // 0
    parent: null,
    name: 'Root 0',
    capacity: 15,
  },
  {
    // 1
    parent: 0,
    name: 'Root 0,0',
    capacity: 5,
  },
  {
    // 2
    parent: 0,
    name: 'Root 0,1',
    capacity: 10,
  },
  {
    // 3
    parent: 2,
    name: 'Root 0,1,0',
    capacity: 5,
  },
  {
    // 4
    parent: 2,
    name: 'Root 0,1,1',
    capacity: 2,
  },
  {
    // 5
    parent: 2,
    name: 'Root 0,1,2',
    capacity: 3,
  },
  {
    // 6
    parent: null,
    name: 'Root 1',
    capacity: null,
  },
  {
    // 7
    parent: 6,
    name: 'Root 1,0',
    capacity: null,
  },
  {
    // 8
    parent: 6,
    name: 'Root 1,1',
    capacity: 10,
  },
  {
    // 9
    parent: 8,
    name: 'Root 1,1,0',
    capacity: 5,
  },
  {
    // 10
    parent: 8,
    name: 'Root 1,1,1',
    capacity: 5,
  },
  {
    // 11
    parent: null,
    name: 'Root 2',
    capacity: null,
  },
  {
    // 12
    parent: 11,
    name: 'Root 2,0',
    capacity: 5,
  },
  {
    // 13
    parent: 11,
    name: 'Root 2,1',
    capacity: null,
  },
  {
    // 14
    parent: 13,
    name: 'Root 2,1,0',
    capacity: 5,
  },
  {
    // 15
    parent: 13,
    name: 'Root 2,1,1',
    capacity: null,
  },
  {
    // 16
    parent: 15,
    name: 'Root 2,1,1,0',
    capacity: null,
  },
  {
    // 17
    parent: 15,
    name: 'Root 2,1,1,1',
    capacity: 1,
  },
]

const bookings = [
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 1,
  },
  {
    date: '2021-10-10',
    userIndex: 1,
    spaceIndex: 1,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 3,
  },
  {
    date: '2021-10-10',
    userIndex: 1,
    spaceIndex: 3,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 4,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 7,
  },
  {
    date: '2021-10-10',
    userIndex: 1,
    spaceIndex: 7,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 9,
  },
  {
    date: '2021-10-10',
    userIndex: 1,
    spaceIndex: 9,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 10,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 12,
  },
  {
    date: '2021-10-10',
    userIndex: 1,
    spaceIndex: 12,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 14,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 16,
  },
  {
    date: '2021-10-10',
    userIndex: 0,
    spaceIndex: 17,
  },
]

export default async () => {
  const Company = mongoose.model('Company', companySchema)
  const User = mongoose.model('USer', userSchema)
  const Space = mongoose.model('Space', baseSpaceSchema)
  const Workspace = Space.discriminator(SpaceType.Workspace, workspaceSchema)
  const Booking = mongoose.model('Booking', bookingSchema)

  const company = new Company({
    name: 'Capacity Test',
    tenant: '0000-0000-0000-0000-0001',
  })

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
  for (const { parent, name, capacity } of spaces) {
    const space: any = new Workspace({
      company: toDocumentId(company),
      parent: spaceEntities[parent] ? toDocumentId(spaceEntities[parent]) : null,
      name,
      capacity,
      canHaveNote: false,
    })

    await space.save()

    spaceEntities.push(space)
  }

  for (const { date, userIndex, spaceIndex } of bookings) {
    const booking = new Booking({
      company: toDocumentId(company),
      user: toDocumentId(userEntities[userIndex]),
      space: toDocumentId(spaceEntities[spaceIndex]),
      date,
      note: null,
    })

    await booking.save()
  }
}
