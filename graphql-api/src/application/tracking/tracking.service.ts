import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TrackingEventDocument } from '../../models/tracking-event.model'
import { TrackingEvent } from './tracking.interface'

@Injectable()
export class TrackingService<T extends TrackingEvent> {
  constructor(
    @InjectModel('TrackingEvent')
    private readonly trackingEventModel: Model<TrackingEventDocument>,
  ) {}

  async send<K extends T['type'], P extends Omit<Extract<T, { type: K }>, 'type'>>(event: K, data: P) {
    await this.trackingEventModel.create({
      type: event,
      data,
    })
  }
}
