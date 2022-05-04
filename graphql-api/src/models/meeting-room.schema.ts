import { SpaceType } from '../types/space'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SpaceSchemaDefinition } from './space.schema'
import { SpacePermissionDocument } from './space-permission.schema'
import { BaseDocument } from './base.schema'

export const MEETING_ROOM_MODEL_NAME = SpaceType.MeetingRoom

@Schema()
export class MeetingRoomSchemaDefinition implements SpaceSchemaDefinition {
  _id: string
  name: string
  parent: string | null
  kind: SpaceType
  disabled: boolean
  company: string
  permissions: SpacePermissionDocument
  capacity: number | null
  sort: number

  @Prop({
    required: true,
  })
  objectId: string

  @Prop({
    required: true,
  })
  emailAddress: string
}

export const MeetingRoomSchema = SchemaFactory.createForClass(MeetingRoomSchemaDefinition)

export type MeetingRoomDocument = MeetingRoomSchemaDefinition & BaseDocument
