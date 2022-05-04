import { HttpModule } from '@nestjs/axios'
import { MicrosoftGraphService } from './microsoft-graph.service'
import { MicrosoftGraphResolver } from './microsoft-graph.resolver'
import { MicrosoftGraphController } from './microsoft-graph.controller'
import { MicrosoftIdentityModule } from '../microsoft-identity/microsoft-identity.module'
import { CacheModule, Module } from '@nestjs/common'
import {MicrosoftRequestModule} from "../microsoft-request/microsoft-request.module";

@Module({
  imports: [
    MicrosoftRequestModule,
    CacheModule.register(),
    MicrosoftIdentityModule,
    HttpModule.register({
      baseURL: 'https://graph.microsoft.com/v1.0/',
    }),
  ],
  providers: [MicrosoftGraphService, MicrosoftGraphResolver],
  exports: [MicrosoftGraphService],
  controllers: [MicrosoftGraphController],
})
export class MicrosoftGraphModule {}
