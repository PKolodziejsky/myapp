import { Injectable } from '@nestjs/common'
import { AddBookingInputType, UpdateBookingInputType } from '../../schema/booking.input.type'
import { GraphQLError } from '../../error/graphql.error'
import { WorkspaceService } from '../space/workspace.service'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { BookingDocument } from '../../models/booking.model'
import { UserDocument } from '../../models/user.model'
import { toDocumentId } from '../../utilities/document'
import { dateFromTimePeriod, getDate } from '../../utilities/date'
import { CompanyDocument } from '../../models/company.model'
import { intersect } from '../../utilities'
import { createLastBookingAggregation } from './booking.query.'
import { createBookingsByDateAggregation } from './booking.query'
import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service'
import { Person } from '../microsoft-graph/microsoft-graph.interface'
import { isStringArray } from 'src/utilities/types'
import { WORKSPACE_MODEL_NAME, WorkspaceDocument } from '../../models/workspace.schema'

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(WORKSPACE_MODEL_NAME)
    private readonly workspaceModel: Model<WorkspaceDocument>,
    private readonly spaceService: WorkspaceService,
    private readonly microsoftGraphService: MicrosoftGraphService,
  ) {}

  getById(user: UserDocument, id: string) {
    return this.bookingModel
      .findOne({
        _id: id,
        user: toDocumentId(user),
      })
      .exec()
  }

  async lastBooking(user: UserDocument, space: string, isGuestBooking: boolean) {
    const [lastBooking] = await this.workspaceModel.aggregate(createLastBookingAggregation(space, toDocumentId(user), isGuestBooking))

    if (!lastBooking || !lastBooking.id) {
      return null
    }

    return lastBooking
  }

  async getByDate(
    token: string,
    user: UserDocument,
    from: string,
    to: string = from,
    onlyOwnBookings = false,
    includeFilters: boolean,
  ): Promise<BookingDocument[]> {
    const companyId = toDocumentId(user.company)
    const userId = toDocumentId(user)

    let bookings: BookingDocument[]

    if (includeFilters) {
      const teamFilter = user.settings.custom.get('teamsFilter') ?? []
      const favoriteFilter = user.settings.custom.get('favoriteFilter') ?? false
      const spaceFilter = user.settings.custom.get('spaceFilter') ?? []

      let groupMembers: string[] = []

      if (isStringArray(teamFilter) && teamFilter.length > 0) {
        const results = await Promise.allSettled(teamFilter.map((teamId: string) => this.microsoftGraphService.groupMembers(token, teamId)))

        groupMembers = results
          .filter((response) => response.status === 'fulfilled')
          .map((response) => (response as PromiseFulfilledResult<Person[]>).value.map((person) => person.id))
          .flat()
      }

      bookings = await this.bookingModel
        .aggregate(
          createBookingsByDateAggregation({
            from,
            to,
            user: onlyOwnBookings ? userId : undefined,
            company: companyId,
            teamFilter: groupMembers,
            spaceFilter: isStringArray(spaceFilter) ? spaceFilter : [],
            favoriteFilter: favoriteFilter ? user.favorites || [] : null,
          }),
        )
        .exec()
    } else {
      bookings = await this.bookingModel
        .aggregate(
          createBookingsByDateAggregation({
            from,
            to,
            user: onlyOwnBookings ? userId : undefined,
            company: companyId,
          }),
        )
        .exec()
    }

    return bookings
  }

  async addBooking(bookingInput: AddBookingInputType, user: UserDocument, userGroups: string[] = []): Promise<BookingDocument | null> {
    const space = await this.spaceService.getById(bookingInput.spaceId)

    if (!space) {
      throw new GraphQLError('Space not found', 'SPACE_NOT_FOUND')
    }

    await this.checkBookingSpace(user, userGroups, space, bookingInput.date)

    // own booking
    if (!bookingInput.guestInfo) {
      const hasBooking = await this.hasAlreadyBookingAtDate(bookingInput.date, user)
      if (hasBooking) {
        throw new GraphQLError('Cannot exceed limit of 1 booking per day', 'BOOKING_LIMIT_EXCEEDED')
      }
    }

    // on behalf booking
    else {
      const company = (await user.populate<{ company: CompanyDocument }>('company')).company

      const guestBookingLimitExceeded = await this.hasAlreadyGuestBookingsAtDate(bookingInput.date, user, company)
      if (guestBookingLimitExceeded) {
        const maxGuestBookings = company.settings?.booking?.restrictions?.maxGuestBookings
        throw new GraphQLError(`Cannot exceed limit of ${maxGuestBookings} guest bookings per day`, 'GUEST_BOOKING_LIMIT_EXCEEDED')
      }
    }

    if (!this.isInTimeRange(bookingInput.date, user.company as CompanyDocument)) {
      throw new GraphQLError('Booking not allowed at date', 'BOOKING_DATE_NOT_ALLOWED')
    }

    const note = space?.canHaveNote && bookingInput.note !== '' ? bookingInput.note : null

    return this.bookingModel.create({
      user: toDocumentId(user),
      company: toDocumentId(user.company),
      date: bookingInput.date,
      note,
      isAnonymous: bookingInput.isAnonymous ?? false,
      space: bookingInput.spaceId,
      guestInfo: bookingInput.guestInfo,
    })
  }

  async deleteBooking(id: string, user: UserDocument): Promise<boolean> {
    const { deletedCount } = await this.bookingModel.deleteOne({
      _id: id,
      user: toDocumentId(user),
    })

    return deletedCount > 0
  }

  async updateBooking(id: string, bookingInput: UpdateBookingInputType, user: UserDocument, userGroups: string[]): Promise<BookingDocument | null> {
    const booking = await this.bookingModel.findOne({ _id: id })

    if (!booking) {
      throw new GraphQLError('Booking not found', 'BOOKING_NOT_FOUND')
    }

    const space = await this.spaceService.getById(bookingInput.spaceId ?? toDocumentId(booking.space))

    if (!space) {
      throw new GraphQLError('Space is not bookable', 'SPACE_NOT_BOOKABLE')
    }

    if (bookingInput.spaceId && bookingInput.spaceId !== booking.space) {
      await this.checkBookingSpace(user, userGroups, space, booking.date)
    }

    if ((booking.guestInfo == null && bookingInput.guestInfo != null) || (booking.guestInfo != null && bookingInput.guestInfo == null)) {
      // own booking
      if (!bookingInput.guestInfo) {
        const hasBooking = await this.hasAlreadyBookingAtDate(bookingInput.date!, user)
        if (hasBooking) {
          throw new GraphQLError('Cannot exceed limit of 1 booking per day', 'BOOKING_LIMIT_EXCEEDED')
        }
      }

      // on behalf booking
      else {
        const company = (await user.populate('company')).company as CompanyDocument

        const guestBookingLimitExceeded = await this.hasAlreadyGuestBookingsAtDate(bookingInput.date!, user, company)
        if (guestBookingLimitExceeded) {
          const maxGuestBookings = company.settings?.booking?.restrictions?.maxGuestBookings
          throw new GraphQLError(`Cannot exceed limit of ${maxGuestBookings} guest bookings per day`, 'GUEST_BOOKING_LIMIT_EXCEEDED')
        }
      }
    }

    const updateValues = {
      note: space.canHaveNote && bookingInput.note !== '' ? bookingInput.note : null,
      ...(bookingInput.isAnonymous != null && { isAnonymous: bookingInput.isAnonymous }),
      space: space.id,
      guestInfo: bookingInput.guestInfo,
    }

    return this.bookingModel.findOneAndUpdate(
      {
        _id: id,
        user: toDocumentId(user),
      },
      {
        $set: updateValues,
      },
      {
        new: true,
      },
    )
  }

  private async checkBookingSpace(
    user: UserDocument,
    userGroups: string[],
    space: Omit<WorkspaceDocument, 'floorPlans'>,
    date: string,
  ) {
    if (!space || toDocumentId(space.company) != toDocumentId(user.company)) {
      throw new GraphQLError('Space not found in company', 'SPACE_NOT_IN_COMPANY')
    }

    const permissionGroups = [...(space.permissions?.groups ?? []), ...(space.permissions?.inheritedGroups ?? [])]

    if (permissionGroups.length !== 0 && !intersect(userGroups, permissionGroups)) {
      throw new GraphQLError('Space is not accessible', 'SPACE_NOT_ACCESSIBLE')
    }

    if (space.disabled) {
      throw new GraphQLError('Space is disabled', 'SPACE_DISABLED')
    }

    const hasCapacity = await this.hasCapacityForSpaceAtDate(space, date)
    if (!hasCapacity) {
      throw new GraphQLError('The selected space is already full', 'CAPACITY_LIMIT_REACHED')
    }

    // const hasBooking = await this.hasAlreadyBookingForSpaceAtDate(space, bookingInput.date, user)
    // if (hasBooking) {
    //   throw new GraphQLError('The space is already booked', 'SPACE_ALREADY_BOOKED_BY_USER')
    // }
  }

  private async hasCapacityForSpaceAtDate(space: Omit<WorkspaceDocument, 'floorPlans'>, date: string): Promise<boolean> {
    if (space.capacity == null) {
      return true
    }

    const bookingsAtDateForSpace = await this.bookingModel.count({
      space,
      date,
    })

    return bookingsAtDateForSpace < space.capacity
  }

  private async hasAlreadyBookingForSpaceAtDate(space: WorkspaceDocument, date: string, user: UserDocument): Promise<boolean> {
    const bookingsAtDateForSpace = await this.bookingModel.count({
      user: toDocumentId(user),
      space,
      date,
    })

    return bookingsAtDateForSpace > 0
  }

  private async hasAlreadyBookingAtDate(date: string, user: UserDocument): Promise<boolean> {
    const bookingAtDate = await this.bookingModel.count({
      user: toDocumentId(user),
      guestInfo: null,
      date,
    })

    return bookingAtDate > 0
  }

  private async hasAlreadyGuestBookingsAtDate(date: string, user: UserDocument, company: CompanyDocument): Promise<boolean> {
    const maxGuestBookings = company.settings?.booking?.restrictions?.maxGuestBookings

    if (maxGuestBookings === 0) return true
    if (!maxGuestBookings) return false

    const bookingsAtDate = await this.bookingModel.count({
      user: toDocumentId(user),
      guestInfo: { $ne: null },
      date,
    })

    return bookingsAtDate >= maxGuestBookings
  }

  private isInTimeRange(date: string, company: CompanyDocument) {
    const restrictions = company.settings?.booking?.restrictions?.defaults

    if (restrictions) {
      const bookingDate = getDate(date)

      if (restrictions.future && bookingDate > dateFromTimePeriod(restrictions.future)) {
        return false
      }

      if (restrictions.past && bookingDate < dateFromTimePeriod(restrictions.past)) {
        return false
      }
    }

    return true
  }
}
