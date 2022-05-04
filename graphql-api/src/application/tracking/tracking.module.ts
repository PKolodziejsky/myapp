import { Module } from '@nestjs/common'
import { TrackingService } from './tracking.service'
import { MongooseModule } from '@nestjs/mongoose'
import { trackingEventSchema } from '../../models/tracking-event.model'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'TrackingEvent', schema: trackingEventSchema, collection: 'tracking-events' }], 'logs')],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {}
