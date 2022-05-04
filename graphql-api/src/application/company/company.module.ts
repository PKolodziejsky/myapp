import { forwardRef, Module } from '@nestjs/common'
import { CompanyResolver } from './company.resolver'
import { CompanyService } from './company.service'
import { UserModule } from '../user/user.module'
import { SpaceModule } from '../space/space.module'
import { MongooseModule } from '@nestjs/mongoose'
import { companySchema } from '../../models/company.model'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Company', schema: companySchema }], 'default'), forwardRef(() => UserModule), SpaceModule],
  providers: [CompanyResolver, CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
