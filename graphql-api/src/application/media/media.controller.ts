import { Controller, Get, Param, Res } from '@nestjs/common'
import { MediaService } from './media.service'
import { User } from '../../decorators/user.decorator'
import { UserDocument } from '../../models/user.model'
import { Auth } from '../../decorators/auth.decorator'
import { Response } from 'express'

@Controller('media')
export class MediaController {
  constructor(private readonly floorPlanService: MediaService) {}

  @Auth()
  @Get(':id')
  async get(@Param('id') id: string, @User() user: UserDocument, @Res() response: Response) {
    const { readStream, contentType } = await this.floorPlanService.getStreamByIdAndCompany(id, user.company)

    response.set({ 'Content-Type': contentType })
    readStream.pipe(response)
  }
}
