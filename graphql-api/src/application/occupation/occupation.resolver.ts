import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { OccupationService } from './occupation.service'
import { OccupationType } from '../../schema'
import { Occupation } from './occupation.interface'
import { User } from '../../decorators/user.decorator'
import { WorkspaceService } from '../space/workspace.service'
import { UserDocument } from '../../models/user.model'
import { Auth } from '../../decorators/auth.decorator'

@Resolver(() => OccupationType)
export class OccupationResolver {
  constructor(private readonly occupationService: OccupationService, private readonly spaceService: WorkspaceService) {}

  @Auth()
  @Query(() => [OccupationType])
  occupation(@Args({ name: 'from' }) from: string, @Args({ name: 'to', nullable: true }) to: string, @User() user: UserDocument) {
    return this.occupationService.forCompanyBetweenDates(user.company, from, to)
  }

  @ResolveField()
  space(@Parent() capacity: Occupation) {
    return this.spaceService.getById(capacity.space)
  }
}
