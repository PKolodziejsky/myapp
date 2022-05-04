import { CacheModule, Module } from '@nestjs/common'
import got from 'got'
import { MicrosoftRequestService } from './microsoft-request.service'
import { ConfigService } from '@nestjs/config'
import { ConfidentialClientApplication } from '@azure/msal-node'

@Module({
  imports: [
    CacheModule.register({
      max: 3000 * 10
    }),
  ],
  providers: [
    {
      provide: 'MSAL_CONFIDENTIAL_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new ConfidentialClientApplication({
          auth: {
            clientId: configService.get<string>('APP_ID')!,
            clientSecret: configService.get<string>('APP_SECRET')!,
          },
        })
      },
      inject: [ConfigService],
    },
    {
      provide: 'GOT_CLIENT',
      useFactory: () => {
        return got.extend({
          prefixUrl: 'https://graph.microsoft.com/v1.0/',
          responseType: 'json',
          resolveBodyOnly: true,
          hooks: {
            afterResponse: [
              (response) => {
                console.log({
                  type: 'graph-request',
                  url: response.url,
                  time: response.timings.phases.total
                })

                return response
              }
            ]
          }
        })
      },
    },
    MicrosoftRequestService,
  ],
  exports: [MicrosoftRequestService],
})
export class MicrosoftRequestModule {}
