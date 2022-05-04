import { forwardRef, Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { CompanyModule } from '../company/company.module'
import { MongooseModule } from '@nestjs/mongoose'
import { userSchema } from '../../models/user.model'
import { TrackingModule } from '../tracking/tracking.module'
import { MicrosoftGraphModule } from '../microsoft-graph/microsoft-graph.module'
import {SpaceModule} from "../space/space.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }], 'default'),
    forwardRef(() => CompanyModule),
    forwardRef(() => SpaceModule),
    TrackingModule,
    MicrosoftGraphModule,
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
