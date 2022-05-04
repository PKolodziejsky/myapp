import { Prop, SchemaOptions } from '@nestjs/mongoose'
import { v4 as uuid } from 'uuid'
import { Document } from 'mongoose'

export abstract class BaseSchemaDefinition {
  @Prop({
    type: String,
    default: uuid(),
  })
  _id: string
}

export type BaseDocument = BaseSchemaDefinition & Document<string>

export const baseSchemaOptions: Omit<SchemaOptions, 'collection'> = {
  timestamps: true
}
