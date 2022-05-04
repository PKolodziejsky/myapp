import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { DateTimeRangeInputType } from '../date-range'
import { MeetingRoomType } from './meeting-room.type'

@InputType('FindMeetingRoomInput')
export class FindMeetingRoomInputType {
  @Field(() => DateTimeRangeInputType)
  dateTimeRange: DateTimeRangeInputType

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  space?: string

  @Field(() => Int, { nullable: true })
  minCapacity?: number

  @Field(() => Boolean, { nullable: true })
  filterByAudioDevice?: boolean

  @Field(() => Boolean, { nullable: true })
  filterByVideoDevice?: boolean

  @Field(() => Boolean, { nullable: true })
  filterByDisplayDevice?: boolean

  @Field(() => Boolean, { nullable: true })
  isWheelChairAccessible?: boolean
}

@ObjectType('FindMeetingRoomResult')
export class FindMeetingRoomResultType {
  @Field(() => MeetingRoomType)
  room: MeetingRoomType

  @Field(() => Boolean)
  isAvailable: boolean
}
