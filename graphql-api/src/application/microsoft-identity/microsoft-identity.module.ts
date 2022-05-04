import { Module } from '@nestjs/common'
import { MicrosoftIdentityService } from './microsoft-identity.service'
import { ConfigService } from '@nestjs/config'
import { ConfidentialClientApplication } from '@azure/msal-node'

@Module({
  providers: [
    MicrosoftIdentityService,
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
  ],
  exports: ['MSAL_CONFIDENTIAL_CLIENT', MicrosoftIdentityService],
})
export class MicrosoftIdentityModule {}
