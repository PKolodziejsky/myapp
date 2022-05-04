import { Field, ObjectType, Int } from '@nestjs/graphql'
import { SpaceType } from '../space.type'

@ObjectType('MeetingRoom')
export class MeetingRoomType {
  @Field()
  id: string

  @Field()
  name: string

  @Field(() => Int, { nullable: true })
  capacity?: number

  @Field(() => [SpaceType])
  rootPath: SpaceType[]

  @Field({ nullable: true })
  videoDeviceName?: string

  @Field({ nullable: true })
  audioDeviceName?: string

  @Field({ nullable: true })
  displayDeviceName?: string

  @Field(() => Boolean, { nullable: true })
  isWheelChairAccessible?: boolean

  @Field(() => Boolean)
  isFavorite: boolean
}
