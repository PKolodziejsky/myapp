import * as mongoose from 'mongoose'
import { mediaSchema } from '../models/media.model'
import { companySchema } from '../models/company.model'
import { baseSpaceSchema, meetingRoomSchema, workspaceSchema } from '../models/space.model'
import { toDocumentId } from '../utilities/document'
import {SpaceType} from "../types/space";

const mediaKeysAWS = [
  'seatti/Dummy Overview.png',
  'seatti/Dummy Quiet Area.png',
  'seatti/Dummy Standing Desks.png',
  'seatti/Dummy Legal.png',
  'seatti/Dummy Accounting.png',
]

const spaces: any[] = [
  { name: 'Office Munich', parent: null, chain: [], disabled: false, capacity: 93, canHaveNote: false, floorPlans: [0] },
  { name: 'Creative Zone', parent: 0, chain: ['Office Munich'], disabled: false, capacity: 36, canHaveNote: false, floorPlans: [0] },
  { name: 'Lounge', parent: 0, chain: ['Office Munich'], disabled: false, capacity: 15, canHaveNote: false, floorPlans: [0] },
  { name: 'Quiet Area', parent: 0, chain: ['Office Munich'], disabled: false, capacity: 15, canHaveNote: false, floorPlans: [1] },
  { name: 'Desk 1', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 2', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 3', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 4', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 5', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 6', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 7', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 8', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 9', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 10', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 11', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 12', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 13', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 14', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Einzelbüro (EB)', parent: 3, chain: ['Office Munich', 'Quiet Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Standing Desk Area', parent: 0, chain: ['Office Munich'], disabled: false, capacity: 5, canHaveNote: false, floorPlans: [2] },
  { name: 'Desk 1', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 2', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: true, capacity: 1, canHaveNote: false },
  { name: 'Desk 3', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 4', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: true, capacity: 1, canHaveNote: false },
  { name: 'Desk 5', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 6', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: true, capacity: 1, canHaveNote: false },
  { name: 'Desk 7', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: true, capacity: 1, canHaveNote: false },
  { name: 'Desk 8', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 9', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: true, capacity: 1, canHaveNote: false },
  { name: 'Desk 10', parent: 19, chain: ['Office Munich', 'Standing Desk Area'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Legal Area - restricted', parent: 0, chain: ['Office Munich'], disabled: false, capacity: 6, canHaveNote: false, floorPlans: [3] },
  { name: 'Desk 1', parent: 30, chain: ['Office Munich', 'Legal Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 2', parent: 30, chain: ['Office Munich', 'Legal Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 3', parent: 30, chain: ['Office Munich', 'Legal Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 4', parent: 30, chain: ['Office Munich', 'Legal Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 5', parent: 30, chain: ['Office Munich', 'Legal Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 6', parent: 30, chain: ['Office Munich', 'Legal Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Einzelbüro (EB)', parent: 30, chain: ['Office Munich', 'Legal Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Accounting Area - restricted', parent: 0, chain: ['Office Munich'], disabled: false, capacity: 16, canHaveNote: false, floorPlans: [4] },
  { name: 'Desk 1', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 2', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 3', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 4', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 5', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 6', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 7', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 8', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 9', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 10', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 11', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 12', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 13', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 14', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 15', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Desk 16', parent: 38, chain: ['Office Munich', 'Accounting Area - restricted'], disabled: false, capacity: 1, canHaveNote: false },
  { name: 'Home Office', parent: null, chain: [], disabled: false, capacity: null, canHaveNote: true },
  { name: 'Business Trip', parent: null, chain: [], disabled: false, capacity: null, canHaveNote: true },
  { name: 'Absent', parent: null, chain: [], disabled: false, capacity: null, canHaveNote: false },
]

const workspaces: any[] = [
  {
    parent: 3,
    chain: ['Office Munich', 'Quiet Area'],
    disabled: false,
    emailAddress: 'greenmeeting@seatti.co',
    objectId: '3a5d36e1-6e62-4845-9422-d3832d9a455c',
  },
  {
    parent: 3,
    chain: ['Office Munich', 'Quiet Area'],
    disabled: false,
    emailAddress: 'bluemeeting@seatti.co',
    objectId: '9c2c4d2a-2158-48f1-b791-048199fc191c',
  },
]

export default async () => {
  const Company = mongoose.model('Company', companySchema)
  const Space = mongoose.model('Space', baseSpaceSchema)
  const Workspace = Space.discriminator(SpaceType.Workspace, workspaceSchema)
  const MeetingRoom = Space.discriminator(SpaceType.MeetingRoom, meetingRoomSchema)

  const Media = mongoose.model('media', mediaSchema)

  const company = new Company({
    name: 'Seatti',
    tenant: 'a00806e8-e429-4b02-b2b4-90e9680b7a35',
    settings: {
      booking: {
        restrictions: {
          defaults: {
            future: {
              value: 14,
              unit: 'day',
            },
            past: {
              value: 0,
              unit: 'day',
            },
          },
        },
      },
    },
  })

  await company.save()

  const mediaEntities: any[] = []
  for (const key of mediaKeysAWS) {
    const media = new Media({
      company: toDocumentId(company),
      key,
    })

    await media.save()

    mediaEntities.push(media)
  }

  const spaceEntities = []
  for (const [index, { parent, name, capacity, canHaveNote, disabled, floorPlans }] of spaces.entries()) {
    const space: any = new Workspace({
      company: toDocumentId(company),
      parent: spaceEntities[parent] ? toDocumentId(spaceEntities[parent]) : null,
      name,
      capacity,
      canHaveNote: canHaveNote ?? false,
      floorPlans: floorPlans ? floorPlans.map((index: number) => mediaEntities[index]) : [],
      disabled: disabled ?? false,
      hasChildren: spaces.reduce((baseVal, space) => (space.parent == index ? baseVal + 1 : baseVal), 0) || null,
    })

    await space.save()

    spaceEntities.push(space)
  }

  for (const [index, { parent, disabled, emailAddress, objectId }] of workspaces.entries()) {
    const space: any = new MeetingRoom({
      company: toDocumentId(company),
      emailAddress,
      objectId,
      parent: spaceEntities[parent] ? toDocumentId(spaceEntities[parent]) : null,
      disabled: disabled ?? false,
    })

    await space.save()
  }
}
