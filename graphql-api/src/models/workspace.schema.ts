import { SpaceType } from '../types/space'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SpaceDocument, SpaceSchemaDefinition } from './space.schema'
import { SpacePermissionDocument } from './space-permission.schema'
import { PopulatedDoc } from 'mongoose'
import { MediaDocument } from './media.model'

export const WORKSPACE_MODEL_NAME = SpaceType.Workspace

@Schema()
export class WorkspaceSchemaDefinition implements SpaceSchemaDefinition {
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
    type: [String],
  })
  labels: string[]

  @Prop({
    type: Number,
  })
  hasChildren: number // Change name?

  @Prop({
    type: Boolean,
    default: false,
  })
  canHaveNote: boolean

  @Prop({
    type: [String],
    ref: 'Media',
  })
  floorPlans: PopulatedDoc<MediaDocument>
}

export const WorkspaceSchema = SchemaFactory.createForClass(WorkspaceSchemaDefinition)

export type WorkspaceDocument = WorkspaceSchemaDefinition & SpaceDocument
