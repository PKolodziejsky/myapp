import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { BookingDocument } from '../../models/booking.model'
import { createBookingStatsAggregation } from './booking-stats.query'
import { UserDocument } from '../../models/user.model'
import { toDocumentId } from '../../utilities/document'
import { BookingStatsRangeInputType } from './booking.arguments'

@Injectable()
export class BookingStatsService {
  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async bookingStats(user: UserDocument, limitToUser: boolean, ranges: BookingStatsRangeInputType[]) {
    const companyId = toDocumentId(user.company)
    const userId = toDocumentId(user)

    if (ranges.length === 0) {
      return {
        ranges: []
      }
    }

    const [result] = await this.bookingModel.aggregate(createBookingStatsAggregation(limitToUser ? userId : null, companyId, ranges))

    return {
      ranges: result.ranges,
    }
  }
}
