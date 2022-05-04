import { forwardRef, Module } from '@nestjs/common'
import { WorkspaceService } from './workspace.service'
import { SpaceResolver } from './space.resolver'
import { MediaModule } from '../media/media.module'
import { MongooseModule } from '@nestjs/mongoose'
import { OccupationModule } from '../occupation/occupation.module'
import { SpaceStatusResolver } from './space-status.resolver'
import { UserModule } from '../user/user.module'
import { spaceSchemaFeature } from '../../models/space.schema'
import { MeetingRoomService } from './meeting-room.service'
import {MicrosoftGraphModule} from "../microsoft-graph/microsoft-graph.module";
import {MeetingRoomResolver} from "./meeting-room.resolver";

@Module({
  imports: [MongooseModule.forFeature([spaceSchemaFeature], 'default'), MicrosoftGraphModule, MediaModule, forwardRef(() => OccupationModule), forwardRef(() => UserModule)],
  providers: [WorkspaceService, SpaceResolver, SpaceStatusResolver, MeetingRoomService, MeetingRoomResolver],
  exports: [WorkspaceService, MeetingRoomService, MongooseModule],
})
export class SpaceModule {}
