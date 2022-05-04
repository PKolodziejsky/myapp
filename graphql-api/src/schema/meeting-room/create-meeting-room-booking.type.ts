import {Field, InputType} from "@nestjs/graphql";
import {DateTimeRangeInputType} from "../date-range";
import {IsUUID} from "class-validator";

@InputType('CreateMeetingRoomBookingInput')
export class CreateMeetingRoomBookingInputType {
  @Field()
  subject: string

  @Field()
  @IsUUID()
  room: string

  @Field(() => DateTimeRangeInputType)
  dateTimeRange: DateTimeRangeInputType
}
