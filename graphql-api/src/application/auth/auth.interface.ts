import { MicrosoftUserProfile } from '../../types/profile.interface'
import { Roles } from '../../types/roles.enum'

export interface TokenProfile {
  token: string
  tenant: string
  objectId: string
  profile: MicrosoftUserProfile
}

export interface MicrosoftIdentityAccessToken {
  tid: string
  oid: string
  exp: number
}

export interface UserGroupsAndRoles {
  groups: string[]
  roles: Roles[]
}

export interface AzureAccessTokenPayload {
  token: string
  oid: string
  tenant: string
  tid: string
  objectId: string
  appid: string
  profile: MicrosoftUserProfile
}
