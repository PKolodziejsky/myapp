import { Field, Int, ObjectType } from '@nestjs/graphql'
import { UserType } from './user.type'

@ObjectType('SpaceStatus')
export class SpaceStatusType {
  @Field()
  date: string

  @Field(() => Int)
  occupation: number

  @Field(() => [UserType], { nullable: true })
  users?: UserType[] | null
}
