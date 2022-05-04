import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { BookingType } from '../../schema'
import { AddBookingInputType, UpdateBookingInputType } from '../../schema/booking.input.type'
import { User } from '../../decorators/user.decorator'
import { BookingService } from './booking.service'
import { UserService } from '../user/user.service'
import { WorkspaceService } from '../space/workspace.service'
import { UserDocument } from '../../models/user.model'
import { BookingDocument } from '../../models/booking.model'
import { toDocumentId } from '../../utilities/document'
import { UserGroups } from '../../decorators/user-groups.decorator'
import { TrackingData } from '../tracking/tracking.decorator'
import { TrackingEvent, TrackingUserData } from '../tracking/tracking.interface'
import { TrackingService } from '../tracking/tracking.service'
import { Token } from '../../decorators/token.decorator'
import { Auth } from '../../decorators/auth.decorator'
import { BookingStatsRangeInputType } from './booking.arguments'
import { BookingStatsType } from '../../schema/booking-stats'
import { BookingStatsService } from './booking-stats.service'

@Resolver(() => BookingType)
export class BookingResolver {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingStatsService: BookingStatsService,
    private readonly userService: UserService,
    private readonly spaceService: WorkspaceService,
    private readonly trackingService: TrackingService<TrackingEvent>,
  ) {}

  @Auth()
  @Query(() => [BookingType])
  bookings(
    @Token() token: string,
    @Args({ name: 'from' }) from: string,
    @Args({ name: 'to', nullable: true }) to: string,
    @Args({ name: 'onlyOwnBookings', type: () => Boolean, nullable: true }) onlyOwnBookings = false,
    @Args({ name: 'includeFilters', type: () => Boolean, nullable: true, defaultValue: false })
    includeFilters: boolean,
    @User() user: UserDocument,
  ) {
    return this.bookingService.getByDate(token, user, from, to, onlyOwnBookings, includeFilters)
  }

  @Auth()
  @Query(() => BookingType)
  booking(@Args({ name: 'id' }) id: string, @User() user: UserDocument) {
    return this.bookingService.getById(user, id)
  }

  @Auth()
  @Mutation(() => BookingType)
  async addBooking(
    @Args({ name: 'bookingInput', type: () => AddBookingInputType }) bookingInput: AddBookingInputType,
    @User() user: UserDocument,
    @UserGroups() userGroups: string[],
    @TrackingData() trackingUserData: TrackingUserData,
  ) {
    const data = await this.bookingService.addBooking(bookingInput, user, userGroups)

    if (data) {
      const trackingData = {
        ...trackingUserData,
        note: data.note,
        spaceId: data._id,
      }

      this.trackingService.send('booking_created', trackingData)
    }

    return data
  }

  @Auth()
  @Mutation(() => Boolean)
  deleteBooking(@Args({ name: 'id' }) id: string, @User() user: UserDocument) {
    return this.bookingService.deleteBooking(id, user)
  }

  @Auth()
  @Mutation(() => BookingType)
  async updateBooking(
    @User() user: UserDocument,
    @TrackingData() trackingUserData: TrackingUserData,
    @UserGroups() userGroups: string[],
    @Args({ name: 'id' }) id: string,
    @Args({ name: 'bookingInput', type: () => UpdateBookingInputType }) bookingInput: UpdateBookingInputType,
  ) {
    const data = await this.bookingService.updateBooking(id, bookingInput, user, userGroups)

    if (data) {
      const trackingData = {
        ...trackingUserData,
        note: data.note,
        spaceId: data._id,
      }

      this.trackingService.send('booking_updated', trackingData)
    }

    return data
  }

  @ResolveField()
  user(@User() user: UserDocument, @Parent() booking: BookingDocument) {
    return booking.user ? this.userService.getById(toDocumentId(booking.user)) : null
  }

  @ResolveField()
  space(@Parent() booking: BookingDocument) {
    return this.spaceService.getById(toDocumentId(booking.space))
  }

  @Auth()
  @Query(() => BookingType, { nullable: true })
  lastBooking(
    @User() user: UserDocument,
    @Args({ name: 'spaceId' }) spaceId: string,
    @Args({ name: 'isGuestBooking', type: () => Boolean, defaultValue: false }) isGuestBooking: boolean = false,
  ) {
    return this.bookingService.lastBooking(user, spaceId, isGuestBooking)
  }

  @Auth()
  @Query(() => BookingStatsType)
  bookingStats(
    @Args({ name: 'onlyOwnBookings', type: () => Boolean, nullable: true }) limitToUser = false,
    @Args({ name: 'ranges', type: () => [BookingStatsRangeInputType] }) bookingStats: BookingStatsRangeInputType[],
    @User() user: UserDocument,
  ) {
    return this.bookingStatsService.bookingStats(user, limitToUser, bookingStats)
  }
}
