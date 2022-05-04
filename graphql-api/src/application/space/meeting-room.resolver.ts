import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from '../../decorators/auth.decorator'
import {
  CreateMeetingRoomBookingInputType,
  FindMeetingRoomInputType,
  FindMeetingRoomResultType,
  MeetingRoomBookingsInputType,
  MeetingRoomBookingsResultType,
} from '../../schema'
import { User } from '../../decorators/user.decorator'
import { UserDocument } from '../../models/user.model'
import { MeetingRoomService } from './meeting-room.service'
import {Token} from "../../decorators/token.decorator";

@Resolver()
export class MeetingRoomResolver {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @Auth()
  @Query(() => [FindMeetingRoomResultType])
  findMeetingRooms(
    @User() user: UserDocument,
    @Token() token: string,
    @Args({ name: 'input', type: () => FindMeetingRoomInputType }) input: FindMeetingRoomInputType,
  ): Promise<FindMeetingRoomResultType[]> {
    return this.meetingRoomService.findMeetingRooms(user, token, input)
  }

  @Auth()
  @Mutation(() => Boolean)
  createMeetingRoomBooking(
    @User() user: UserDocument,
    @Token() token: string,
    @Args({ name: 'input', type: () => CreateMeetingRoomBookingInputType }) input: CreateMeetingRoomBookingInputType,
  ): Promise<boolean> {
    return this.meetingRoomService.createMeetingRoomBooking(user, token, input)
  }

  @Auth()
  @Query(() => [MeetingRoomBookingsResultType])
  meetingRoomBookings(
    @User() user: UserDocument,
    @Token() token: string,
    @Args({ name: 'input', type: () => MeetingRoomBookingsInputType }) input: MeetingRoomBookingsInputType,
  ): Promise<MeetingRoomBookingsResultType[]> {
    return this.meetingRoomService.getMeetingRoomBookings(user, token, input)
  }
}
