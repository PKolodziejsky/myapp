import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { User } from 'src/decorators/user.decorator'
import { UserDocument } from 'src/models/user.model'
import { SpaceStatusType } from '../../schema/space-status'
import { UserService } from '../user/user.service'
import { SpaceStatus } from './space.interface'

@Resolver(() => SpaceStatusType)
export class SpaceStatusResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField()
  async users(@Parent() space: SpaceStatus, @User() user: UserDocument) {
    if (space.capacity === 1 && space.users?.length === 1) {
      if (space.hasAnonymous[0] && space.users[0] !== user.id) {
        return null
      }

      const spaceUser = await this.userService.getById(space.users[0])

      return spaceUser ? [spaceUser] : null
    }

    return null
  }
}
