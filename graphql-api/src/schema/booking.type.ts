import { Field, ObjectType } from '@nestjs/graphql'
import { WorkspaceType } from './workspace.type'
import { UserType } from './user.type'

@ObjectType('Booking')
export class BookingType {
  @Field()
  id: string

  @Field()
  date: string

  @Field(() => UserType, { nullable: true })
  user: UserType

  @Field(() => WorkspaceType)
  space: WorkspaceType

  @Field({ nullable: true })
  note?: string

  @Field(() => Boolean, { nullable: true })
  isAnonymous?: boolean

  @Field({ nullable: true })
  guestInfo?: string
}
