import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { Roles } from '../types/roles.enum'
import { RolesGuard } from '../guards/roles.guard'
import { AzureGuard } from '../application/auth/azure.guard'

interface AuthOptions {
  roles?: Roles[]
}

export const Auth = (options: AuthOptions = {}) => {
  const { roles } = options

  return applyDecorators(SetMetadata('roles', roles), UseGuards(AzureGuard, RolesGuard))
}
