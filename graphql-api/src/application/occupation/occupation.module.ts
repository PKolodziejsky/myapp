import { forwardRef, Module } from '@nestjs/common'
import { OccupationResolver } from './occupation.resolver'
import { OccupationService } from './occupation.service'
import { SpaceModule } from '../space/space.module'
import { MongooseModule } from '@nestjs/mongoose'
import { bookingSchema } from '../../models/booking.model'

@Module({
  imports: [forwardRef(() => SpaceModule), MongooseModule.forFeature([{ name: 'Booking', schema: bookingSchema }], 'default')],
  providers: [OccupationResolver, OccupationService],
  exports: [OccupationService],
})
export class OccupationModule {}
