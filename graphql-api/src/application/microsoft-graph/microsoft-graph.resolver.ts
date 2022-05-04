import { Args, Query, Resolver } from '@nestjs/graphql'
import { PersonType, TeamType } from '../../schema'
import { MicrosoftGraphService } from './microsoft-graph.service'
import { Token } from '../../decorators/token.decorator'
import { PersonByDisplayNameArgs, UuidArgs } from './microsoft-graph.arguments'
import { Auth } from '../../decorators/auth.decorator'

@Resolver()
export class MicrosoftGraphResolver {
  constructor(private readonly microsoftGraphService: MicrosoftGraphService) {}

  @Auth()
  @Query(() => [TeamType])
  joinedTeams(@Token() token: string) {
    return this.microsoftGraphService.joinedTeam(token)
  }

  @Auth()
  @Query(() => [PersonType])
  groupMembers(@Token() token: string, @Args() { id }: UuidArgs) {
    return this.microsoftGraphService.groupMembers(token, id)
  }

  @Auth()
  @Query(() => PersonType)
  person(@Token() token: string, @Args() { id }: UuidArgs) {
    return this.microsoftGraphService.person(token, id)
  }

  @Auth()
  @Query(() => [PersonType])
  personByDisplayName(@Token() token: string, @Args() { name }: PersonByDisplayNameArgs) {
    return this.microsoftGraphService.personByDisplayName(token, name)
  }

  @Auth()
  @Query(() => [PersonType])
  favoritePersons(@Token() token: string) {
    return this.microsoftGraphService.favoritePersons(token)
  }
}
