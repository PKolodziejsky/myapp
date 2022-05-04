import { Injectable, OnModuleInit } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { ConfigService } from '@nestjs/config'
import { UserGroupsAndRoles } from './auth.interface'
import { CacheDataLoader } from '../../utilities'
import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service'
import { Roles } from '../../types/roles.enum'
import { GROUPS_AND_ROLES_CACHE_TTL } from './auth.constants'
import MicrosoftGraph from '@microsoft/microsoft-graph-types'

@Injectable()
export class AuthService implements OnModuleInit {
  private groupsAndRolesLoader: CacheDataLoader<string, UserGroupsAndRoles>
  private profileLoader: CacheDataLoader<string, MicrosoftGraph.User>

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly microsoftGraphService: MicrosoftGraphService,
  ) {}

  async userFromToken(tenant: string, objectId: string, token: string) {
    const { user } = await this.userService.getOrCreate(tenant, objectId)

    let groupsAndRoles

    try {
      groupsAndRoles = await this.groupsAndRolesLoader.load(token, GROUPS_AND_ROLES_CACHE_TTL)
    } catch (e) {
      console.error('[GROUPS] Could not load groupsAndRoles')

      groupsAndRoles = {
        groups: [],
        roles: [],
      }
    }

    if (tenant === '637dea52-1527-40fa-a2a6-ed45af232937' || tenant === '7bfb1286-b735-4395-8ea0-ed2c4861d742') {
      console.log('[GROUPS DEBUG]', groupsAndRoles.groups.join(','))
    }

    if (user.settings?.custom?.get('admin')) {
      groupsAndRoles.roles.push(Roles.Admin)
    }

    return {
      token,
      tenant,
      user,
      objectId,
      ...groupsAndRoles,
    }
  }

  onModuleInit() {
    this.groupsAndRolesLoader = new CacheDataLoader(async (token) => {
      return this.microsoftGraphService.getGroupsAndRoles(token)
    })

    this.profileLoader = new CacheDataLoader(async (token) => {
      return this.microsoftGraphService.me(token)
    })
  }
}
