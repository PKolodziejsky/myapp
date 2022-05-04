import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { UserSettingsType, UserType } from '../../schema'
import { UserService } from './user.service'
import { SetSettingsArguments } from './settings.arguments'
import { User } from '../../decorators/user.decorator'
import { UserDocument } from '../../models/user.model'
import { TrackingEvent } from '../tracking/tracking.interface'
import { TrackingService } from '../tracking/tracking.service'
import { Auth } from '../../decorators/auth.decorator'
import { Token } from '../../decorators/token.decorator'
import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service'
import { UserRoles } from '../../decorators/user-roles.decorator'
import { Roles } from '../../types/roles.enum'
import {MeetingRoomService} from "../space/meeting-room.service";

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly trackingService: TrackingService<TrackingEvent>,
    private readonly microsoftGraphService: MicrosoftGraphService,
    private readonly meetingRoomService: MeetingRoomService,
  ) {}

  @Auth()
  @Query(() => UserType)
  user(@User() user: UserDocument) {
    return user
  }

  @ResolveField()
  person(@Token() token: string, @Parent() user: UserDocument) {
    return this.microsoftGraphService.person(token, user.objectId)
  }

  @ResolveField()
  async isFavorite(@Parent() parent: UserDocument, @User() user: UserDocument) {
    return user.favorites?.includes(parent._id) ?? false
  }

  @ResolveField()
  async favorites(@Parent() parent: UserDocument, @User() user: UserDocument) {
    if (user._id !== parent._id) {
      return null
    }

    await this.userService.addFavoritesToUser(user)

    return (user.favorites as any as UserDocument[]).map((user) => {
      return {
        id: user.id,
        objectId: user.objectId,
        isFavorite: true,
      }
    })
  }

  @ResolveField()
  async favoriteMeetingRooms(
      @Parent() parent: UserDocument,
      @User() user: UserDocument,
      @Token() token: string,
  ) {
    if (user._id !== parent._id) {
      return null
    }

    return await this.meetingRoomService.getFavoriteMeetingRooms(user, token)
  }

  @Auth()
  @Query(() => [UserType])
  async users(
    @Args({ type: () => String, name: 'name', nullable: true, defaultValue: null }) name: string | null,
    @Token() token: string,
    @User() user: UserDocument,
  ) {
    if (name != null && name !== '') {
      const persons = await this.microsoftGraphService.personByDisplayName(token, name)
      return this.userService.getByObjectIds(persons.map((person: any) => person.id))
    } else {
      return this.userService.getByCompany(user.company)
    }
  }

  @Auth({ roles: [Roles.Admin] })
  @Query(() => [UserType])
  admins(@User() user: UserDocument) {
    return this.userService.getAdmins(user.company)
  }

  @Auth()
  @Mutation(() => Boolean)
  async setCustomUserSetting(@Args() { key, value, objectId }: SetSettingsArguments, @User() user: UserDocument, @UserRoles() roles: Roles[]) {
    if (key === 'admin' && !roles.includes(Roles.Admin)) {
      return false
    }

    const id = objectId ?? user.objectId

    return this.userService.customSetting(key, value, id)
  }

  @Auth()
  @Mutation(() => UserType)
  async addFavorite(@User() user: UserDocument, @Args({ name: 'user' }) favorite: string) {
    await this.userService.addFavorite(user, favorite)
    return this.userService.getById(favorite)
  }

  @Auth()
  @Mutation(() => UserType, { nullable: true })
  async removeFavorite(@User() user: UserDocument, @Args({ name: 'user' }) favorite: string) {
    await this.userService.removeFavorite(user, favorite)
    return this.userService.getById(favorite)
  }

  @Auth()
  @Mutation(() => Boolean)
  async addFavoriteMeetingRoom(@User() user: UserDocument, @Token() token: string, @Args({ name: 'id' }) favorite: string): Promise<boolean> {
    try {
      await this.userService.addFavoriteMeetingRoom(user, token, favorite)

      return true
    } catch (e) {
      return false
    }
  }

  @Auth()
  @Mutation(() => Boolean, { nullable: true })
  async removeFavoriteMeetingRoom(@User() user: UserDocument, @Args({ name: 'id' }) favorite: string): Promise<boolean> {
    try {
      await this.userService.removeFavoriteMeetingRoom(user, favorite)

      return true
    } catch (e) {
      return false
    }
  }

  @ResolveField()
  settings(@User() user: UserDocument, @Parent() parent: UserDocument) {
    if (user._id !== parent._id) {
      return null
    }

    return parent.settings as any as UserSettingsType
  }

  @ResolveField()
  isAdmin(@UserRoles() roles: Roles[], @Parent() parent: UserDocument, @User() user: UserDocument) {
    if (user._id !== parent._id) {
      return parent.settings?.custom?.get('admin') ?? false
    }

    return roles.includes(Roles.Admin)
  }
}
