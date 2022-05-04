import { Field, ObjectType } from '@nestjs/graphql'
import { MediaData } from '../interfaces'

@ObjectType('Media')
export class MediaType implements MediaData {
  @Field()
  id: string

  @Field({ nullable: true })
  description?: string
}
