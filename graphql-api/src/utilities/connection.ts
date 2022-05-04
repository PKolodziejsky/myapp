import { ConfigService } from '@nestjs/config'
import { MongooseModuleOptions } from '@nestjs/mongoose'

const isEmpty = (string?: string) => string === '' || !string

type CreateConnectionOptions = {
  configSuffix?: string
}

export const createConnection = (configService: ConfigService, { configSuffix }: CreateConnectionOptions): MongooseModuleOptions => {
  const suffix = configSuffix ? `_${configSuffix}` : ''

  const port = configService.get(`MONGO_DB_PORT${suffix}`)

  return {
    uri: `${configService.get(`MONGO_DB_CONNECTION${suffix}`)}://${configService.get(`MONGO_DB_HOST${suffix}`)}${isEmpty(port) ? '' : `:${port}`}`,
    dbName: configService.get(`MONGO_DB_NAME${suffix}`),
    user: configService.get(`MONGO_DB_USER${suffix}`),
    pass: configService.get(`MONGO_DB_PASSWORD${suffix}`),
    w: 'majority',
  }
}
