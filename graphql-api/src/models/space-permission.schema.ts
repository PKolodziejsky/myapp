import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class SpacePermissionSchemaDefinition {
  @Prop({
    type: [String],
  })
  groups: string[]

  @Prop({
    type: [String],
  })
  inheritedGroups: string[]

  @Prop({
    type: Boolean,
  })
  inherit: boolean
}

export const SpacePermissionSchema = SchemaFactory.createForClass(SpacePermissionSchemaDefinition)

export type SpacePermissionDocument = SpacePermissionSchemaDefinition & Document
