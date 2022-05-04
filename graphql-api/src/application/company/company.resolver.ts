import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { CompanyType } from '../../schema'
import { Tenant } from '../../decorators/tenant.decorator'
import { CompanyService } from './company.service'
import { UserService } from '../user/user.service'
import { WorkspaceService } from '../space/workspace.service'
import { CompanyDocument } from '../../models/company.model'
import { Auth } from '../../decorators/auth.decorator'

@Resolver(() => CompanyType)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService, private readonly userService: UserService, private readonly spaceService: WorkspaceService) {}

  @Auth()
  @Query(() => CompanyType)
  company(@Tenant() tenant: string) {
    return this.companyService.getByTenant(tenant)
  }

  @ResolveField()
  users(@Parent() company: CompanyDocument) {
    return this.userService.getByCompany(company)
  }

  @ResolveField()
  async spaces(@Parent() company: CompanyDocument) {
    return this.spaceService.getByCompany(company)
  }
}
