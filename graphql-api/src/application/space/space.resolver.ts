import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { WorkspaceType } from '../../schema'
import { WorkspaceService } from './workspace.service'
import { User } from '../../decorators/user.decorator'
import { UserDocument } from '../../models/user.model'
import { UserGroups } from '../../decorators/user-groups.decorator'
import { toDocumentId } from 'src/utilities/document'
import { OccupationService } from '../occupation/occupation.service'
import { Auth } from '../../decorators/auth.decorator'
import { Roles } from '../../types/roles.enum'
import { Occupation } from '../occupation/occupation.interface'
import * as DataLoader from 'dataloader'
import { WorkspaceDocument } from '../../models/workspace.schema'

@Resolver(() => WorkspaceType)
export class SpaceResolver {
  private readonly dataLoader = new Map<string, any>()

  constructor(private readonly spaceService: WorkspaceService, private readonly occupationService: OccupationService) {}

  @Auth()
  @Query(() => [WorkspaceType])
  spaces(@User() user: UserDocument, @UserGroups() userGroups: string[]) {
    /* Temporary Dataloader start */
    const company = toDocumentId(user.company)

    return this.spaceService.getByCompany(company, userGroups)
  }

  @ResolveField()
  async status(@User() user: UserDocument, @Parent() space: WorkspaceDocument, @Args('date') date: string) {
    /* Temporary Dataloader start */
    const company = toDocumentId(user.company)

    if (!this.dataLoader.has(company)) {
      this.dataLoader.set(
        company,
        new DataLoader((dates) => Promise.all(dates.map((date: string) => this.occupationService.forCompanyBetweenDates(company, date, date))), {
          cache: false,
        }),
      )
    }

    const loader = this.dataLoader.get(space.company)
    const occupations: Occupation[] = await loader.load(date)
    /* Temporary Dataloader end */

    const status = occupations.find((occupation) => occupation.space === space.id && occupation.date === date)

    if (status) {
      return {
        capacity: space.capacity,
        ...status,
      }
    }

    return {
      date,
      capacity: space.capacity,
      occupation: 0,
      users: null,
    }
  }

  @ResolveField()
  async rootPath(@User() user: UserDocument, @Parent() space: WorkspaceDocument, @UserGroups() userGroups: string[]) {
    return await this.spaceService.getRootPathForSpace(space.id, user, userGroups)
  }

  @Auth({ roles: [Roles.Admin] })
  @Mutation(() => WorkspaceType)
  toggleDisableSpace(@User() user: UserDocument, @Args('id') id: string) {
    return this.spaceService.toggleDisableSpace(user, toDocumentId(id))
  }

  @Auth({ roles: [Roles.Admin] })
  @Mutation((returns) => Boolean)
  updateSpace(@User() user: UserDocument, @Args('id') id: string, @Args('name') name: string) {
    return this.spaceService.updateSpace(user, toDocumentId(id), name)
  }

  @Auth({ roles: [Roles.Admin] })
  @Mutation((returns) => Boolean)
  removeDeskLabel(@User() user: UserDocument, @Args('id') id: string, @Args('index') index: number) {
    return this.spaceService.removeDeskLabel(user, toDocumentId(id), index)
  }

  @Auth({ roles: [Roles.Admin] })
  @Mutation((returns) => Boolean)
  addDeskLabel(@User() user: UserDocument, @Args('id') id: string, @Args('label') label: string) {
    return this.spaceService.addDeskLabel(user, toDocumentId(id), label)
  }

  @Auth()
  @Query(() => [WorkspaceType])
  spaceRootPath(@Args('id') id: string, @User() user: UserDocument, @UserGroups() userGroups: string[]) {
    return this.spaceService.getRootPathForSpace(id, user, userGroups)
  }

  @Auth()
  @Query(() => [WorkspaceType])
  spaceChildren(
      @Args({ name: 'id', nullable: true }) id: string,
      @Args({ name: 'onlyWithMeetingRoomsAsChildren', nullable: true }) filterByMeetingRoomsAsChildren: boolean,
      @User() user: UserDocument,
      @UserGroups() userGroups: string[]
  ) {
    return this.spaceService.getSpaceChildren(id, user, userGroups, filterByMeetingRoomsAsChildren)
  }
}
