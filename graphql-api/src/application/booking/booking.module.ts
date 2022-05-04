import { forwardRef, Module } from '@nestjs/common'
import { BookingResolver } from './booking.resolver'
import { BookingService } from './booking.service'
import { UserModule } from '../user/user.module'
import { SpaceModule } from '../space/space.module'
import { MongooseModule } from '@nestjs/mongoose'
import { bookingSchema } from '../../models/booking.model'
import { TrackingModule } from '../tracking/tracking.module'
import { MicrosoftGraphModule } from '../microsoft-graph/microsoft-graph.module'
import { BookingStatsService } from './booking-stats.service'
import { CompanyModule } from '../company/company.module'

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: 'Booking', schema: bookingSchema },
      ],
      'default',
    ),
    forwardRef(() => UserModule),
    SpaceModule,
    TrackingModule,
    MicrosoftGraphModule,
    CompanyModule,
  ],
  providers: [BookingResolver, BookingService, BookingStatsService],
})
export class BookingModule {}
