import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { BookingModule } from './application/booking/booking.module'
import { CompanyModule } from './application/company/company.module'
import { UserModule } from './application/user/user.module'
import { AuthModule } from './application/auth/auth.module'
import { OccupationModule } from './application/occupation/occupation.module'
import { SpaceModule } from './application/space/space.module'
import { MediaModule } from './application/media/media.module'
import { MongooseModule } from '@nestjs/mongoose'
import { createConnection } from './utilities/connection'
import { trackingDataFromRequest } from './application/tracking/tracking.utility'
import { MicrosoftGraphModule } from './application/microsoft-graph/microsoft-graph.module'
import { MicrosoftIdentityModule } from './application/microsoft-identity/microsoft-identity.module'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { MicrosoftRequestModule } from './application/microsoft-request/microsoft-request.module';
import { HealthModule } from './application/health/health.module';
import GraphQLJSON from 'graphql-type-json'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'default',
      useFactory: (configService: ConfigService) => createConnection(configService, {}),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      connectionName: 'logs',
      useFactory: (configService: ConfigService) => createConnection(configService, { configSuffix: 'LOGS' }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: true,
        debug: configService.get<string>('GRAPHQL_DEBUG') === 'true',
        playground: configService.get<string>('GRAPHQL_PLAYGROUND') === 'true',
        path: configService.get<string>('GRAPHQL_PATH'),
        useGlobalPrefix: true,
        context: ({ req }) => ({
          request: req,
          tracking: trackingDataFromRequest(req),
        }),
        resolvers: {
          JSON: GraphQLJSON,
        },
        cors: {
          credentials: true,
          origin: true,
        },
      }),
      inject: [ConfigService],
    }),
    SpaceModule,
    BookingModule,
    CompanyModule,
    UserModule,
    AuthModule,
    OccupationModule,
    MediaModule,
    MicrosoftGraphModule,
    MicrosoftIdentityModule,
    MicrosoftRequestModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {}
