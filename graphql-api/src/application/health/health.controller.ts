import {All, Controller, HttpCode} from '@nestjs/common';

@Controller('healthcheck')
export class HealthController {

  @All()
  @HttpCode(200)
  check() {
    return
  }
}
