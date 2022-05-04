import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('Space')
export class SpaceType {
  @Field()
  id: string

  @Field()
  name: string
}
