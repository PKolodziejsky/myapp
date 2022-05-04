import { Injectable } from '@nestjs/common'
import { WorkspaceService } from '../space/workspace.service'
import { addOccupationsForParent } from '../../utilities/spaces'
import { Occupation } from './occupation.interface'
import { CompanyDocument } from '../../models/company.model'
import { toDocumentId } from '../../utilities/document'
import { Model, Types } from 'mongoose'
import { BookingDocument } from '../../models/booking.model'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class OccupationService {
  constructor(
    private readonly spaceService: WorkspaceService,
    @InjectModel('Booking')
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async forCompanyBetweenDates(company: string | CompanyDocument, from: string, to: string = from): Promise<Occupation[]> {
    const occupations = await this.bookingModel
      .aggregate([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to,
            },
            company: toDocumentId(company),
          },
        },
        {
          $group: {
            _id: {
              date: '$date',
              space: '$space',
            },
            space: {
              $first: '$space',
            },
            date: {
              $first: '$date',
            },
            occupation: {
              $sum: 1,
            },
            users: {
              $push: '$user',
            },
            hasAnonymous: {
              $push: '$isAnonymous',
            },
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ])
      .exec()

    const spaces = await this.spaceService.getByCompany(company)

    return addOccupationsForParent(occupations, spaces)
  }
}
