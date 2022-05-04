import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { MeetingRoomType } from './meeting-room.type'
import {DateTimeRangeType} from "../date-range";

@InputType('MeetingRoomBookingsInput')
export class MeetingRoomBookingsInputType {
  @Field()
  date: string
}

@ObjectType('MeetingRoomBookingsResult')
export class MeetingRoomBookingsResultType {
  @Field(() => MeetingRoomType)
  room: MeetingRoomType

  @Field(() => DateTimeRangeType)
  dateTimeRange: DateTimeRangeType
}
