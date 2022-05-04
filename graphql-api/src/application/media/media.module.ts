import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { MongooseModule } from '@nestjs/mongoose'
import { mediaSchema } from '../../models/media.model'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Media', schema: mediaSchema }], 'default')],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
