import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './application.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const application = await NestFactory.create(ApplicationModule)

  const configService = application.get(ConfigService)

  application.useGlobalPipes(new ValidationPipe())

  application.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })

  await application.listen(configService.get<number>('PORT', 3000))
}

bootstrap()
