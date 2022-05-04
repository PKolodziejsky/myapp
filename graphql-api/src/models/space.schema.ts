import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SpaceType } from '../types/space'
import { getEnumValues } from '../utilities/enum'
import { CompanyDocument } from './company.model'
import { SpacePermissionDocument, SpacePermissionSchema } from './space-permission.schema'
import { WorkspaceSchema, WORKSPACE_MODEL_NAME } from './workspace.schema'
import { MEETING_ROOM_MODEL_NAME, MeetingRoomSchema } from './meeting-room.schema'
import { BaseDocument, BaseSchemaDefinition, baseSchemaOptions } from './base.schema'
import {PopulatedDoc} from "mongoose";

export const SPACE_MODEL_NAME = 'space'

@Schema({
  discriminatorKey: 'kind',
  collection: 'spaces',
  ...baseSchemaOptions,
})
export class SpaceSchemaDefinition extends BaseSchemaDefinition {
  @Prop({
    type: String,
    required: true,
    enum: getEnumValues(SpaceType),
  })
  kind: SpaceType

  @Prop({
    required: true,
  })
  name: string

  @Prop({
    type: String,
  })
  parent: string | null

  @Prop({
    type: Boolean,
    default: false,
    index: true,
  })
  disabled: boolean

  @Prop({
    type: SpacePermissionSchema,
  })
  permissions: SpacePermissionDocument

  @Prop({
    type: String,
    ref: 'Company',
    required: true,
    index: true,
  })
  company: PopulatedDoc<CompanyDocument>

  @Prop({
    type: Number,
  })
  capacity: number | null

  @Prop({
    type: Number,
  })
  sort: number | null
}

export const SpaceSchema = SchemaFactory.createForClass(SpaceSchemaDefinition)

export type SpaceDocument = SpaceSchemaDefinition & BaseDocument

export const spaceSchemaFeature: ModelDefinition = {
  name: SPACE_MODEL_NAME,
  schema: SpaceSchema,
  discriminators: [
    {
      name: WORKSPACE_MODEL_NAME,
      schema: WorkspaceSchema,
    },
    {
      name: MEETING_ROOM_MODEL_NAME,
      schema: MeetingRoomSchema,
    },
  ],
}
