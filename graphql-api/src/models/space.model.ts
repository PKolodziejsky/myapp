import { Document, Schema } from 'mongoose'
import { MediaDocument } from './media.model'
import { v4 as uuid } from 'uuid'
import {SpaceType} from "../types/space";

export interface SpacePermissions {
  groups: string[]
  inheritedGroups: string[]
  inherit: boolean
}

export interface SpaceDocument extends Document {
  parent: string
  name: string
  kind: SpaceType,
  hasChildren: number
  labels?: string[]
  capacity: number
  canHaveNote: boolean
  company: string
  floorPlans: string[] | MediaDocument[]
  disabled?: boolean
  permissions?: SpacePermissions
}

const spacePermissionsSchema = new Schema({
  groups: [String],
  inheritedGroups: [String],
  inherit: Boolean,
})

export const spaceSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    parent: String,
    name: String,
    capacity: Number,
    labels: [String],
    hasChildren: Number,
    canHaveNote: Boolean,
    kind: {
      type: String,
      enum: ['workspace', 'meetingRoom'],
      default: 'workspace',
    },
    permissions: {
      type: spacePermissionsSchema,
    },
    company: {
      type: String,
      ref: 'Company',
      index: true,
    },
    floorPlans: [
      {
        type: String,
        ref: 'Media',
      },
    ],
    disabled: Boolean,
  },
  { timestamps: true },
)

export const baseSpaceSchema = new Schema(
    {
      _id: {
        type: String,
        default: () => uuid(),
      },
      parent: String,
      type: {
        type: String,
        enum: ['workspace', 'meetingRoom'],
        default: 'workspace',
      },
      permissions: {
        type: spacePermissionsSchema,
      },
      company: {
        type: String,
        ref: 'Company',
        index: true,
      },
      disabled: Boolean,
      capacity: Number,
    },
    { timestamps: true, discriminatorKey: 'kind' },
)

export const workspaceSchema = new Schema(
    {
      name: String,
      labels: [String],
      hasChildren: Number,
      canHaveNote: Boolean,
      floorPlans: [
        {
          type: String,
          ref: 'Media',
        },
      ],
    },
    { timestamps: true, discriminatorKey: 'kind' }
)

export const meetingRoomSchema = new Schema(
    {
      objectId: String,
      emailAddress: String,
    },
    { timestamps: true, discriminatorKey: 'kind' }
)
