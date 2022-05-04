import { Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CompanyModule } from '../company/company.module'
import { UserModule } from '../user/user.module'
import { MicrosoftGraphModule } from '../microsoft-graph/microsoft-graph.module'
import { AzureStrategy } from './azure.strategy'
import { HttpModule } from '@nestjs/axios'

@Global()
@Module({
  imports: [MicrosoftGraphModule, UserModule, HttpModule, CompanyModule],
  providers: [AuthService, AzureStrategy],
  controllers: [],
})
export class AuthModule {}
