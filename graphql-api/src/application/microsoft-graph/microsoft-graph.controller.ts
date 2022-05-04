import { Controller, Get, NotFoundException, Param, Req, Res } from '@nestjs/common'
import { Token } from '../../decorators/token.decorator'
import { MicrosoftGraphService } from './microsoft-graph.service'
import { Request, Response } from 'express'
import { UuidParams } from './microsoft-graph.parameters'
import { Auth } from '../../decorators/auth.decorator'

@Controller('microsoft')
export class MicrosoftGraphController {
  constructor(private readonly microsoftGraphService: MicrosoftGraphService) {}

  @Auth()
  @Get('profile/:id/image')
  async profileImage(@Req() request: Request, @Res() response: Response, @Token() token: string, @Param() { id }: UuidParams) {
    const fileStream = await this.microsoftGraphService.profileImageStream(token, id)
        .catch(() => {
          throw new NotFoundException('Image not found')
        })

    response.setHeader('Cache-Control', 'max-age=3600;')

    fileStream
      .on('error', () => {
        response.status(404)
        response.end()
      })
      .pipe(response)
  }
}
